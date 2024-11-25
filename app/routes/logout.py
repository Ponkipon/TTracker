from flask_login import logout_user
from flask import redirect, url_for
from app.routes.routes import auth

@auth.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

