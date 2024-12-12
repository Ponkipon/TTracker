from datetime import datetime, timezone
from flask_login import UserMixin
from app import db
from flask_bcrypt import check_password_hash, generate_password_hash

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    timers = db.relationship('Timer', backref='user', lazy=True)
    def __repr__(self):
        return f'<User {self.username}>'

    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def set_password(self, password):
        self.password = generate_password_hash(password).decode('utf-8')


class Timer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    end_time = db.Column(db.DateTime, nullable=True)
    duration = db.Column(db.Integer, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_running = db.Column(db.Boolean, nullable=False, default=False)
    description = db.Column(db.String(255), nullable=True)  

    def calculate_duration(self):
        if self.start_time and self.end_time:
            self.start_time = self.start_time.replace(tzinfo=timezone.utc)
            self.end_time = self.end_time.replace(tzinfo=timezone.utc)

            return (self.end_time - self.start_time).total_seconds()
        return None

