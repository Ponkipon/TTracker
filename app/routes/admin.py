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

@admin.route('/get_timers', methods=['GET'])
@login_required_redirect
@admin_required
def get_all_timers():
    if not current_user.is_admin:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403
    
    user_id = request.args.get('user_id', type=int)
    username = request.args.get('username', type=str)
    email = request.args.get('email', type=str)
    start_time = request.args.get('start_time', type=str)
    end_time = request.args.get('end_time', type=str)
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 15))

    offset = (page - 1) * limit

    query = Timer.query

    if user_id:
        query = query.filter(Timer.user_id == user_id)
    if username:
        query = query.join(User).filter(User.username.ilike(f"%{username}%"))
    if email:
        query = query.join(User).filter(User.email.ilike(f"%{email}%"))
    if start_time:
        query = query.filter(Timer.start_time >= start_time)
    if end_time:
        query = query.filter(Timer.end_time <= end_time)

    timers = query.offset(offset).limit(limit).all()
    total_timers = query.count()
    timer_list = [{
        'user_id': t.user_id,
        'username': t.user.username,
        'email': t.user.email,
        'start_time': t.start_time,
        'end_time': t.end_time,
        'duration': t.duration,
        'description': t.description
    } for t in timers]
    
    return jsonify({'status' : 'success','timers': timer_list, 'total': total_timers, 'page': page, 'limit': limit}), 200
        
@admin.route('/timers')
@login_required_redirect
@admin_required
def timers():
    return render_template('timers.html')

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
