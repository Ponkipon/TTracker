from flask import render_template, jsonify, request
from flask_login import login_user
from app.models import User
from flask import request
from app.routes.routes import auth

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        try:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')

            user = User.query.filter_by(username=username).first()

            if user and user.check_password(password):
                login_user(user)
                return jsonify({'status': 'success', 'message': 'Successfully logged in'})
            else:
                return jsonify({'status': 'error', 'message': 'Invalid login data. Please try again'})
        except Exception as e:
            return jsonify({'status': 'error', 'message': 'An error occured: ' + str(e)})

    return render_template('login.html')