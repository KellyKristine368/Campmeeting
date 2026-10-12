from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from apps.accommodation.models import Room, RoomAllocation
from apps.accommodation.serializers import RoomSerializer, RoomAllocationSerializer

class RoomViewSet(viewsets.ReadOnlyModelViewSet):
    """Publicly viewable room options or details (ReadOnly for security)"""
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]

class RoomAllocationViewSet(viewsets.ModelViewSet):
    """Managed by administrators to assign attendees to rooms"""
    queryset = RoomAllocation.objects.all()
    serializer_class = RoomAllocationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or getattr(user, 'is_organiser', False):
            return RoomAllocation.objects.all()
        # Attendees can only see their own room assignment row
        return RoomAllocation.objects.filter(registration__user=user)