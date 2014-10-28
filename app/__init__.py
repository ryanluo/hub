from flask import Flask
from flask.ext.login import LoginManager

import firebase

app = Flask(__name__)
app.config.from_object('app.config.Config')

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(userid):
    r = firebase.get('/users.json')
    return r

from app import views
