from django.contrib import admin
from apps.registration.models import Registration

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    # What columns show up in the main list table
    list_display = ('get_user_name', 'branch', 'department', 'status', 'is_paid', 'registered_at')
    
    # Clickable filters on the right-hand sidebar
    list_filter = ('status', 'is_paid', 'branch', 'department')
    
    # Search bar config (allows searching the linked User's email/names too)
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'branch', 'department')
    
    # Let organizers quickly check/uncheck 'is_paid' or update 'status' right from the table view
    list_editable = ('status', 'is_paid')

    # Custom method to display the user's full name beautifully in the table
    def get_user_name(self, obj):
        full_name = obj.user.get_full_name()
        return full_name if full_name else obj.user.email
    get_user_name.short_description = 'Attendee Name'