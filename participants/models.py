from django.db import models
from events.models import Event

class Participant(models.Model):
    QUALIFICATION_CHOICES = [
        ('UG', 'Undergraduate'),
        ('PG', 'Postgraduate'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='participants')
    university = models.CharField(max_length=200)
    qualification = models.CharField(max_length=2, choices=QUALIFICATION_CHOICES)
    count = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.university} ({self.qualification})"
