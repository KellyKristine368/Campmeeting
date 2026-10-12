from rest_framework import serializers
from apps.accommodation.models import Room, RoomAllocation

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'room_number', 'block_name', 'capacity', 'current_occupancy', 'is_full', 'gender_restriction']

class RoomAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomAllocation
        fields = ['id', 'room', 'registration', 'assigned_at']