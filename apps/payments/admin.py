from django.contrib import admin
from apps.payments.models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    # Columns shown in the transaction list table
    list_display = ('reference', 'get_attendee_name', 'amount', 'status', 'provider_channel', 'created_at')
    
    # Quick filter sidebar on the right
    list_filter = ('status', 'provider_channel', 'created_at')
    
    # Search fields allowing searches through deep relationships (User details via Registration)
    search_fields = ('reference', 'registration__user__first_name', 'registration__user__last_name', 'registration__user__email')
    
    # Let admins manually mark a transaction status directly from the list if needed
    list_editable = ('status',)

    def get_attendee_name(self, obj):
        full_name = obj.registration.user.get_full_name()
        return full_name if full_name else obj.registration.user.email
    get_attendee_name.short_description = 'Attendee'