from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_login import LoginManager

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()
loginManager = LoginManager()

def create_app():
    app = Flask(__name__)

    app.config.from_object('config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    loginManager.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # using Late import of Table models because otherwise flask_migrate can't detect them
    from app.models import User, Timer

    from app.routes.routes import auth
    app.register_blueprint(auth, url_prefix='/')

    @loginManager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # from app.routes.auth import auth_bp
    # app.register_blueprint(auth_bp)
    
    return app