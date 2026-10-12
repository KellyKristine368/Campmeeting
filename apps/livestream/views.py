from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from apps.livestream.models import LiveStream
from apps.livestream.serializers import LiveStreamSerializer

class LiveStreamViewSet(viewsets.ReadOnlyModelViewSet):
    """Anyone can view stream schedules or current live keys"""
    queryset = LiveStream.objects.all()
    serializer_class = LiveStreamSerializer
    permission_classes = [AllowAny]