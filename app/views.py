from app import app
from forms import RegisterForm

from flask import redirect, render_template, url_for


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/register', methods=('GET', 'POST'))
def register():
    form = RegisterForm()
    if form.validate():
        return redirect(url_for('index'))
    return render_template('register.html', form=form)
