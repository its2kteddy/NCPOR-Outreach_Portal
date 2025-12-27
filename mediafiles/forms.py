from django import forms
from .models import EventMedia

class EventMediaForm(forms.ModelForm):
    class Meta:
        model = EventMedia
        fields = ['file', 'media_type']
