from django.contrib import admin
from apps.accommodation.models import Room, RoomAllocation

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('block_name', 'room_number', 'capacity', 'gender_restriction', 'get_occupancy', 'is_full_status')
    list_filter = ('block_name', 'gender_restriction')
    search_fields = ('block_name', 'room_number')

    def get_occupancy(self, obj):
        return f"{obj.current_occupancy} / {obj.capacity}"
    get_occupancy.short_description = 'Occupancy'

    def is_full_status(self, obj):
        return obj.is_full
    is_full_status.boolean = True  # Displays a beautiful green checkmark or red X icon
    is_full_status.short_description = 'Full?'

@admin.register(RoomAllocation)
class RoomAllocationAdmin(admin.ModelAdmin):
    list_display = ('get_attendee_name', 'room', 'assigned_at')
    list_filter = ('room__block_name', 'room__room_number')
    search_fields = ('registration__user__first_name', 'registration__user__last_name', 'room__room_number')

    def get_attendee_name(self, obj):
        return obj.registration.user.get_full_name()
    get_attendee_name.short_description = 'Attendee'