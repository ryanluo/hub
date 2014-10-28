from flask import Flask
from flask.ext.login import LoginManager

app = Flask(__name__)
app.config.from_object('app.config.Config')

import firebase

login_manager = LoginManager()
login_manager.init_app(app)

from app import views
