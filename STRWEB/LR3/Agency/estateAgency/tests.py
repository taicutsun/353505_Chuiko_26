import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Agency.settings')

from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from .models import (
    Profile, News, CompanyInfo, Property, Deal, 
    Employee, PromoCode, PropertyType, Client as ClientModel,
    Owner, Review
)
import pytest
from decimal import Decimal

class MainPageTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.news = News.objects.create(
            title="Новость о рынке", 
            content="Анализ рынка недвижимости",
            image='news/placeholder.png'
        )

    def test_mainpage_view(self):
        response = self.client.get(reverse('mainpage'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('latest_properties', response.context)
        self.assertTemplateUsed(response, 'mainpage/mainpage.html')

class PropertyTests(TestCase):
    def setUp(self):
        # Create basic user and profile
        self.client = Client()
        self.user = User.objects.create_user(
            username='agent',
            password='testpass',
            email='agent@test.com'
        )
        self.profile = Profile.objects.create(
            user=self.user,
            role='agent',
            phone='1234567890'
        )
        
        # Create employee
        self.employee = Employee.objects.create(
            profile=self.profile,
            position='Senior Agent',
            salary=Decimal('50000.00')
        )
        
        # Create property type and property
        self.property_type = PropertyType.objects.create(
            name="Квартира",
            description="Жилая недвижимость"
        )
        
        # Create owner
        self.owner_user = User.objects.create_user(
            username='owner',
            password='testpass'
        )
        self.owner_profile = Profile.objects.create(
            user=self.owner_user,
            role='owner'
        )
        self.owner = Owner.objects.create(profile=self.owner_profile)
        
        # Create property
        self.property = Property.objects.create(
            title="Лучшая квартира",
            property_type=self.property_type,
            address="ул. Центральная 1",
            price=Decimal('5000000.00'),
            area=75,
            rooms=3,
            description="Отличная квартира",
            status='for_sale',
            agent=self.employee,
            owner=self.owner  # Add owner
        )

    def test_property_list_view(self):
        response = self.client.get(reverse('property_list'))  # Update URL name
        self.assertEqual(response.status_code, 200)
        self.assertIn('properties', response.context)
        self.assertTemplateUsed(response, 'properties/list.html')

    def test_property_detail_view(self):
        response = self.client.get(
            reverse('property_detail', kwargs={'pk': self.property.pk})
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['property'], self.property)

class DealTests(TestCase):
    def setUp(self):
        # Set up basic users
        self.client = Client()
        
        # Create property type
        self.property_type = PropertyType.objects.create(
            name="Офис",
            description="Коммерческая недвижимость"
        )
        
        # Set up client user and profile
        self.client_user = User.objects.create_user(
            username='client',
            password='testpass',
            email='client@test.com'
        )
        self.client_profile = Profile.objects.create(
            user=self.client_user,
            role='client'
        )
        self.client_obj = ClientModel.objects.create(
            profile=self.client_profile,
            budget=Decimal('20000000.00')
        )
        
        # Set up agent user and profile
        self.agent_user = User.objects.create_user(
            username='agent',
            password='testpass'
        )
        self.agent_profile = Profile.objects.create(
            user=self.agent_user,
            role='agent'
        )
        self.employee = Employee.objects.create(
            profile=self.agent_profile,
            position='Agent',
            salary=Decimal('45000.00')  # Add salary
        )
        
        # Create owner
        self.owner_user = User.objects.create_user(
            username='property_owner',
            password='testpass'
        )
        self.owner_profile = Profile.objects.create(
            user=self.owner_user,
            role='owner'
        )
        self.owner = Owner.objects.create(profile=self.owner_profile)
        
        self.property = Property.objects.create(
            title="Офис в центре",
            property_type=self.property_type,
            address="ул. Бизнес 15",
            price=Decimal('15000000.00'),
            area=120,
            rooms=5,
            status='for_sale',
            agent=self.employee,
            owner=self.owner
        )

    def test_deal_creation(self):
        deal = Deal.objects.create(
            property=self.property,
            deal_type='sale',
            client=self.client_obj,
            agent=self.employee,
            commission=Decimal('150000.00'),
            deal_date='2025-05-27'
        )
        self.assertEqual(deal.deal_type, 'sale')
        self.assertEqual(deal.commission, Decimal('150000.00'))
        self.assertEqual(deal.client, self.client_obj)

    def test_deal_list_view(self):
        # Login as agent
        self.client.login(username='agent', password='testpass')
        response = self.client.get(reverse('deal_list_admin'))
        self.assertEqual(response.status_code, 200)

class ReviewTests(TestCase):
    def setUp(self):
        self.client = Client()
        # Create client
        self.client_user = User.objects.create_user('client', 'client@test.com', 'testpass')
        self.client_profile = Profile.objects.create(user=self.client_user, role='client')
        self.client_obj = ClientModel.objects.create(profile=self.client_profile)
        
        # Create agent
        self.agent_user = User.objects.create_user('agent', 'agent@test.com', 'testpass')
        self.agent_profile = Profile.objects.create(user=self.agent_user, role='agent')
        self.agent = Employee.objects.create(
            profile=self.agent_profile,
            position='Agent',
            salary=Decimal('45000.00')  # Add salary
        )

    def test_review_creation(self):
        review = Review.objects.create(
            client=self.client_obj,
            agent=self.agent,
            rating=5,
            text="Отличный агент!"
        )
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.text, "Отличный агент!")

@pytest.mark.parametrize("url_name,expected_status", [
    ('mainpage', 200),
    ('about', 200),
    ('properties', 200),
    ('promo_codes', 200),
    ('news_list', 200),
])
def test_views_status_code(client, url_name, expected_status):
    url = reverse(url_name)
    response = client.get(url)
    assert response.status_code == expected_status