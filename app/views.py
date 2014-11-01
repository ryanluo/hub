from flask import flash, redirect, render_template, request, url_for
from flask.ext.login import login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from app import app, models, login_manager, logged_user

import firebase
from forms import LoginForm, RegisterForm

@login_manager.user_loader
def load_user(userid):
    r = firebase.get('/users/' + userid + '.json')
    global logged_user
    logged_user = models.User(userid, r[u'names'], r[u'languages'], r[u'email'], r[u'password'])
    return logged_user

@app.route('/')
@app.route('/index')
def index():
    form = LoginForm()
    logged_in = logged_user != None
    return render_template(
        'index.html',
        form=form,
        logged_in=logged_in,
        logged_user=logged_user)


@app.route('/login', methods=('GET','POST'))
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = firebase.get('/users/' + form.teamname.data + '.json')
        if user and check_password_hash(user[u'password'], form.password.data):
            u = load_user(form.teamname.data)
            login_user(u)
            flash('Successfully logged in.')
            return redirect(request.args.get('next') or url_for('index'))
        flash("Log in failed, invalid username/password combination") 
        return redirect(url_for('index'))
    flash('Form not validated')
    return redirect(url_for('index'))

@app.route('/register', methods=('GET', 'POST'))
def register():
    form = RegisterForm()
    if form.validate():
        user_data = {
            'names': form.names.data.split(","),
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
          flash('Error: Team already defined, registration failed.')
          return redirect(url_for('index'))

        firebase.put(ref, user_data)
        return redirect(url_for('index'))
    return render_template('register.html', form=form)

@app.route('/logout', methods=('GET','POST'))
def logout():
    logout_user()
    flash('Logged out successfully.')
    global logged_user
    logged_user = None
    return redirect('/')
