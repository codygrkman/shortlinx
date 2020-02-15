import os
import requests
from flask import Flask, request, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack, send_from_directory
from flask_restful import reqparse, abort, Api, Resource
from flask_pymongo import PyMongo

app = Flask(__name__)
api = Api(app)

# Setup Mongo
app.config["MONGO_URI"] = os.environ['MONGODB_URI'] + "?retryWrites=false"
mongo = PyMongo(app)
redirections = mongo.db.redirects

# Routing
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 
                              'favicon.ico', mimetype='image/vnd.microsoft.icon')
@app.route('/')
def init():
    return render_template('welcome/welcome.html')


@app.route('/<shortString>')
def redirect_manager(shortString):
    if shortString == "":
        return render_template('welcome/welcome.html')
    record = uniqueShortString(shortString)
    if record:
        return redirect(record['url'])
    return 404

# API
parser = reqparse.RequestParser()
parser.add_argument('url')
parser.add_argument('ss')

class API_URLValidation(Resource):
    def get(self):
        args = parser.parse_args()
        url = args['url']
        request = requests.get(url)
        if request.status_code != 404:
            return "{'valid':'true', 'error':'Invalid URL provided'}", 200
        return "{'valid':'false'}", 404

class API_SetupRedirect(Resource):
    def post(self):
        args = parser.parse_args()
        url = args['url']
        ss = args['ss']
        record = uniqueShortString(ss)
        if record:
            return "{'valid':'false','error':'That extension already exists! Try another'}", 404
        record = {
            "url":url,
            "shortString":ss,
        }
        redirections.insert_one(record)
        return "{'valid':'true'}", 200

api.add_resource(API_URLValidation, '/urlvalidation')
api.add_resource(API_SetupRedirect, '/setupredirect')

# Helper functions

def uniqueShortString(shortString):
    return redirections.find_one({"shortString":shortString})