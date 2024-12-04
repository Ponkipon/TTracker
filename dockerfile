# Use the official Python image
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Copy the application files to the container
COPY . /app
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Install system dependencies
RUN apt-get update && apt-get install -y libmariadb-dev gcc && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose the Flask app's port (default is 5000)
EXPOSE 5000

# Set the environment variables for Flask
ENV FLASK_APP=run.py
ENV FLASK_ENV=production

CMD /wait-for-it.sh mysql:3306 --timeout=10 -- bash -c "flask db migrate -m 'upgrading' && flask db upgrade && gunicorn -b 0.0.0.0:5000 run:app"


