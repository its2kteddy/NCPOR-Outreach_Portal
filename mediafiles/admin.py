from django.contrib import admin
from .models import EventMedia

@admin.register(EventMedia)
class EventMediaAdmin(admin.ModelAdmin):
    list_display = ('event', 'media_type', 'approved')
    list_filter = ('approved', 'media_type', 'event')
    search_fields = ('event__title',)

    actions = ['approve_media', 'reject_media']

    def approve_media(self, request, queryset):
        queryset.update(approved=True)
    approve_media.short_description = "Approve selected media"

    def reject_media(self, request, queryset):
        queryset.delete()
    reject_media.short_description = "Delete selected media"

