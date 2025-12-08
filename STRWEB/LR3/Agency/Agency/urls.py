"""
URL configuration for Agency project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import RedirectView
from django.contrib.staticfiles.storage import staticfiles_storage

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('estateAgency.urls')),
    # Redirect browsers requesting /favicon.ico to our static SVG favicon
     path('favicon.ico', RedirectView.as_view(
        url='https://cdn-icons-png.flaticon.com/512/616/616408.png',
        permanent=True
    )),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve static files in development (adds /static/... URL patterns when DEBUG=True)
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
urlpatterns += staticfiles_urlpatterns()
