from flask import Blueprint

auth = Blueprint('auth', __name__)

from app.routes import login, dashboard, logout