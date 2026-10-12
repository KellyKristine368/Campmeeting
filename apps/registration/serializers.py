from rest_framework import serializers
from apps.registration.models import Registration
from apps.accounts.serializers import UserProfileSerializer # Assuming this exists for user details

class RegistrationSerializer(serializers.ModelSerializer):
    # This lets the frontend see user data alongside registration details
    user_details = UserProfileSerializer(source='user', read_only=True)

    class Meta:
        model = Registration
        fields = [
            'id', 'user_details', 'branch', 'department', 
            'emergency_contact_name', 'emergency_contact_phone', 
            'dietary_requirements', 'medical_notes', 'status', 
            'is_paid', 'registered_at'
        ]
        read_only_fields = ['status', 'is_paid', 'registered_at']

    def create(self, validated_data):
        # Automatically assign the request's user during creation
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)