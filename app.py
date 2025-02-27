from flask import Flask, render_template, redirect, url_for, request, session, send_from_directory
import os

app = Flask(__name__, static_folder='static')

@app.route('/static/css/<filename>')
def serve_css(filename):
    return send_from_directory(os.path.join(app.root_path, 'static', 'css'), filename, mimetype='text/css')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/rolunk')
def about():
    return render_template('about.html')

@app.route('/kapcsolat')
def contact():
    return render_template('contact.html')

@app.route('/jatek')
def game():
    return render_template('game.html')

@app.route('/admin', methods=['GET', 'POST'])
def login():
    return render_template("login.html")

@app.route('/logout')
def logout():
    return False

@app.route('/admin/iranyitopult')
def profile():
    return render_template("admin.html")

if __name__ == '__main__':
    app.config["STATIC_FOLDER"] = 'static'


    app.run(debug=True)
