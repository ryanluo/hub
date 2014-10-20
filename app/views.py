import os

from app import app

from flask import render_template, url_for

@app.route('/')
@app.route('/index')
def index():
  return render_template('index.html',
                         API_KEY = os.environ['MAPS_API_KEY'],
                         FIREBASE_INTERFACE = url_for('static',filename='js/firebase_interface.js'),
                         MAP_INTERFACE = url_for('static',filename='js/map_interface.js'))
