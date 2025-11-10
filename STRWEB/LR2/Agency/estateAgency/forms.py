from django import forms
from django.contrib.auth.models import User
from .models import (
    Profile, Deal, Property, Client, 
    Employee, Review, PromoCode,Owner
)
from datetime import date
from .validators import validate_phone_number
from django.core.exceptions import ValidationError

class ClientRegisterForm(forms.ModelForm):
    first_name = forms.CharField(max_length=150)
    last_name = forms.CharField(max_length=150)
    birth_date = forms.DateField(
        label="Дата рождения",
        help_text="Должно быть не менее 18 лет",
        widget=forms.DateInput(attrs={'type': 'date'}),
    )
    email = forms.EmailField()
    phone = forms.CharField(max_length=20, validators=[validate_phone_number])

    class Meta:
        model = Client
        fields = ['birth_date', 'budget', 'preferences']

    def clean_birth_date(self):
        birth_date = self.cleaned_data.get('birth_date')
        if birth_date:
            today = date.today()
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
            if age < 18:
                raise forms.ValidationError('Возраст должен быть не менее 18 лет')
        return birth_date


    def save(self, commit=True):
        # Create User
        user = User.objects.create_user(
            username=self.cleaned_data['first_name'],
            password=self.cleaned_data['first_name'],
            first_name=self.cleaned_data['first_name'],
            last_name=self.cleaned_data['last_name'],
            email=self.cleaned_data['email'],
        )

        # Create Profile
        profile = Profile.objects.create(
            user=user,
            role='client',
            phone=self.cleaned_data['phone']
        )

        # Create Client
        client = super().save(commit=False)
        client.profile = profile
        if commit:
            client.save()

        return client
    
class EmployeeForm(forms.ModelForm):
    birth_date = forms.DateField(
        label="Дата рождения",
        help_text="Должно быть не менее 18 лет",
        widget=forms.DateInput(attrs={'type': 'date'}),
    )

    class Meta:
        model = Employee
        fields = [
            'first_name', 'last_name', 
            'position', 'salary', 'birth_date'
        ]

    def clean_birth_date(self):
        birth_date = self.cleaned_data.get('birth_date')
        if birth_date:
            today = date.today()
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
            if age < 18:
                raise forms.ValidationError('Возраст должен быть не менее 18 лет')
        return birth_date

class DealForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if self.user and hasattr(self.user, 'profile'):
            # Filter agents if user is a client
            if self.user.profile.role == 'client':
                self.fields['agent'].queryset = Employee.objects.filter(position='agent')
                self.initial['client'] = self.user.profile.client
            # Filter clients if user is an agent
            elif self.user.profile.role == 'agent':
                self.fields['client'].queryset = Client.objects.all()
                self.initial['agent'] = self.user.profile.employee

    class Meta:
        model = Deal
        fields = ['property', 'deal_type', 'client', 'agent', 'deal_date', 'commission']

class PropertyForm(forms.ModelForm):
    class Meta:
        model = Property
        fields = [
            'title', 'property_type', 'address', 
            'price', 'area', 'rooms', 'description',
            'owner', 'agent' 
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['owner'].required = True
        self.fields['owner'].queryset = Owner.objects.all()
        self.fields['owner'].label_from_instance = lambda obj: f"{obj.first_name} {obj.last_name}"
        
    def clean(self):
        cleaned_data = super().clean()
        if not cleaned_data.get('owner'):
            raise forms.ValidationError('Владелец обязателен для заполнения')
        if not cleaned_data.get('agent'):
            raise forms.ValidationError('Агент обязателен для заполнения')
        return cleaned_data

class PromoCodeForm(forms.ModelForm):
    class Meta:
        model = PromoCode
        fields = ['code', 'discount', 'valid_for', 'expires_at']
        widgets = {
            'expires_at': forms.DateInput(attrs={'type': 'date'})
        }

class ReviewForm(forms.ModelForm):
    agent = forms.ModelChoiceField(
        queryset=Employee.objects.all(),
        label="Агент"
    )
    
    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        

    class Meta:
        model = Review
        fields = ['agent', 'rating', 'text']
        widgets = {
            'rating': forms.Select(choices=[(i, i) for i in range(1, 6)]),
            'text': forms.Textarea(attrs={'rows': 4}),
        }
