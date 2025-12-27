"""
Event query selectors for clean data access layer.
"""
from django.utils import timezone
from .models import Event


def get_featured_events(limit=6):
    """Get latest events for hero slider."""
    return Event.objects.all().order_by('-date')[:limit]


def get_upcoming_events(limit=8):
    """Get future events ordered by date."""
    today = timezone.localdate()
    return Event.objects.filter(date__gte=today).order_by('date')[:limit]


def get_past_events(limit=8):
    """Get past events ordered by most recent."""
    today = timezone.localdate()
    return Event.objects.filter(date__lt=today).order_by('-date')[:limit]


def get_latest_event():
    """Get single most recent event for featured hero with media."""
    try:
        event = Event.objects.all().order_by('-date').prefetch_related('media').first()
        if event:
            # Attach media to event for template access
            event.images = event.media.filter(media_type='image', approved=True)
            event.videos = event.media.filter(media_type='video', approved=True)
        return event
    except Event.DoesNotExist:
        return None
