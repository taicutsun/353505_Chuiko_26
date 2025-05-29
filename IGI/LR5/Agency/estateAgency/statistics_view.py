from django.shortcuts import render
from django.db.models import Avg, Max, Min, Sum, Count
from django.contrib.admin.views.decorators import staff_member_required
from .models import Deal, Property, PropertyType, Client, Employee
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64

def generate_chart(data, labels, chart_type='bar', title=''):
    # Use a valid style from matplotlib
    plt.style.use('ggplot')  # Changed from 'seaborn' to 'ggplot'
    
    # Create figure with white background
    fig, ax = plt.subplots(figsize=(10, 6), facecolor='white')
    ax.set_facecolor('white')
    
    if chart_type == 'line':
        ax.plot(labels, data, marker='o', color='#2196F3')
    elif chart_type == 'bar':
        bars = ax.bar(labels, data, color='#2196F3')
        # Add value labels on top of each bar
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{int(height):,}',
                   ha='center', va='bottom')
    
    # Customize appearance
    ax.set_title(title, pad=20, fontsize=12, fontweight='bold')
    ax.set_xticks(range(len(labels)))
    ax.set_xticklabels(labels, rotation=45, ha='right')
    
    # Customize grid
    ax.grid(True, axis='y', alpha=0.3, linestyle='--')
    
    # Remove spines
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    plt.tight_layout()
    
    # Save to buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=300, bbox_inches='tight')
    buf.seek(0)
    chart_url = f"data:image/png;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"
    buf.close()
    plt.close(fig)
    return chart_url

@staff_member_required
def statistics_view(request):
    # Основная статистика по сделкам
    deals = Deal.objects.all()
    total_deals = deals.count()
    total_commission = deals.aggregate(total=Sum('commission'))['total'] or 0
    
    # Статистика по объектам недвижимости
    properties = Property.objects.all()
    avg_price = properties.aggregate(avg=Avg('price'))['avg'] or 0
    max_price = properties.aggregate(max=Max('price'))['max'] or 0
    
    # Распределение объектов по типам
    property_types = (
        Property.objects.values('property_type__name')
        .annotate(count=Count('id'))
        .order_by('-count')
    )
    
    # Распределение сделок по типам
    deals_by_type = (
        deals.values('deal_type')
        .annotate(
            count=Count('id'),
            total_amount=Sum('property__price'),
            total_commission=Sum('commission')
        )
        .order_by('-count')
    )
    
    # Топ агентов
    top_agents = (
        Employee.objects.annotate(
            deals_count=Count('deal'),
            total_commission=Sum('deal__commission')
        )
        .filter(deals_count__gt=0)
        .order_by('-total_commission')[:5]
    )
    
    # Статистика клиентов
    clients_stats = {
        'total': Client.objects.count(),
        'avg_budget': Client.objects.aggregate(avg=Avg('budget'))['avg'] or 0,
        'active_deals': Client.objects.filter(deal__isnull=False).distinct().count()
    }
    
    # Генерация графиков
    price_distribution_chart = generate_chart(
        data=[p.price for p in properties.order_by('-price')[:10]],
        labels=[p.title[:20] + '...' for p in properties.order_by('-price')[:10]],
        title='Топ 10 объектов по цене (₽)'
    )
    
    property_types_chart = generate_chart(
        data=[t['count'] for t in property_types],
        labels=[t['property_type__name'] for t in property_types],
        title='Распределение объектов по типам'
    )
    
    deals_chart = generate_chart(
        data=[d['count'] for d in deals_by_type],
        labels=[d.get('deal_type') for d in deals_by_type],
        title='Распределение сделок по типам'
    )

    context = {
        'total_deals': total_deals,
        'total_commission': total_commission,
        'avg_price': avg_price,
        'max_price': max_price,
        'clients_stats': clients_stats,
        'top_agents': top_agents,
        'price_distribution_chart': price_distribution_chart,
        'property_types_chart': property_types_chart,
        'deals_chart': deals_chart,
        'deals_by_type': deals_by_type,
        'property_types': property_types,
    }
    
    return render(request, 'statistics.html', context)