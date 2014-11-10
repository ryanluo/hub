import json

import requests

from app import app


FIREBASE_URL = app.config['FIREBASE_URL']


def get(url):
    return requests.get(FIREBASE_URL + url).json()


def put(url, data):
    return requests.put(FIREBASE_URL + url, data=json.dumps(data)).json()


def post(url, data):
    return requests.post(FIREBASE_URL + url, data=json.dumps(data)).json()


def delete(url):
    return requests.delete(FIREBASE_URL + url)