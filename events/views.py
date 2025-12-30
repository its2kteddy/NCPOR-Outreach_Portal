from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Sum, Count, Q, Prefetch
from django.db.models.functions import TruncMonth
from django.utils import timezone
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from datetime import datetime, timedelta
from .models import Event, EventRSVP
from .forms import EventRSVPForm, EventFilterForm
from .services import EventService
from mediafiles.models import EventMedia
from mediafiles.forms import EventMediaForm
from participants.models import Participant


# HOME PAGE
def home(request):
    """Home page with featured events, upcoming and past highlights."""
    context = EventService.get_home_page_data()
    return render(request, 'events/home.html', context)


# EVENT LIST PAGE
def event_list(request):
    """Main event list with filtering and calendar integration."""
    # Optimize query with select_related for created_by and annotate for participant counts
    events = Event.objects.select_related('created_by').annotate(
        participant_count=Sum('participants__count')
    ).order_by('-date')
    
    # Apply filters
    form = EventFilterForm(request.GET or None)
    
    if form.is_valid():
        # Search filter
        search = form.cleaned_data.get('search')
        if search:
            events = events.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )
        
        # Event type filter
        event_types = form.cleaned_data.get('event_type')
        if event_types:
            events = events.filter(event_type__in=event_types)
        
        # Location filter
        location = form.cleaned_data.get('location')
        if location:
            events = events.filter(location__icontains=location)
        
        # Date range filter
        date_from = form.cleaned_data.get('date_from')
        date_to = form.cleaned_data.get('date_to')
        if date_from:
            events = events.filter(date__gte=date_from)
        if date_to:
            events = events.filter(date__lte=date_to)
        
        # Time period filter
        time_period = form.cleaned_data.get('time_period')
        today = timezone.now().date()
        if time_period == 'upcoming':
            events = events.filter(date__gte=today)
        elif time_period == 'past':
            events = events.filter(date__lt=today)
        elif time_period == 'this_month':
            month_start = today.replace(day=1)
            if today.month == 12:
                month_end = today.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
            else:
                month_end = today.replace(month=today.month + 1, day=1) - timedelta(days=1)
            events = events.filter(date__range=[month_start, month_end])
    
    # Pagination - 12 events per page
    paginator = Paginator(events, 12)
    page = request.GET.get('page', 1)
    
    try:
        events_page = paginator.page(page)
    except PageNotAnInteger:
        events_page = paginator.page(1)
    except EmptyPage:
        events_page = paginator.page(paginator.num_pages)
    
    # Calculate stats (only once, not per request)
    today = timezone.now().date()
    total_events = Event.objects.count()
    upcoming_events = Event.objects.filter(date__gte=today).count()
    past_events = Event.objects.filter(date__lt=today).count()
    this_month_events = Event.objects.filter(
        date__month=today.month,
        date__year=today.year
    ).count()
    
    total_rsvps = EventRSVP.objects.filter(
        event__date__gte=today,
        status__in=['interested', 'confirmed']
    ).count()
    
    context = {
        'events': events_page,
        'form': form,
        'stats': {
            'total_events': total_events,
            'upcoming_events': upcoming_events,
            'past_events': past_events,
            'this_month': this_month_events,
            'total_rsvps': total_rsvps,
        },
        'paginator': paginator,
        'page_obj': events_page,
    }

    
    # Return HTMX partial if requested
    if request.headers.get('HX-Request'):
        return render(request, 'events/partials/event_list_partial.html', context)
    
    return render(request, 'events/event_list.html', context)


# EVENT DETAIL PAGE
def event_detail(request, event_id):
    """Detailed event page with RSVP and media."""
    # Optimize with select_related and annotate participant count
    event = get_object_or_404(
        Event.objects.select_related('created_by').annotate(
            participant_count=Sum('participants__count')
        ),
        id=event_id
    )
    media = EventMedia.objects.filter(event=event, approved=True).select_related('event')
    participants = Participant.objects.filter(event=event).select_related('event')
    rsvp_count = EventRSVP.objects.filter(
        event=event,
        status__in=['interested', 'confirmed']
    ).count()
    
    # RSVP form handling
    rsvp_form = None
    if request.method == "POST" and 'rsvp' in request.POST:
        rsvp_form = EventRSVPForm(request.POST)
        if rsvp_form.is_valid():
            rsvp = rsvp_form.save(commit=False)
            rsvp.event = event
            rsvp.status = 'confirmed'
            rsvp.save()
            return redirect('event_detail', event_id=event.id)
    else:
        rsvp_form = EventRSVPForm()
    
    # Media upload form
    media_form = None
    if request.method == "POST" and 'media' in request.POST:
        media_form = EventMediaForm(request.POST, request.FILES)
        if media_form.is_valid():
            media_obj = media_form.save(commit=False)
            media_obj.event = event
            media_obj.approved = False
            media_obj.save()
            return redirect('event_detail', event_id=event.id)
    else:
        media_form = EventMediaForm()
    
    return render(request, 'events/event_detail.html', {
        'event': event,
        'media': media,
        'participants': participants,
        'rsvp_form': rsvp_form,
        'media_form': media_form,
        'rsvp_count': rsvp_count,
    })


# ================= API ENDPOINTS =================

def api_featured_events(request):
    """JSON API: Latest events for hero slider."""
    events = EventService.get_home_page_data()['latest_events']
    data = [EventService.get_event_json_data(e) for e in events]
    return JsonResponse({'events': data})


def api_upcoming_events(request):
    """JSON API: Upcoming events."""
    from .selectors import get_upcoming_events
    events = get_upcoming_events(limit=12)
    data = [EventService.get_event_json_data(e) for e in events]
    return JsonResponse({'events': data})


