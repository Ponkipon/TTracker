from flask import Blueprint, request, jsonify, session
from flask_login import current_user
from datetime import datetime, timezone
from app import db
from app.models import Timer

timer_bp = Blueprint('timer', __name__)

@timer_bp.route('/start_timer', methods=['POST'])
def start_timer():
    user_id = current_user.id
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401
    
    running_timer = Timer.query.filter_by(user_id=user_id, end_time=None).first()
    if running_timer:
        return jsonify({'message': 'You already have a timer running'}), 400
    
    new_timer = Timer(user_id=user_id, start_time=datetime.now(timezone.utc))
    db.session.add(new_timer)
    db.session.commit()
    return jsonify({'status': 'success','message': 'Timer Started', 'timer_id': new_timer.id}), 200

@timer_bp.route('/stop_timer', methods=['POST'])
def stop_timer():
    user_id = current_user.id
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401
    
    running_timer = Timer.query.filter_by(user_id=user_id, end_time=None).first()
    if not running_timer:
        return jsonify({'message': 'No running timer found.'}), 400
    
    running_timer.end_time = datetime.now(timezone.utc)
    running_timer.duration = running_timer.calculate_duration()
    db.session.commit()
    return jsonify({'status': 'success', 'message' : 'Timer Stopped', 'duration' : running_timer.duration}), 200

@timer_bp.route('/view_timers', methods=['GET'])
def view_timers():
    user_id = current_user.id
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401
    
    timers = Timer.query.filter_by(user_id=user_id).all()
    timer_list = [
        {
            'id': t.id,
            'start_time': t.start_time,
            'end_time': t.end_time if t.end_time else None,
            'duration': t.duration
        } for t in timers
    ]
    return jsonify(timer_list), 200