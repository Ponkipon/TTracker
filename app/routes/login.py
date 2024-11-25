from flask import render_template, redirect, url_for, flash
from flask_login import login_user
from app.models import User
from flask import request
from app.routes.routes import auth

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        print(f"Username: {username}, Password: {password}")

        user = User.query.filter_by(username=username).first()
        print(f"User found: {user}")

        if user and user.check_password(password):
            print("Password match")
            login_user(user)
            return redirect(url_for('auth.dashboard'))
        else:
            print("no pass match")
            flash('Invalid username or password', 'danger')

    return render_template('login.html')