from app import app
from app import config
from flask import render_template, url_for

@app.route('/')
@app.route('/index')
def index():
  return render_template('index.html',
                         API_KEY=config.MAPS_API_KEY,
                         FIREBASE_INTERFACE = url_for('static',filename='js/firebase_interface.js'),
                         MAP_INTERFACE = url_for('static',filename='js/map_interface.js'))
