from django.db import models
from django.conf import settings
from apps.registration.models import Registration

class Payment(models.Model):
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
    ]

    registration = models.ForeignKey(Registration, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Amount in GHS")
    reference = models.CharField(max_length=100, unique=True, help_text="Unique transaction reference code")
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    provider_channel = models.CharField(max_length=50, blank=True, help_text="e.g., MTN Mobile Money, Visa")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.reference} - {self.status} ({self.amount} GHS)"