from django.contrib import admin
from apps.contact.models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone_number', 'subject', 'is_resolved', 'submitted_at')
    
    # Easily toggle 'is_resolved' right from the table rows
    list_editable = ('is_resolved',)
    
    list_filter = ('is_resolved', 'submitted_at')
    search_fields = ('name', 'email', 'subject', 'message')
    
    # Makes the submission date clear but uneditable
    readonly_fields = ('submitted_at',)