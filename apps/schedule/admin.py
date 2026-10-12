from django.contrib import admin
from apps.schedule.models import Session

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('title', 'session_type', 'start_time', 'end_time', 'location', 'speaker')
    
    # Adds a filter sidebar on the right side
    list_filter = ('session_type', 'location', 'start_time')
    
    search_fields = ('title', 'description', 'speaker__name')
    
    prepopulated_fields = {'slug': ('title',)}
    
    # Helps organize the edit form into clean visual sections
    fieldsets = (
        ('General Information', {
            'fields': ('title', 'slug', 'session_type', 'description', 'speaker')
        }),
        ('Time & Location', {
            'fields': ('start_time', 'end_time', 'location')
        }),
    )