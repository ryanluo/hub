import os


class Config(object):
    FIREBASE_URL = 'https://hub-test.firebaseio.com'
    MAPS_API_KEY = os.environ['MAPS_API_KEY']
    SECRET_KEY = os.environ['SECRET_KEY']