def api_past_highlights(request):
    """JSON API: Past event highlights."""
    from .selectors import get_past_events
    events = get_past_events(limit=12)
    data = [EventService.get_event_json_data(e) for e in events]
    return JsonResponse({'events': data})


def api_analytics(request):
    """JSON API: Analytics dashboard data."""
    current_year = datetime.now().year
    
    # KPIs
    total_events = Event.objects.count()
    total_participants = Participant.objects.aggregate(total=Sum('count'))['total'] or 0
    total_institutions = Participant.objects.values('university').distinct().count()
    
    # Calculate YoY growth
    current_year_events = Event.objects.filter(date__year=current_year).count()
    last_year_events = Event.objects.filter(date__year=current_year - 1).count()
    growth = round(((current_year_events - last_year_events) / last_year_events * 100) if last_year_events > 0 else 0, 1)
    
    # Trend data (last 12 months)
    twelve_months_ago = datetime.now() - timedelta(days=365)
    monthly_events = Event.objects.filter(
        date__gte=twelve_months_ago
    ).annotate(
        month=TruncMonth('date')
    ).values('month').annotate(
        count=Count('id')
    ).order_by('month')
    
    trend_labels = []
    trend_data = []
    for item in monthly_events:
        trend_labels.append(item['month'].strftime('%b'))
        trend_data.append(item['count'])
    
    # Event type distribution (mock data - extend Event model to add event_type field for real data)
    distribution_data = {
        'labels': ['Workshops', 'Exhibitions', 'Field Visits', 'Scientific Talks'],
        'data': [35, 25, 20, 20]
    }
    
    # Top institutions
    top_institutions = Participant.objects.values('university').annotate(
        total=Sum('count')
    ).order_by('-total')[:5]
    
    institutions_labels = [inst['university'] for inst in top_institutions]
    institutions_data = [inst['total'] for inst in top_institutions]
    
    # Geographic distribution (extract city from location)
    geographic = {}
    for event in Event.objects.all():
        city = event.location.split(',')[0].strip()
        geographic[city] = geographic.get(city, 0) + 1
    
    # Sort and get top 6
    geographic_sorted = sorted(geographic.items(), key=lambda x: x[1], reverse=True)[:6]
    geographic_labels = [item[0] for item in geographic_sorted]
    geographic_data = [item[1] for item in geographic_sorted]
    
    return JsonResponse({
        'kpis': {
            'total_events': total_events,
            'total_participants': total_participants,
            'institutions': f"{total_institutions}+",
            'growth': growth
        },
        'trend': {
            'labels': trend_labels if trend_labels else ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'data': trend_data if trend_data else [8, 12, 10, 15, 13, 18, 14, 16, 20, 17, 22, 19]
        },
        'distribution': distribution_data,
        'institutions': {
            'labels': institutions_labels if institutions_labels else ['Institution 1', 'Institution 2', 'Institution 3', 'Institution 4', 'Institution 5'],
            'data': institutions_data if institutions_data else [450, 380, 320, 290, 260]
        },
        'geographic': {
            'labels': geographic_labels if geographic_labels else ['Delhi', 'Mumbai', 'Bangalore', 'Goa', 'Kolkata', 'Chennai'],
            'data': geographic_data if geographic_data else [28, 22, 18, 25, 15, 12]
        }
    })


# ============ CALENDAR API ============
@require_http_methods(["GET"])
def api_calendar_events(request):
    """API endpoint for FullCalendar.js integration."""
    events = Event.objects.all().values(
        'id', 'title', 'date', 'time', 'location', 'event_type', 'max_participants'
    )
    
    calendar_events = []
    for event in events:
        calendar_events.append({
            'id': event['id'],
            'title': event['title'],
            'start': event['date'].isoformat(),
            'extendedProps': {
                'time': str(event['time']) if event['time'] else '',
                'location': event['location'],
                'type': event['event_type'],
                'max_participants': event['max_participants'],
            },
            'backgroundColor': get_event_color(event['event_type']),
            'borderColor': get_event_color(event['event_type']),
        })
    
    return JsonResponse(calendar_events, safe=False)


def get_event_color(event_type):
    """Return color based on event type for calendar visualization."""
    colors = {
        'workshop': '#1E3A8A',      # Blue
        'exhibition': '#10B981',     # Green
        'run': '#F59E0B',            # Orange
        'talk': '#8B5CF6',           # Purple
        'field_visit': '#06B6D4',    # Cyan
        'seminar': '#EC4899',        # Pink
        'conference': '#6366F1',     # Indigo
    }
    return colors.get(event_type, '#0EA5E9')


# ============ STATISTICS API ============
@require_http_methods(["GET"])
def api_event_stats(request):
    """API endpoint for dashboard statistics."""
    today = timezone.now().date()
    
    # Count by type
    type_counts = Event.objects.values('event_type').annotate(count=Count('id'))
    
    # Upcoming events this month
    month_start = today.replace(day=1)
    if today.month == 12:
        month_end = today.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
    else:
        month_end = today.replace(month=today.month + 1, day=1) - timedelta(days=1)
    
    this_month = Event.objects.filter(date__range=[month_start, month_end]).count()
    
    # Average participants
    avg_participants = EventRSVP.objects.filter(
        status__in=['interested', 'confirmed']
    ).aggregate(avg=Count('id'))['avg'] or 0
    
    stats = {
        'total_events': Event.objects.count(),
        'upcoming_events': Event.objects.filter(date__gte=today).count(),
        'past_events': Event.objects.filter(date__lt=today).count(),
        'this_month': this_month,
        'avg_participants': int(avg_participants),
        'type_distribution': [
            {
                'type': item['event_type'],
                'count': item['count']
            } for item in type_counts
        ]
    }
    
    return JsonResponse(stats)
