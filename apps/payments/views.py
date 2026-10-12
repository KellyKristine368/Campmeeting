import uuid
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.payments.models import Payment
from apps.payments.serializers import PaymentSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or getattr(user, 'is_organiser', False):
            return Payment.objects.all()
        return Payment.objects.filter(registration__user=user)

    # Custom action to initialize a secure transaction reference for the frontend
    @action(detail=False, methods=['post'], url_path='initialize')
    def initialize_payment(self, request):
        registration_id = request.data.get('registration_id')
        amount = request.data.get('amount')
        
        if not registration_id or not amount:
            return Response({"error": "Missing registration_id or amount"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Generate a professional, unique reference trace code
        reference = f"CAMP-{uuid.uuid4().hex[:10].upper()}"
        
        payment = Payment.objects.create(
            registration_id=registration_id,
            amount=amount,
            reference=reference,
            status='pending'
        )
        
        return Response({
            "reference": reference,
            "amount": amount,
            "payment_id": payment.id
        }, status=status.HTTP_201_CREATED)