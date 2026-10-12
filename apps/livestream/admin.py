from django.contrib import admin
from apps.livestream.models import LiveStream

@admin.register(LiveStream)
class LiveStreamAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_live', 'scheduled_start', 'created_at')
    
    # This allows toggling a stream live/offline with a single click right from the list view!
    list_editable = ('is_live',)
    
    list_filter = ('is_live', 'scheduled_start')
    search_fields = ('title',)