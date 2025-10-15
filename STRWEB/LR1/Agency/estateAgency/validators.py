
from django.core.exceptions import ValidationError
import re

def validate_phone_number(value):
    pattern = r'^\+375\d{9}$'
    if not re.match(pattern, value):
        raise ValidationError('Номер телефона должен быть в формате +375XXXXXXXXX.')