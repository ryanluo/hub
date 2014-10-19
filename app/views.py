from app import app
from app import config
from flask import render_template, url_for

@app.route('/')
@app.route('/index')
def index():
  return render_template('index.html',
                         API_KEY=config.MAPS_API_KEY,
                         DRAW_AND_SAVE = url_for('static',filename='js/draw_and_save.js'),
                         MAP_INTERFACE = url_for('static',filename='js/map_interface.js'))
