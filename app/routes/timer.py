from flask import Blueprint, request, jsonify, session, render_template
from flask_login import current_user
from datetime import datetime, timezone
from app import db
from app.models import Timer
from app.decorators import login_required_redirect

timer_bp = Blueprint('timer', __name__)

@timer_bp.route('/start_timer', methods=['POST'])
def start_timer():
    user_id = current_user.id
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401
    
    running_timer = Timer.query.filter_by(user_id=user_id, end_time=None).first()
    if running_timer:
        return jsonify({'message': 'You already have a timer running'}), 400
    
    new_timer = Timer(user_id=user_id, start_time=datetime.now(timezone.utc), is_running=True)
    db.session.add(new_timer)
    db.session.commit()
    return jsonify({'status': 'success','message': 'Timer Started', 'timer_id': new_timer.id}), 200

@timer_bp.route('/stop_timer', methods=['POST'])
def stop_timer():
    data = request.get_json()
    description = data.get('description')
    user_id = current_user.id
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401
    
    running_timer = Timer.query.filter_by(user_id=user_id, end_time=None, is_running=True).first()
    if not running_timer:
        return jsonify({'message': 'No running timer found.'}), 400
    
    running_timer.end_time = datetime.now(timezone.utc)
    running_timer.duration = running_timer.calculate_duration()
    running_timer.description = description
    running_timer.is_running = False
    db.session.commit()
    return jsonify({'status': 'success', 'message' : 'Timer Stopped', 'duration' : running_timer.duration}), 200

@timer_bp.route('/view_timers', methods=['GET'])
def view_timers():
    user_id = current_user.id
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401
    
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 15))
    offset = (page-1) * limit
    
    timers_query = Timer.query.filter_by(user_id=user_id).offset(offset).limit(limit).all()
    total_timers = Timer.query.count()
    timer_list = [
        {
            'id': t.id,
            'start_time': t.start_time,
            'end_time': t.end_time if t.end_time else None,
            'duration': t.duration,
            'description': t.description
        } for t in timers_query
    ]
    return jsonify({'status' : 'success','timers': timer_list, 'total': total_timers, 'page': page, 'limit': limit}), 200

@login_required_redirect
@timer_bp.route('/history')
def history():
    user_id = current_user.id
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401
    
    return render_template('history.html')

@timer_bp.route('/current_timer')
def get_current_timer():
    current_timer = Timer.query.filter_by(is_running=True).first()

    if current_timer:
        return jsonify({'status':'success','start_time': current_timer.start_time}), 200
    else: 
        return jsonify({'status':'error','message': 'You have no running Timers!'}), 200