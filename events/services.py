"""
Business logic layer for events.
"""
from .selectors import (
    get_featured_events,
    get_upcoming_events,
    get_past_events,
    get_latest_event
)


class EventService:
    """Service for event-related operations."""
    
    @staticmethod
    def get_home_page_data():
        """
        Get all data needed for home page in one call.
        Returns dict with featured, upcoming, and past events.
        """
        return {
            'featured_event': get_latest_event(),
            'latest_events': list(get_featured_events(6)),
            'upcoming_events': list(get_upcoming_events(8)),
            'past_events': list(get_past_events(8)),
        }
    
    @staticmethod
    def get_event_json_data(event):
        """Convert event to JSON-friendly dict."""
        return {
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'date': event.date.isoformat(),
            'location': event.location,
            'cover_image': event.cover_image.url if event.cover_image else None,
        }
