from app import app
from app import config
from flask import render_template

@app.route('/')
@app.route('/index')
def index():
  return render_template('index.html',api_key = config.MAPS_API_KEY)
