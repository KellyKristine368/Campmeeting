from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from apps.schedule.models import Session
from apps.schedule.serializers import SessionSerializer

class SessionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows camp meeting sessions to be viewed by anyone.
    """
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'