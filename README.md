# TTracker - Time Tracking Application

TTracker is a web-based time tracking application built using Flask, SQLAlchemy, and other Python libraries. It allows users to start and stop timers, record descriptions of their work, and view their time tracking history.  Administrators can manage users and view all timers.

## Features

*   **User Authentication:** Secure user registration and login.
*   **Timer Management:**
    *   Start and stop timers with a description.
    *   View current timer status.
    *   Automatic calculation of duration.
*   **Time Tracking History:**
    *   View a paginated history of all timers.
    *   Display start time, end time, duration, and description.
*   **Admin Panel (Admin Users Only):**
    *   User management (add, delete).
    *   View all timers with filtering options (user ID, username, email, start time, end time).
*   **Responsive Design:** Utilizes CSS and JavaScript for a user-friendly experience.
*   **Dockerized:** Easily deployable using Docker and Docker Compose.

## Technologies Used

*   **Flask:** Python web framework.
*   **SQLAlchemy:** Python SQL toolkit and Object Relational Mapper (ORM).
*   **Flask-SQLAlchemy:** Flask extension for SQLAlchemy.
*   **Flask-Bcrypt:** Flask extension for password hashing.
*   **Flask-JWT-Extended:** Flask extension for JSON Web Tokens (JWT).  (Note: This is currently not fully implemented, but the library is included.)
*   **Flask-Login:** Flask extension for user session management.
*   **Flask-Migrate:** Flask extension for handling database migrations.
*   **MySQL:** Database.
*   **Alembic:** Database migration tool.
*   **Docker:** Containerization platform.
*   **Docker Compose:** Tool for defining and running multi-container Docker applications.
*   **HTML, CSS, JavaScript:** Front-end technologies.

## Setup and Installation

### Prerequisites

*   Docker
*   Docker Compose

### Steps

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd TTracker
    ```

2.  **Build and run the Docker containers:**

    ```bash
    docker-compose up --build
    ```

    This command will:

    *   Build the Flask application image.
    *   Start the MySQL database container.
    *   Link the Flask application to the database.

3.  **Access the application:**

    Open your web browser and navigate to `http://localhost:5000`.

### Database Migrations

Database migrations are handled using Alembic.  The following commands are useful:

*   **Run migrations:**  The `docker-compose.yml` already sets up the database.  The application automatically attempts to create an initial admin user on startup.

*   **Create a new migration:**

    ```bash
    # First, enter the web container:
    docker exec -it flask_app bash

    # Then, inside the container:
    flask db migrate -m "Your migration message"
    ```

*   **Upgrade the database:**

    ```bash
    # First, enter the web container:
    docker exec -it flask_app bash

    # Then, inside the container:
    flask db upgrade
    ```

### Configuration

The application's configuration is managed through the `config.py` file.  You can customize the following settings:

*   `SECRET_KEY`:  A secret key used for signing session cookies.  **Important:**  Change this in a production environment!
*   `SQLALCHEMY_DATABASE_URI`:  The connection string for the MySQL database.  The default is `mysql+pymysql://TimeTracker:12345678@localhost/TimeTracker`.  The `docker-compose.yml` file overrides this with environment variables for the containerized setup.
*   `SQLALCHEMY_TRACK_MODIFICATIONS`:  A flag to enable or disable SQLAlchemy's modification tracking.  Set to `False` for performance reasons.
*   `JWT_SECRET_KEY`: A secret key used for signing JSON Web Tokens.  **Important:** Change this in a production environment!

## Usage

1.  **Register/Login:**  Navigate to `/login` to log in or register a new account.
2.  **Dashboard:**  After logging in, you will be redirected to the dashboard (`/dashboard`).
3.  **Timer Controls:**
    *   Click the "Start Timer" button to begin tracking time.  You can optionally add a description of the task.
    *   Click the "Stop Timer" button to stop the timer and save the duration.
4.  **History:**  Click the "View History" button to see a list of your past timers.
5.  **Admin Panel:**  If you are an administrator, you can access the admin panel at `/admin`.

## File Structure

```
TTracker/
├── app/
│   ├── __init__.py             # Flask application factory
│   ├── decorators.py           # Custom decorators (admin_required, login_required_redirect)
│   ├── models.py               # SQLAlchemy models (User, Timer)
│   ├── routes/
│   │   ├── admin.py          # Admin routes
│   │   ├── dashboard.py      # Dashboard route
│   │   ├── login.py          # Login route
│   │   ├── logout.py         # Logout route
│   │   ├── routes.py         # Blueprint for main routes
│   │   ├── timer.py          # Timer routes
│   ├── static/               # Static files (CSS, JavaScript)
│   │   ├── admin.css
│   │   ├── admin.js
│   │   ├── base.css
│   │   ├── base.js
│   │   ├── dashboard.css
│   │   ├── dashboard.js
│   │   ├── history.css
│   │   ├── history.js
│   │   ├── login.css
│   │   ├── login.js
│   │   ├── manage_users.css
│   │   ├── manage_users.js
│   │   ├── startpage.css
│   │   ├── timers.css
│   │   ├── timers.js
│   ├── templates/            # HTML templates
│   │   ├── admin.html
│   │   ├── base.html
│   │   ├── dashboard.html
│   │   ├── history.html
│   │   ├── login.html
│   │   ├── manage_users.html
│   │   ├── startpage.html
│   │   ├── timers.html
├── config.py                 # Application configuration
├── docker-compose.yml        # Docker Compose file
├── migrations/               # Alembic migration scripts
├── requirements.txt          # Python dependencies
├── run.py                    # Application entry point
├── wait-for-it.sh            # Script to wait for database availability
└── README.md                 # This file
```

## Contributing

Contributions are welcome! Please submit a pull request with your proposed changes.


