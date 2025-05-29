import requests
from django.shortcuts import render, redirect,get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import (
    CompanyInfo, News, Property, Deal, 
    Employee, Vacancy, PromoCode, GlossaryEntry, Review
    ,Contact
)
from .forms import ReviewForm
from django.contrib.auth.models import User
from django.contrib import messages
from .forms import PropertyForm

def mainpage(request):
    """Главная страница агентства недвижимости"""
    jokes = []
    if request.user.is_authenticated:
        for _ in range(3):
            response = requests.get('https://official-joke-api.appspot.com/random_joke')
            if response.status_code == 200:
                joke = response.json()
                query = joke.get('punchline', '')

                # Поиск картинки по шутке
                image_url = None
                if query:
                    headers = {
                        "Authorization": "DXYMhkpFIPBN84eWK680QNKDUwzXbTerQMY1MiNpSXynppFcVJalPMRg"
                    }
                    pexels_resp = requests.get(
                        "https://api.pexels.com/v1/search",
                        headers=headers,
                        params={"query": query, "per_page": 1}
                    )
                    if pexels_resp.status_code == 200:
                        pexels_data = pexels_resp.json()
                        photos = pexels_data.get("photos", [])
                        if photos:
                            image_url = photos[0]["src"]["medium"]

                joke['image_url'] = image_url
                jokes.append(joke)


    context = {
        'latest_properties': Property.objects.filter(status__in=['for_sale', 'for_rent']).order_by('-created_at')[:4],
        'company_stats': {
            'total_deals': Deal.objects.count(),
            'active_properties': Property.objects.exclude(status__in=['sold', 'rented']).count()
        },
        'last_article': News.objects.filter(is_published=True).order_by('-created_at').first(),
         'jokes': jokes
    }
    return render(request, 'mainpage/mainpage.html', context)

def about(request):
    """Страница 'О компании'"""
    company_info = CompanyInfo.objects.first()
    employees = Employee.objects.select_related('profile').all()
    return render(request, 'about/about.html', {
        'company_info': company_info,
        'employees': employees
    })

def news_list(request):
    """Список новостей"""
    news_items = News.objects.filter(is_published=True).order_by('-created_at')
    return render(request, 'news/news_list.html', {'news_items': news_items})

def news_detail(request, pk):
    """Детальная страница новости"""
    article = News.objects.get(pk=pk, is_published=True)
    return render(request, 'news/news_detail.html', {'news': article})

def property_detail(request, pk):
    """Детальная страница объекта"""
    property = Property.objects.get(pk=pk)
    related = Property.objects.filter(
        property_type=property.property_type
    ).exclude(pk=pk)[:3]
    
    return render(request, 'properties/detail.html', {
        'property': property,
        'related_properties': related
    })

@login_required
def deal_history(request):
    """История сделок пользователя"""
    if not hasattr(request.user, 'client_profile'):
        return redirect('mainpage')
    
    deals = Deal.objects.filter(client=request.user.client_profile)
    return render(request, 'deals/history.html', {'deals': deals})

def vacancy_list(request):
    """Список вакансий"""
    vacancies = Vacancy.objects.all()
    return render(request, 'career/vacancies.html', {'vacancies': vacancies})

@login_required
def add_review(request):
    """Добавление отзыва об агенте"""
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.client = request.user.client_profile
            review.save()
            return redirect('reviews_list')
    else:
        form = ReviewForm()
    return render(request, 'reviews/add.html', {'form': form})

def reviews_list_public(request):
    """Список отзывов об агентах"""
    reviews = Review.objects.select_related('client__profile').order_by('-created_at')
    return render(request, 'reviews/list.html', {'reviews': reviews})

def promo_codes_view(request):
    """Список промокодов"""
    active_promo_codes = PromoCode.objects.filter(
        is_active=True, 
        valid_for__isnull=False
    ).select_related('valid_for')
    
    return render(request, 'promo/list.html', {
        'active_promo_codes': active_promo_codes
    })

def contact_agents(request):
    """View for displaying all contacts"""
    contacts = Contact.objects.all()
    
    context = {
        'contacts': contacts,
        'office_info': {
            'name': 'Агентство недвижимости',
            'address': 'ул. Примерная, 123',
            'phone': '+375 29 123-45-67',
            'email': 'info@agency.by',
            'working_hours': '9:00 - 18:00',
            'description': 'Мы находимся в центре города, недалеко от станции метро.'
        }
    }
    return render(request, 'contacts/contact_list.html', context)

def  glossary_view(request):
    entries = GlossaryEntry.objects.all().order_by('term')
    return render(request, 'glossary/glossary.html', {'entries': entries})

def privacy_policy(request):
    """Политика конфиденциальности"""
    return render(request, 'privacy_policy/privacy_policy.html')

@login_required
def property_list(request):
    properties = Property.objects.all()
    status = request.GET.get('status')
    if status:
        properties = properties.filter(status=status)
    
    context = {
        'properties': properties,
        'current_status': status
    }
    return render(request, 'crud/property/list.html', context)

@login_required
def property_create(request):
    if request.method == 'POST':
        form = PropertyForm(request.POST)
        if form.is_valid():
            property = form.save()
            messages.success(request, 'Объект недвижимости успешно создан')
            return redirect('property_list')
    else:
        form = PropertyForm()
    
    return render(request, 'crud/property/form.html', {
        'form': form,
        'title': 'Создание объекта недвижимости'
    })

@login_required
def property_update(request, pk):
    property = get_object_or_404(Property, pk=pk)
    
    if request.method == 'POST':
        form = PropertyForm(request.POST, instance=property)
        if form.is_valid():
            form.save()
            messages.success(request, 'Объект недвижимости успешно обновлен')
            return redirect('property_list')
    else:
        form = PropertyForm(instance=property)
    
    return render(request, 'crud/property/form.html', {
        'form': form,
        'property': property,
        'title': 'Редактирование объекта недвижимости'
    })

@login_required
def property_delete(request, pk):
    property = get_object_or_404(Property, pk=pk)
    
    if request.method == 'POST':
        property.delete()
        messages.success(request, 'Объект недвижимости успешно удален')
        return redirect('property_list')
        
    return render(request, 'crud/property/confirm_delete.html', {
        'property': property
    })