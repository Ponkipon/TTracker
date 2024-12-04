from app import create_app, db
from app.models import User

def create_initial_user():
    user = User.query.filter_by(username='admin').first()
    if not user:
        new_user = User(username='Admin',
                        email='admin@firstuser.usr',
                        is_admin=True)
        new_user.set_password('12345678')
        db.session.add(new_user)
        db.session.commit()
        print("Initial user created..")
    else:
        print('user already exists')

app = create_app()
with app.app_context():
    create_initial_user()

if __name__ == "__main__":
    app.run(debug=False)