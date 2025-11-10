from django.contrib import admin
from .forms import ClientRegisterForm
from .models import (
    PropertyType, Property, Deal,
    Employee, Owner, Client,
    PromoCode, CompanyInfo, News,
    GlossaryEntry, Profile, Vacancy, Review,
    AboutCompany, Contact
)
from datetime import date

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'phone', 'created_at')
    list_filter = ('role',)
    search_fields = ('user__username', 'user__email', 'phone')
    date_hierarchy = 'created_at'

@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name', 'description')
    date_hierarchy = 'created_at'

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'property_type', 'status', 'price', 'area', 'rooms', 'created_at')
    list_filter = ('status', 'property_type')
    search_fields = ('title', 'address', 'description')
    raw_id_fields = ('owner', 'agent')
    date_hierarchy = 'created_at'
    list_editable = ('status',)
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'property_type', 'status')
        }),
        ('Характеристики', {
            'fields': ('price', 'area', 'rooms', 'address', 'description')
        }),
        ('Связи', {
            'fields': ('owner', 'agent')
        }),
    )

@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('property', 'deal_type', 'client', 'agent', 'deal_date', 'commission')
    list_filter = ('deal_type', 'deal_date')
    search_fields = ('property__title', 'client__profile__user__username')
    date_hierarchy = 'deal_date'
    raw_id_fields = ('property', 'client', 'agent')

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('get_full_name', 'position', 'get_age', 'hire_date', 'salary')
    search_fields = ('first_name', 'last_name', 'position')
    list_filter = ('position', 'hire_date', 'birth_date',)
    date_hierarchy = 'hire_date'
    fieldsets = (
        ('Личные данные', {
            'fields': ('first_name', 'last_name', 'position', 'birth_date')
        }),
        ('Рабочая информация', {
            'fields': ('salary', 'properties_managed')
        }),
    )
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    get_full_name.short_description = 'ФИО сотрудника'
    get_full_name.admin_order_field = 'first_name'

    def get_age(self, obj):
        if obj.birth_date:
            today = date.today()
            age = today.year - obj.birth_date.year - ((today.month, today.day) < (obj.birth_date.month, obj.birth_date.day))
            return age
        return '—'
    get_age.short_description = 'Возраст'
    get_age.admin_order_field = 'birth_date'

@admin.register(Owner)
class OwnerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'get_properties_count')
    search_fields = ('first_name', 'last_name', 'profile__user__username')
    fieldsets = (
        ('Личные данные', {
            'fields': ('first_name', 'last_name', 'profile')
        }),
        ('Объекты недвижимости', {
            'fields': ('properties_owned',)
        }),
    )
    
    def get_full_name(self, obj):
        return obj.profile.user.get_full_name()
    get_full_name.short_description = 'Полное имя'
    
    def get_properties_count(self, obj):
        return obj.properties_owned.count()
    get_properties_count.short_description = 'Количество объектов'


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    form = ClientRegisterForm
    list_display = ('get_full_name','get_age', 'get_email', 'get_phone', 'budget', 'get_viewed_properties_count')
    list_filter = ('budget', 'profile__role','birth_date')
    search_fields = (
        'profile__user__first_name',
        'profile__user__last_name',
        'profile__user__email',
        'profile__phone'
    )
    fieldsets = (
        ('Личные данные', {
            'fields': ('first_name', 'last_name', 'birth_date', 'email', 'phone')
        }),
        ('Параметры клиента', {
            'fields': ('budget', 'preferences')
        }),
    )
    
    def get_full_name(self, obj):
        return obj.profile.user.get_full_name() or obj.profile.user.username
    get_full_name.short_description = 'ФИО клиента'
    get_full_name.admin_order_field = 'profile__user__first_name'
    
    def get_email(self, obj):
        return obj.profile.user.email
    get_email.short_description = 'Email'
    get_email.admin_order_field = 'profile__user__email'
    
    def get_phone(self, obj):
        return obj.profile.phone or '—'
    get_phone.short_description = 'Телефон'
    get_phone.admin_order_field = 'profile__phone'
    
    def get_viewed_properties_count(self, obj):
        return obj.viewed_properties.count()
    get_viewed_properties_count.short_description = 'Просмотрено объектов'

    def get_age(self, obj):
        if obj.birth_date:
            today = date.today()
            age = today.year - obj.birth_date.year - ((today.month, today.day) < (obj.birth_date.month, obj.birth_date.day))
            return age
        return '—'
    get_age.short_description = 'Возраст'
    get_age.admin_order_field = 'birth_date'
   
@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount', 'valid_for', 'expires_at', 'is_active')
    list_filter = ('valid_for', 'is_active', 'expires_at')
    search_fields = ('code',)
    list_editable = ('is_active',)
    date_hierarchy = 'created_at'

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'is_published')
    list_filter = ('is_published', 'created_at')
    search_fields = ('title', 'content')
    list_editable = ('is_published',)
    date_hierarchy = 'created_at'

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('client', 'agent', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('client__profile__user__username', 'agent__profile__user__username', 'text')
    date_hierarchy = 'created_at'

@admin.register(GlossaryEntry)
class GlossaryEntryAdmin(admin.ModelAdmin):
    list_display = ('term', 'created_at')
    search_fields = ('term', 'definition')
    date_hierarchy = 'created_at'

@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ('title', 'updated_at')
    search_fields = ('title', 'content')

@admin.register(Vacancy)
class VacancyAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name', 'content')
    date_hierarchy = 'created_at'

@admin.register(AboutCompany)
class AboutCompanyAdmin(admin.ModelAdmin):

    list_display = ['get_description_preview', 'get_details_preview','updated_at']
    readonly_fields = ['updated_at']
    fieldsets = (
        ('Информация', {
            'fields': ('description',),
            'classes': ('wide',)
        }),
        ('Реквизиты', {
            'fields': ('details',),
            'classes': ('wide',)
        }),
        ('Служебная информация', {
            'fields': ('updated_at',),
            'classes': ('collapse',)
        }),
    )

    def get_description_preview(self, obj):
        return obj.description[:100] + '...' if len(obj.description) > 100 else obj.description
    get_description_preview.short_description = 'Описание'

    def get_details_preview(self, obj):
        return obj.details[:100] + '...' if len(obj.details) > 100 else obj.details
    get_details_preview.short_description = 'Реквизиты'


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name','role','phone','email')
    search_fields = ('name','role','email')