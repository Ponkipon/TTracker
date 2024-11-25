from flask_login import login_required
from flask import render_template
from app.routes.routes import auth

@auth.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')