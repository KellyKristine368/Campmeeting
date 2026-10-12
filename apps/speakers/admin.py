from django.contrib import admin
from apps.speakers.models import Speaker

@admin.register(Speaker)
class SpeakerAdmin(admin.ModelAdmin):
    # Columns displayed in the admin list view
    list_display = ('order', 'title', 'name', 'ministry', 'created_at')
    
    # Fields you can click to enter the edit screen
    list_display_links = ('name',)
    
    # Adds a search bar specifically for names and ministries
    search_fields = ('name', 'ministry')
    
    # Automatically generates the slug in real-time as you type the name in the admin!
    prepopulated_fields = {'slug': ('title', 'name')}
    
    # Allows you to quickly change the display order directly from the list view
    list_editable = ('order',)