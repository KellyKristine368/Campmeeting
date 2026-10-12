from rest_framework import serializers
from apps.payments.models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'registration', 'amount', 'reference', 'status', 'provider_channel', 'created_at']
        read_only_fields = ['status', 'reference', 'provider_channel', 'created_at']