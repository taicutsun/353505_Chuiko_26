FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /AgencyApp

# Install dependencies
COPY ./requirements.txt /AgencyApp/
RUN pip install --no-cache-dir -r requirements.txt
# Copy project files
COPY . /AgencyApp/

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]