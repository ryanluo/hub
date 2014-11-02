from flask import flash, redirect, render_template, request, url_for
from flask.ext.login import current_user, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from app import app, login_manager

import firebase
from forms import LoginForm, RegisterForm
from models import User


@login_manager.user_loader
def load_user(userid):
    r = firebase.get('/users/' + userid + '.json')
    return User(userid, r['names'], r['languages'], r['email'], r['password'])


@app.context_processor
def inject_user():
    """Ensure that the user object and login form are available for all
    templates."""
    return dict(user=current_user, login_form=LoginForm())


@app.route('/')
@app.route('/index')
def index():
    form = LoginForm()
    return render_template('index.html', login_form=form, user=current_user)


@app.route('/login', methods=['POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = firebase.get('/users/' + form.teamname.data + '.json')
        if user and check_password_hash(user[u'password'], form.password.data):
            u = load_user(form.teamname.data)
            login_user(u)
            flash('Successfully logged in.', 'success')
            return redirect(request.args.get('next') or url_for('index'))
        flash('Invalid team name or password.', 'danger')
        return redirect(url_for('index'))
    flash('Please enter a team name and password.', 'danger')
    return redirect(url_for('index'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if request.method == 'POST' and form.validate():
        user_data = {
            'names': [name.strip() for name in form.names.data.split(",")],
            'languages': form.languages.data,
            'email': form.email.data,
            # We store a hash of the password instead of the actual password so
            # that if our database is compromised, no one can read the
            # passwords.
            'password': generate_password_hash(form.password.data)
        }
        teamname = form.teamname.data
        ref = '/users/' + teamname + '.json'

        if firebase.get(ref):
            flash('Team name already registered.', 'danger')
            return redirect(url_for('index'))

        firebase.put(ref, user_data)
        return redirect(url_for('index'))
    return render_template('register.html', form=form)


@app.route('/logout', methods=['POST'])
def logout():
    firebase.delete('/teams/' + current_user.teamname + '.json')
    logout_user()
    flash('Logged out successfully.', 'success')
    return redirect('/')
