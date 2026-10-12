from rest_framework import viewsets, mixins
from rest_framework.permissions import AllowAny
from apps.contact.models import ContactMessage
from apps.contact.serializers import ContactMessageSerializer

class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    Publicly open endpoint allowing anyone to post a message. 
    It intentionally blocks listing messages publicly for private user data security.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]