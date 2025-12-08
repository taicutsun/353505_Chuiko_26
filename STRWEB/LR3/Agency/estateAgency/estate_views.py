from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from .forms import DealForm
from .models import Review, Deal, Property,PropertyType
from django.db.models import Count, Q

@login_required
def agent_deal_list(request):
    """Список сделок агента"""
    try:
        agent = request.user.profile.employee
    except AttributeError:
        return render(request, 'deals/not_allowed.html')

    deals = Deal.objects.filter(agent=agent).select_related('property', 'client__profile')
    total_commission = sum(deal.commission for deal in deals)
    
    return render(request, 'deals/agent_list.html', {
        'deals': deals,
        'total_commission': total_commission
    })

@login_required
def client_deal_list(request):
    """Список сделок клиента"""
    try:
        client = request.user.profile.client
    except AttributeError:
        return render(request, 'deals/not_allowed.html')

    deals = Deal.objects.filter(client=client).select_related('property', 'agent__profile')
    return render(request, 'deals/client_list.html', {'deals': deals})

@login_required
def create_deal(request):
    """Создание новой сделки"""
    if not request.user.is_staff:
        return redirect('mainpage')

    if request.method == 'POST':
        form = DealForm(request.POST)
        if form.is_valid():
            deal = form.save(commit=False)
            deal.commission = deal.property.price * 0.05  # Пример расчета комиссии 5%
            deal.save()
            return redirect('agent_deal_list')
    else:
        form = DealForm(initial={'agent': request.user.profile.employee})

    return render(request, 'deals/create.html', {'form': form})

@login_required
def deal_detail(request, pk):
    """Детализация сделки"""
    deal = get_object_or_404(
        Deal.objects.select_related('client__profile', 'agent__profile', 'property'),
        pk=pk
    )
    user_profile = request.user.profile

    # Проверка прав доступа
    if user_profile.role == 'client' and deal.client.profile != user_profile:
        return render(request, 'deals/not_allowed.html')
    if user_profile.role == 'agent' and deal.agent.profile != user_profile:
        return render(request, 'deals/not_allowed.html')

    return render(request, 'deals/detail.html', {'deal': deal})

def property_list_public(request):
    """Список доступных объектов недвижимости"""
    properties = Property.objects.filter(status__in=['for_sale', 'for_rent'])
    return render(request, 'properties/list.html', {'properties': properties})

def property_detail(request, pk):
    property = get_object_or_404(Property.objects.select_related(
        'property_type',
        'owner__profile__user',
        'agent__profile__user'
    ), pk=pk)
    
    reviews = Review.objects.filter(agent=property.agent).select_related(
        'client__profile__user'
    ) if property.agent else []
    
    context = {
        'property': property,
        'reviews': reviews,
        'similar_properties': Property.objects.filter(
            property_type=property.property_type,
            status=property.status
        ).exclude(pk=property.pk)[:3]
    }
    return render(request, 'properties/detail.html', context)

# ---------------------
# Cart (session-based)
# ---------------------

def _get_cart(session):
    cart = session.get('cart')
    if cart is None:
        cart = {}
        session['cart'] = cart
    return cart

@require_POST
def cart_add(request, pk):
    """Add a property to the cart with quantity (default 1)."""
    property_obj = get_object_or_404(Property, pk=pk)
    qty = request.POST.get('quantity', '1')
    try:
        qty = int(qty)
    except ValueError:
        qty = 1
    qty = max(1, min(qty, 99))

    cart = _get_cart(request.session)
    key = str(property_obj.pk)
    current = int(cart.get(key, 0))
    cart[key] = current + qty
    request.session.modified = True
    return redirect('cart_view')

def cart_view(request):
    """Show cart items with ability to update quantities and remove items."""
    cart = request.session.get('cart', {})
    items = []
    total = 0
    if cart:
        props = Property.objects.filter(pk__in=cart.keys())
        prop_map = {str(p.pk): p for p in props}
        for key, qty in cart.items():
            p = prop_map.get(key)
            if not p:
                continue
            line_total = p.price * qty
            total += line_total
            items.append({
                'property': p,
                'quantity': qty,
                'line_total': line_total,
            })
    context = {
        'items': items,
        'total': total,
    }
    return render(request, 'cart/cart.html', context)

@require_POST
def cart_update(request, pk):
    """Increase or decrease item quantity via action param (?action=inc|dec) or direct set via quantity."""
    action = request.GET.get('action')
    cart = _get_cart(request.session)
    key = str(pk)
    if key not in cart:
        return redirect('cart_view')
    if action == 'inc':
        cart[key] = min(int(cart[key]) + 1, 99)
    elif action == 'dec':
        cart[key] = max(int(cart[key]) - 1, 1)
    else:
        qty = request.POST.get('quantity')
        if qty is not None:
            try:
                qty = int(qty)
                cart[key] = max(1, min(qty, 99))
            except ValueError:
                pass
    request.session.modified = True
    return redirect('cart_view')

@require_POST
def cart_remove(request, pk):
    cart = _get_cart(request.session)
    key = str(pk)
    if key in cart:
        del cart[key]
        request.session.modified = True
    return redirect('cart_view')

def checkout(request):
    """Simple checkout page showing items and totals and simulating payment."""
    cart = request.session.get('cart', {})
    if not cart:
        return redirect('cart_view')

    items = []
    total = 0
    props = Property.objects.filter(pk__in=cart.keys())
    prop_map = {str(p.pk): p for p in props}
    for key, qty in cart.items():
        p = prop_map.get(key)
        if not p:
            continue
        line_total = p.price * qty
        total += line_total
        items.append({
            'property': p,
            'quantity': qty,
            'line_total': line_total,
        })

    if request.method == 'POST':
        # Simulate payment success and clear cart
        request.session['cart'] = {}
        request.session.modified = True
        return render(request, 'cart/checkout.html', {
            'success': True,
            'items': items,
            'total': total,
        })

    return render(request, 'cart/checkout.html', {
        'success': False,
        'items': items,
        'total': total,
    })

def property_list(request):
    """Список доступных объектов недвижимости"""
    properties = Property.objects.filter(status__in=['for_sale', 'for_rent'])
    
    # Add filter by property type
    property_type = request.GET.get('type')
    if property_type:
        properties = properties.filter(property_type__name=property_type)
    
    # Add price range filter
    price_range = request.GET.get('price_range')
    if price_range:
        if price_range == '0-1000000':
            properties = properties.filter(price__lte=1000000)
        elif price_range == '1000000-5000000':
            properties = properties.filter(price__range=(1000000, 5000000))
        elif price_range == '5000000-10000000':
            properties = properties.filter(price__range=(5000000, 10000000))
        elif price_range == '10000000+':
            properties = properties.filter(price__gte=10000000)

    return render(request, 'properties/list.html', {'properties': properties})

def propertytype_list_public(request):
    """Список типов недвижимости с количеством объектов"""
    from django.core.paginator import Paginator
    
    property_types = PropertyType.objects.annotate(
        total_properties=Count('property'),
        available_properties=Count(
            'property',
            filter=Q(property__status__in=['for_sale', 'for_rent'])
        )
    ).order_by('name')
    
    # Pagination: 3 items per page
    paginator = Paginator(property_types, 3)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)
    
    context = {
        'property_types': page_obj,
        'page_obj': page_obj,
        'paginator': paginator,
    }
    
    return render(request, 'properties/type_list.html', context)