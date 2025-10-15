from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from datetime import date,timedelta

def get_default_birth_date():
    return date.today() - timedelta(days=18*365)

def validate_birth_date(value):
    today = date.today()
    age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
    if age < 18:
        raise ValidationError('Возраст должен быть не менее 18 лет')

def validate_age(value):
    if value < 18:
        raise ValidationError('Возраст должен быть не менее 18 лет')


# Виды недвижимости
class PropertyType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Profile(models.Model):
    ROLE_CHOICES = [
        ('agent', 'Агент'),
        ('client', 'Клиент'),
        ('owner', 'Владелец'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="client")
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='profiles/', default='placeholder.png')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.role})"

# Объекты недвижимости
class Property(models.Model):
    PROPERTY_STATUS = [
        ('for_sale', 'На продажу'),
        ('for_rent', 'В аренду'),
        ('sold', 'Продано'),
        ('rented', 'Сдано'),
    ]

    title = models.CharField(max_length=200)
    property_type = models.ForeignKey(PropertyType, on_delete=models.PROTECT)
    address = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    area = models.PositiveIntegerField(help_text="Площадь в м²")
    rooms = models.PositiveSmallIntegerField()
    description = models.TextField()
    status = models.CharField(max_length=20, choices=PROPERTY_STATUS, default='for_sale')
    owner = models.ForeignKey('Owner', on_delete=models.PROTECT, related_name='owned_properties')
    agent = models.ForeignKey('Employee', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"

# Сотрудники агентства
class Employee(models.Model):
    profile = models.OneToOneField(
        Profile, 
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    first_name = models.CharField(
        max_length=150, 
        verbose_name="Имя",
        default="n"
    )
    last_name = models.CharField(
        max_length=150, 
        verbose_name="Фамилия",
        default="f"
    )
    birth_date = models.DateField(
        verbose_name="Дата рождения",
        validators=[validate_birth_date],
        help_text="Должно быть не менее 18 лет",
         default=get_default_birth_date 
    )
    position = models.CharField(max_length=100)
    hire_date = models.DateField(auto_now_add=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    properties_managed = models.ManyToManyField(Property, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

# Владельцы недвижимости
class Owner(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    first_name = models.CharField(
        max_length=150, 
        verbose_name="Имя",
        default="name"
    )
    last_name = models.CharField(
        max_length=150, 
        verbose_name="Фамилия",
        default="famili"
    )
    properties_owned = models.ManyToManyField(
        Property, 
        related_name='owner_properties',
        blank=True 
    )
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

# Сделки
class Deal(models.Model):
    DEAL_TYPES = [
        ('sale', 'Продажа'),
        ('rent', 'Аренда'),
    ]

    property = models.ForeignKey(Property, on_delete=models.PROTECT)
    deal_type = models.CharField(max_length=10, choices=DEAL_TYPES)
    client = models.ForeignKey('Client', on_delete=models.PROTECT)
    agent = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)
    deal_date = models.DateField()
    commission = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Сделка #{self.id} - {self.get_deal_type_display()} {self.property}"

# Клиенты (покупатели/арендаторы)
class Client(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    birth_date = models.DateField(
        verbose_name="Дата рождения",
        validators=[validate_birth_date],
        help_text="Должно быть не менее 18 лет",
         default=get_default_birth_date 
    )
    preferences = models.TextField(blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    viewed_properties = models.ManyToManyField(Property, blank=True)

    def __str__(self):
        return self.profile.user.get_full_name()

# Промокоды
class PromoCode(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2)
    valid_for = models.ForeignKey(PropertyType, on_delete=models.CASCADE, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateField()

    def __str__(self):
        return f"{self.code} - {self.discount}%"

# Дополнительные модели
class CompanyInfo(models.Model):
    title = models.CharField(max_length=200, default='О компании')
    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class News(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='news/', default='placeholder.png')
    created_at = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return self.title
    
#Отзывы клиентов
class Review(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='reviews')
    agent = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        choices=[(i, i) for i in range(1, 6)]
    )
    text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Отзыв {self.client} о {self.agent} ({self.rating}/5)"
    
    class Meta:
        unique_together = ('client', 'agent')  # Один отзыв на пару клиент-агент
        ordering = ['-created_at']

class Vacancy(models.Model):
    name = models.CharField(max_length=200, unique=True, verbose_name="Название")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)  # Время добавления
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)  # Время обновления
    def __str__(self):
        return self.name
    
class GlossaryEntry(models.Model):
    term = models.CharField(max_length=200, unique=True, verbose_name="Термин")
    definition = models.TextField(verbose_name="Определение")
    created_at = models.DateField(auto_now_add=True, verbose_name="Дата добавления", blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)  # Время обновления
    def __str__(self):
        return self.term
    
class AboutCompany(models.Model):
    description = models.TextField(
        verbose_name="description ",
    )
    details = models.TextField(
        verbose_name="Details",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "About Company"
        verbose_name_plural = "About Company"

    def __str__(self):
        return "About Company"
    
class Contact(models.Model):
    """
    Раздел «Контакты»: фото сотрудников, их роль, телефоны, почта, описание.
    """
    name        = models.CharField("Имя", max_length=100)
    role        = models.CharField("Должность / роль", max_length=100)
    photo       = models.ImageField("Фото", upload_to='contacts/', blank=True, null=True)
    phone       = models.CharField("Телефон", max_length=30, blank=True)
    email       = models.EmailField("Email", blank=True)
    description = models.TextField("Краткое описание", blank=True)

    class Meta:
        verbose_name = "Контакт"
        verbose_name_plural = "Контакты"

    def str(self):
        return f"{self.name} — {self.role}"