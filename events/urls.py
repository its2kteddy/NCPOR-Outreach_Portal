from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),          # HOME PAGE
    path('events/', views.event_list, name='event_list'),
    path('events/<int:event_id>/', views.event_detail, name='event_detail'),
    
    # API endpoints for dynamic loading
    path('api/events/featured/', views.api_featured_events, name='api_featured_events'),
    path('api/events/upcoming/', views.api_upcoming_events, name='api_upcoming_events'),
    path('api/events/highlights/', views.api_past_highlights, name='api_past_highlights'),
]
