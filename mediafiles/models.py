from django.db import models
from events.models import Event

class EventMedia(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="media")
    file = models.FileField(upload_to="event_media/")
    media_type = models.CharField(
        max_length=10,
        choices=[('image', 'Image'), ('video', 'Video')],
        default='image'
    )
    approved = models.BooleanField(default=True)  # ✅ ADD THIS

    def __str__(self):
        return self.file.name
