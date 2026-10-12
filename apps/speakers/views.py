from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from apps.speakers.models import Speaker
from apps.speakers.serializers import SpeakerSerializer

# Create your views here.
class SpeakerViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows speakers to be viewed by anyone.
    """
    queryset = Speaker.objects.all()
    serializer_class = SpeakerSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'