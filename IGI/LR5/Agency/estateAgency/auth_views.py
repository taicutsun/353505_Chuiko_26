from django.shortcuts import render, redirect
from .models import Profile, Client, Employee, Owner
from .forms import ClientRegisterForm
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LogoutView
from .validators import validate_phone_number

def register_client(request):
    """Регистрация нового клиента (покупателя/арендатора)"""
    if request.method == 'POST':
        form = ClientRegisterForm(request.POST, request.FILES)
        if form.is_valid():
            # Создаем пользователя и профиль
            profile = form.save()
            
            # Создаем связанный профиль клиента
            Client.objects.create(
                profile=profile,
                budget=form.cleaned_data.get('budget', 0)
            )
            
            # Автоматический вход после регистрации
            login(request, profile.user)
            return redirect('property_list')
            
    else:
        form = ClientRegisterForm()
        
    return render(request, 'registration/register_client.html', {'form': form})

def login_user(request):
    """Аутентификация пользователя с проверкой роли"""
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            
            # Проверяем тип профиля
            try:
                profile = user.profile
                if user.is_superuser:
                    return redirect('/admin/')
                elif hasattr(profile, 'employee'):
                    return redirect('mainpage')
                elif hasattr(profile, 'client'):
                    return redirect('mainpage')
                elif hasattr(profile, 'owner'):
                    return redirect('mainpage')
                    
            except Profile.DoesNotExist:
                form.add_error(None, 'Профиль не найден.')
                
            login(request, user)
            return redirect('mainpage')
            
    else:
        form = AuthenticationForm()
        
    return render(request, 'registration/login.html', {'form': form})

class CustomLogoutView(LogoutView):
    """Кастомный выход из системы с перенаправлением"""
    next_page = 'login'