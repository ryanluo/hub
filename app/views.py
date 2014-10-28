from flask import flash, redirect, render_template, request, url_for
from flask.ext.login import login_user
from werkzeug.security import check_password_hash, generate_password_hash

from app import app, models, login_manager

import firebase
from forms import LoginForm, RegisterForm

@login_manager.user_loader
def load_user(userid):
    r = firebase.get('/users/' + userid + '.json')
    print r
    return models.User(userid, r[u'name'], r[u'email'], r[u'password'])

@app.route('/')
@app.route('/index')
def index():
    form = LoginForm()
    return render_template('index.html', form=form)


@app.route('/login', methods=('GET','POST'))
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = firebase.get('/users/' + form.username.data + '.json')
        if user and check_password_hash(user[u'password'], form.password.data):
            u = load_user(form.username.data)
            print u
            login_user(u)
            flash('Successfully logged in.')
            return redirect(request.args.get('next') or url_for('index'))
        return "wrong username/pass"
    return "form not validated"

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
        username = form.username.data

        print firebase.put('/users/' + username+ '.json', user_data)
        return redirect(url_for('index'))
    return render_template('register.html', form=form)
