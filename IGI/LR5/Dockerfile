FROM python:3.10-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY IGI/LR5/CarApp/CarApp/requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY IGI/LR5/CarApp/CarApp/ /app/

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
