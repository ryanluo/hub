from flask import flash, redirect, render_template, request, url_for
from flask.ext.login import login_user
from werkzeug.security import check_password_hash, generate_password_hash

from app import app
import firebase
from forms import LoginForm, RegisterForm


@app.route('/')
@app.route('/index')
def index():
    form = LoginForm()
    return render_template('index.html', form=form)


@app.route('/login', methods=('POST'))
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = firebase.get('/users' + form.email)
        if user and check_password_hash(user.password, form.password):
            login_user(form.email)
            flash('Successfully logged in.')
            return redirect(request.args.get('next') or url_for('index'))


@app.route('/register', methods=('GET', 'POST'))
def register():
    form = RegisterForm()
    if form.validate():
        user_data = {
            'name': form.name.data,
            'email': form.email.data,
            # We store a hash of the password instead of the actual password so
            # that if our database is compromised, no one can read the
            # passwords.
            'password': generate_password_hash(form.password.data)
        }

        firebase.post('/users.json', user_data)
        return redirect(url_for('index'))
    return render_template('register.html', form=form)
