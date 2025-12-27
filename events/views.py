from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from .models import Event
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
    events = Event.objects.all().order_by('-date')
    return render(request, 'events/event_list.html', {
        'events': events
    })


# EVENT DETAIL PAGE
def event_detail(request, event_id):
    event = get_object_or_404(Event, id=event_id)

    # ✅ Approved media only
    media = EventMedia.objects.filter(event=event, approved=True)

    # ✅ Participant details
    participants = Participant.objects.filter(event=event)

    # ✅ Media upload (public)
    if request.method == "POST":
        form = EventMediaForm(request.POST, request.FILES)
        if form.is_valid():
            media_obj = form.save(commit=False)
            media_obj.event = event
            media_obj.approved = False   # 🔒 Admin approval required
            media_obj.save()
            return redirect('event_detail', event_id=event.id)
    else:
        form = EventMediaForm()

    return render(request, 'events/event_detail.html', {
        'event': event,
        'media': media,
        'participants': participants,
        'form': form
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
