from django import forms
from django.forms import ModelForm
from .models import Event, EventRSVP


class EventRSVPForm(forms.ModelForm):
    class Meta:
        model = EventRSVP
        fields = ['name', 'email', 'phone', 'num_guests', 'special_requirements', 'status']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white',
                'placeholder': 'Your full name',
                'required': True,
            }),
            'email': forms.EmailInput(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white',
                'placeholder': 'your@email.com',
                'required': True,
            }),
            'phone': forms.TextInput(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white',
                'placeholder': '+91 XXXXX XXXXX',
            }),
            'num_guests': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white',
                'min': 1,
                'value': 1,
            }),
            'special_requirements': forms.Textarea(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white',
                'placeholder': 'Any special requirements or dietary restrictions?',
                'rows': 3,
            }),
            'status': forms.HiddenInput(),
        }


class EventFilterForm(forms.Form):
    search = forms.CharField(
        max_length=200,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white',
            'placeholder': 'Search events...',
            'hx-post': 'events:event_filter',
            'hx-trigger': 'keyup changed delay:500ms',
            'hx-target': '#event-list',
        })
    )
    event_type = forms.MultipleChoiceField(
        choices=Event.EVENT_TYPE_CHOICES,
        required=False,
        widget=forms.CheckboxSelectMultiple()
    )
    location = forms.CharField(
        max_length=200,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white',
            'placeholder': 'Search location...',
            'autocomplete': 'off',
        })
    )
    date_from = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={
            'class': 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white',
            'type': 'date',
        })
    )
    date_to = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={
            'class': 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white',
            'type': 'date',
        })
    )
    time_period = forms.ChoiceField(
        choices=[
            ('all', 'All Events'),
            ('upcoming', 'Upcoming Events'),
            ('past', 'Past Events'),
            ('this_month', 'This Month'),
        ],
        required=False,
        initial='upcoming',
        widget=forms.Select(attrs={
            'class': 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white',
        })
    )
