from flask import Blueprint, jsonify, render_template, request, redirect, url_for
from flask_login import current_user
from app import db
from app.models import Timer, User
from app.decorators import admin_required, login_required_redirect

admin = Blueprint('admin', __name__)

@admin.route('/')
@login_required_redirect
@admin_required
def admin_page():
    return render_template('admin.html')

@admin.route('/timers', methods=['GET'])
@login_required_redirect
@admin_required
def get_all_timers():
    if not current_user.is_admin:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403
        
    timers = Timer.query.all()
    timer_list = [{
        'user_id': t.user_id,
        'username': t.user.username,
        'email': t.user.email,
        'start_time': t.start_time,
        'end_time': t.end_time,
        'duration': t.duration
    } for t in timers]
    
    return jsonify({'status': 'success', 'timers': timer_list})
        
@admin.route('/manage-users', methods=['GET', 'POST'])
@login_required_redirect
@admin_required
def manage_users():
    users = User.query.all()

    if request.method == 'POST':
        try:
            data = request.get_json()
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            is_admin = data.get('is_admin', False)

            if not username or not email or not password:
                return jsonify({'status': 'error', 'message': 'All fields are required'}), 400

            if User.query.filter_by(email=email).first():
                return jsonify({'status': 'error', 'message': 'Email already in use'}), 400

            new_user = User(
                username=username,
                email=email,
                is_admin=is_admin
            )
            new_user.set_password(password)
            db.session.add(new_user)
            db.session.commit()

            return jsonify({'status': 'success', 'message': 'User was successfully created'}), 201
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 500

    return render_template('manage_users.html', users=users)
    
@admin.route('/delete-user/<int:user_id>', methods=['POST'])
@login_required_redirect
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return redirect(url_for('admin.manage_users'))
