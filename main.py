import os
import requests
from flask import Flask, request, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack
from flask_restful import reqparse, abort, Api, Resource

app = Flask(__name__)
api = Api(app)

# Routing
@app.route('/')
def init():
    return render_template('welcome/welcome.html')

@app.route('/testlink')
def testlink():
    return redirect("http://www.google.com")

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
            return "{'valid':'true'}", 200
        return "{'valid':'false'}", 404

class API_SetupRedirect(Resource):
    def put(self):
        return

api.add_resource(API_URLValidation, '/urlvalidation')
api.add_resource(API_SetupRedirect, '/setupredirect')