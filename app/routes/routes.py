from flask import Blueprint, redirect, url_for
from app.decorators import login_required_redirect

auth = Blueprint('auth', __name__)

@auth.route('/', methods=['GET'])
@login_required_redirect
def send_to_dashboard():
    return redirect(url_for('auth.dashboard'))


from app.routes import login, dashboard, logout