import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'BALLS')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'mysql+pymysql://TimeTracker:12345678@localhost/TimeTracker')
    SQLALCHEMY_TRACK_MODIFICATIONS = False # Done to improve performance, apparently, by removing unnecesary tracking
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'JWT_BALLS')
    DEBUG = True