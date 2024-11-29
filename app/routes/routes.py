from flask import Blueprint, render_template

auth = Blueprint('auth', __name__)

@auth.route('/', methods=['GET'])
def send_to_startpage():
    return render_template('startpage.html')


from app.routes import login, dashboard, logout