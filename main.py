import os
from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.root_path, 'shortlinx.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  #here to silence deprecation warning
app.config['SECRET_KEY'] = 'shortlinx'

@app.route('/')
def init():
    return render_template('welcome/welcome.html')
