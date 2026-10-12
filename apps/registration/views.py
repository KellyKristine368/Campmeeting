from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from apps.registration.models import Registration
from apps.registration.serializers import RegistrationSerializer

class RegistrationViewSet(viewsets.ModelViewSet):
    serializer_class = RegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Admins see all registrations; regular members only see their own row
        user = self.request.user
        if user.is_staff or getattr(user, 'is_organiser', False):
            return Registration.objects.all()
        return Registration.objects.filter(user=user)

    def perform_create(self, serializer):
        # Prevent a user from registering twice for the same camp meeting
        if Registration.objects.filter(user=self.request.user).exists():
            raise ValidationError("You have already registered for this camp meeting.")
        serializer.save()