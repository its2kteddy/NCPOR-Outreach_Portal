from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    location = models.CharField(max_length=200)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    cover_image = models.ImageField(
        upload_to='event_covers/',
        blank=True,
        null=True
    )
    def __str__(self):
        return self.title
