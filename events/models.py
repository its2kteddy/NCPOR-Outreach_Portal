from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.utils import timezone

class Event(models.Model):
    EVENT_TYPE_CHOICES = [
        ('workshop', 'Workshop'),
        ('exhibition', 'Exhibition'),
        ('run', 'Run'),
        ('talk', 'Talk'),
        ('field_visit', 'Field Visit'),
        ('seminar', 'Seminar'),
        ('conference', 'Conference'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField(blank=True, null=True)
    location = models.CharField(max_length=200)
    event_type = models.CharField(
        max_length=20,
        choices=EVENT_TYPE_CHOICES,
        default='workshop'
    )
    max_participants = models.PositiveIntegerField(
        default=100,
        validators=[MinValueValidator(1)]
    )
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    cover_image = models.ImageField(
        upload_to='event_covers/',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        ordering = ['-date']
        indexes = [
            models.Index(fields=['date', 'event_type']),
            models.Index(fields=['location']),
        ]

    def __str__(self):
        return self.title

    @property
    def current_participants(self):
        return sum(p.count for p in self.participants.all())

    @property
    def available_slots(self):
        return max(0, self.max_participants - self.current_participants)

    @property
    def is_past(self):
        return self.date < timezone.now().date()

    @property
    def is_upcoming(self):
        return self.date >= timezone.now().date()


class EventRSVP(models.Model):
    RSVP_STATUS_CHOICES = [
        ('interested', 'Interested'),
        ('confirmed', 'Confirmed'),
        ('attended', 'Attended'),
        ('cancelled', 'Cancelled'),
    ]

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='rsvps'
    )
    email = models.EmailField()
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, blank=True)
    status = models.CharField(
        max_length=20,
        choices=RSVP_STATUS_CHOICES,
        default='interested'
    )
    num_guests = models.PositiveIntegerField(default=1)
    special_requirements = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['event', 'email']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.event.title}"
