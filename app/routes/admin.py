from flask import Blueprint, jsonify, render_template
from flask_login import current_user
from app.models import Timer
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
        
    
