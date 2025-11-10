import logging
from django.urls import reverse_lazy
from django.views.generic import TemplateView, ListView, CreateView, UpdateView, DeleteView
from django.shortcuts import render, redirect
from django.contrib.auth.mixins import UserPassesTestMixin
from django.core.exceptions import PermissionDenied
from .models import (
    PropertyType, Property, Deal,
    Employee, PromoCode, News, Review
)
from .forms import DealForm, PromoCodeForm, ReviewForm,EmployeeForm
from django.contrib.auth.decorators import login_required


logger = logging.getLogger(__name__)

class AdminRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_superuser

class CrudIndex(TemplateView):
    template_name = 'crud/index.html'

# PropertyType CRUD
class PropertyTypeList(ListView):
    model = PropertyType
    template_name = 'crud/property_type/list.html'
    context_object_name = 'types'

class PropertyTypeCreate(CreateView):
    model = PropertyType
    fields = ['name', 'description']
    template_name = 'crud/property_type/form.html'
    success_url = reverse_lazy('propertytype_list')

    def form_valid(self, form):
        response = super().form_valid(form)
        logger.info(f"Создан тип недвижимости: {self.object}")
        return response

class PropertyTypeUpdate(UpdateView):
    model = PropertyType
    fields = ['name', 'description']
    template_name = 'crud/property_type/form.html'
    success_url = reverse_lazy('propertytype_list')

class PropertyTypeDelete(DeleteView):
    model = PropertyType
    template_name = 'crud/property_type/confirm_delete.html'
    success_url = reverse_lazy('propertytype_list')

# Property CRUD
class PropertyList(ListView):
    model = Property
    template_name = 'crud/property/list.html'
    context_object_name = 'properties'
    
    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.GET.get('status')
        if status:
            return queryset.filter(status=status)
        return queryset

class PropertyCreate(CreateView):
    model = Property
    fields = [
        'title', 'property_type', 'address',
        'price', 'area', 'rooms', 'description', 'status',
         'owner', 'agent'
    ]
    template_name = 'crud/property/form.html'
    success_url = reverse_lazy('property_list')

class PropertyUpdate(UpdateView):
    model = Property
    fields = [
        'title', 'property_type', 'address',
        'price', 'area', 'rooms', 'description', 'status',
        'owner', 'agent'
    ]
    template_name = 'crud/property/form.html'
    success_url = reverse_lazy('property_list')

class PropertyDelete(DeleteView):
    model = Property
    template_name = 'crud/property/confirm_delete.html'
    success_url = reverse_lazy('property_list')

# Deal CRUD
class DealList(ListView):
    model = Deal
    template_name = 'crud/deal/list.html'
    context_object_name = 'deals'

class DealCreate(CreateView):
    model = Deal
    form_class = DealForm
    template_name = 'crud/deal/form.html'
    success_url = reverse_lazy('deal_list')

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

class DealUpdate(UpdateView):
    model = Deal
    form_class = DealForm
    template_name = 'crud/deal/form.html'
    success_url = reverse_lazy('deal_list')

class DealDelete(DeleteView):
    model = Deal
    template_name = 'crud/deal/confirm_delete.html'
    success_url = reverse_lazy('deal_list')

# Employee CRUD
class EmployeeList(ListView):
    model = Employee
    template_name = 'crud/employee/list.html'

class EmployeeCreate(CreateView):
    model = Employee
    form_class = EmployeeForm
    template_name = 'crud/employee/form.html'
    success_url = reverse_lazy('employee_list')

class EmployeeUpdate(UpdateView):
    model = Employee
    form_class = EmployeeForm
    template_name = 'crud/employee/form.html'
    success_url = reverse_lazy('employee_list')

class EmployeeDelete(DeleteView):
    model = Employee
    template_name = 'crud/employee/confirm_delete.html'
    success_url = reverse_lazy('employee_list')

# PromoCode CRUD
class PromoCodeList(ListView):
    model = PromoCode
    template_name = 'crud/promo/list.html'

class PromoCodeCreate(CreateView):
    model = PromoCode
    form_class = PromoCodeForm
    template_name = 'crud/promo/form.html'
    success_url = reverse_lazy('promocode_list')

class PromoCodeUpdate(UpdateView):
    model = PromoCode
    form_class = PromoCodeForm
    template_name = 'crud/promo/form.html'
    success_url = reverse_lazy('promocode_list')

class PromoCodeDelete(DeleteView):
    model = PromoCode
    template_name = 'crud/promo/confirm_delete.html'
    success_url = reverse_lazy('promocode_list')

# News CRUD
class NewsList(AdminRequiredMixin, ListView):
    model = News
    template_name = 'crud/news/list.html'

class NewsCreate(AdminRequiredMixin, CreateView):
    model = News
    fields = ['title', 'content', 'image', 'is_published']
    template_name = 'crud/news/form.html'
    success_url = reverse_lazy('news_list')

class NewsUpdate(AdminRequiredMixin, UpdateView):
    model = News
    fields = ['title', 'content', 'image', 'is_published']
    template_name = 'crud/news/form.html'
    success_url = reverse_lazy('news_list')

class NewsDelete(AdminRequiredMixin, DeleteView):
    model = News
    template_name = 'crud/news/confirm_delete.html'
    success_url = reverse_lazy('news_list')

# Review Views
class ReviewList(ListView):
    model = Review
    template_name = 'crud/review/list.html'
    
    def get_queryset(self):
        return Review.objects.select_related('client', 'agent')

class ReviewCreate(CreateView):
    model = Review
    form_class = ReviewForm
    template_name = 'crud/review/form.html'
    success_url = reverse_lazy('reviews_list')

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def form_valid(self, form):
        if not hasattr(self.request.user, 'profile') or not hasattr(self.request.user.profile, 'client'):
            raise PermissionDenied("Only clients can leave reviews")
            
        client = self.request.user.profile.client
        agent = form.cleaned_data['agent']
        
        # Double-check for existing review
        if Review.objects.filter(client=client, agent=agent).exists():
            form.add_error('agent', 'Вы уже оставили отзыв об этом агенте')
            return self.form_invalid(form)
            
        form.instance.client = client
        return super().form_valid(form)
    
class ReviewUpdate(UpdateView):
    model = Review
    form_class = ReviewForm
    template_name = 'crud/review/form.html'
    success_url = reverse_lazy('reviews_list')

    def test_func(self):
        # Check if user owns this review or is admin
        review = self.get_object()
        return (self.request.user.is_superuser or 
                (hasattr(self.request.user, 'profile') and 
                 hasattr(self.request.user.profile, 'client') and 
                 review.client == self.request.user.profile.client))

class ReviewDelete(DeleteView):
    model = Review
    template_name = 'crud/review/confirm_delete.html'
    success_url = reverse_lazy('reviews_list')