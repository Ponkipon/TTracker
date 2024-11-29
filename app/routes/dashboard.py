from app.decorators import login_required_redirect
from flask import render_template
from app.routes.routes import auth

@auth.route('/dashboard')
@login_required_redirect
def dashboard():
    return render_template('dashboard.html')