# cars/context_processors.py

from django.utils import timezone

def now_context(request):
    return {'now': timezone.now()}
