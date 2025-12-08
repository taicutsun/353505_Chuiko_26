from django.urls import path
from . import views
from . import auth_views
from . import estate_views
from .crud_views import (
    CrudIndex,
    PropertyTypeList, PropertyTypeCreate, PropertyTypeUpdate, PropertyTypeDelete,
    #PropertyList, PropertyCreate, PropertyUpdate, PropertyDelete,
    DealList, DealCreate, DealUpdate, DealDelete,
    EmployeeList, EmployeeCreate, EmployeeUpdate, EmployeeDelete,
    PromoCodeList, PromoCodeCreate, PromoCodeUpdate, PromoCodeDelete,
    NewsList, NewsCreate, NewsUpdate, NewsDelete, ReviewCreate, ReviewList,
    ReviewUpdate, ReviewDelete
)
from .statistics_view import statistics_view
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Основные маршруты
    path('', views.mainpage, name="mainpage"),
    path('about/', views.about, name='about'),
    path('glossary/', views.glossary_view, name='glossary'),
    
    # Политика конфиденциальности
    path('privacy-policy/', views.privacy_policy, name='privacy_policy'),

    # Новости
    path('news/', views.news_list, name='news_list'),
    path('news/<int:pk>/', views.news_detail, name='news_detail'),
    
    # Объекты недвижимости
    path('properties/', estate_views.property_list_public, name='property_list_public'),
    path('properties/<int:pk>/', estate_views.property_detail, name='property_detail'),
    path('properties/types/', estate_views.propertytype_list_public, name='propertytype_list_public'),

    # Вакансии
    path('vacancies/', views.vacancy_list, name='vacancy_list'),
    
    # Корзина и оплата
    path('cart/', estate_views.cart_view, name='cart_view'),
    path('cart/add/<int:pk>/', estate_views.cart_add, name='cart_add'),
    path('cart/update/<int:pk>/', estate_views.cart_update, name='cart_update'),
    path('cart/remove/<int:pk>/', estate_views.cart_remove, name='cart_remove'),
    path('checkout/', estate_views.checkout, name='checkout'),


    # Сделки
    path('crud/deals/', DealList.as_view(), name='deal_list'),
    path('crud/deals/add/', DealCreate.as_view(), name='deal_add'),
    path('crud/deals/<int:pk>/edit/', DealUpdate.as_view(), name='deal_edit'),
    path('crud/deals/<int:pk>/delete/', DealDelete.as_view(), name='deal_delete'),

    path('deals/history/', views.deal_history, name='deal_history'),
    path('deals/agent/', estate_views.agent_deal_list, name='agent_deals'),
    path('deals/client/', estate_views.client_deal_list, name='client_deals'),
    path('deals/create/', estate_views.create_deal, name='create_deal'),
    path('deals/<int:pk>/', estate_views.deal_detail, name='deal_detail'),
    
    # Контакты
    path('contacts/', views.contact_agents, name='contacts'),

    # Аутентификация
    path('register/client/', auth_views.register_client, name='register_client'),
    path('login/', auth_views.login_user, name='login'),
    path('logout/', auth_views.login_user, name='logout'),

   # Промокоды и отзывы
    path('promo-codes/', views.promo_codes_view, name='promo_codes'),


    path('crud/reviews/', ReviewList.as_view(), name='reviews_list'),
    path('crud/reviews/add/', ReviewCreate.as_view(), name='review_add'),
    path('crud/reviews/<int:pk>/edit/', ReviewUpdate.as_view(), name='review_edit'),
    path('crud/reviews/<int:pk>/delete/', ReviewDelete.as_view(), name='review_delete'),

    path('reviews/', views.reviews_list_public, name='reviews_list_public'),
    path('reviews/add/', views.add_review, name='add_review'),

    # Статистика
    path('statistics/', statistics_view, name='statistics'),

    # CRM система
    path('crud/', CrudIndex.as_view(), name='crud_index'),

    # Управление типами недвижимости
    path('crud/property-types/', PropertyTypeList.as_view(), name='propertytype_list'),
    path('crud/property-types/add/', PropertyTypeCreate.as_view(), name='propertytype_add'),
    path('crud/property-types/<int:pk>/edit/', PropertyTypeUpdate.as_view(), name='propertytype_edit'),
    path('crud/property-types/<int:pk>/delete/', PropertyTypeDelete.as_view(), name='propertytype_delete'),

    # Управление объектами недвижимости
# Replace class-based Property URLs with function-based URLs
path('crud/properties/', views.property_list, name='property_list'),
path('crud/properties/add/', views.property_create, name='property_add'),
path('crud/properties/<int:pk>/edit/', views.property_update, name='property_edit'),
path('crud/properties/<int:pk>/delete/', views.property_delete, name='property_delete'),

    # Управление сделками
    path('crud/deals/', DealList.as_view(), name='deal_list'),
    path('crud/deals/add/', DealCreate.as_view(), name='deal_add'),
    path('crud/deals/<int:pk>/edit/', DealUpdate.as_view(), name='deal_edit'),
    path('crud/deals/<int:pk>/delete/', DealDelete.as_view(), name='deal_delete'),

    # Управление сотрудниками
    path('crud/employees/', EmployeeList.as_view(), name='employee_list'),
    path('crud/employees/add/', EmployeeCreate.as_view(), name='employee_add'),
    path('crud/employees/<int:pk>/edit/', EmployeeUpdate.as_view(), name='employee_edit'),
    path('crud/employees/<int:pk>/delete/', EmployeeDelete.as_view(), name='employee_delete'),

    # Управление промокодами
    path('crud/promo-codes/', PromoCodeList.as_view(), name='promocode_list'),
    path('crud/promo-codes/add/', PromoCodeCreate.as_view(), name='promocode_add'),
    path('crud/promo-codes/<int:pk>/edit/', PromoCodeUpdate.as_view(), name='promocode_edit'),
    path('crud/promo-codes/<int:pk>/delete/', PromoCodeDelete.as_view(), name='promocode_delete'),

    # Управление новостями
    path('crud/news/', NewsList.as_view(), name='news_list_admin'),
    path('crud/news/add/', NewsCreate.as_view(), name='news_add'),
    path('crud/news/<int:pk>/edit/', NewsUpdate.as_view(), name='news_edit'),
    path('crud/news/<int:pk>/delete/', NewsDelete.as_view(), name='news_delete'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)