from django.db import models
from django.conf import settings

class Registration(models.Model):
    REGISTRATION_STATUS = [
        ('pending', 'Pending Review'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    # Link to your CustomUser model safely using settings.AUTH_USER_MODEL
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='camp_registration'
    )
    
    branch = models.CharField(max_length=100, help_text="Home church branch (e.g., Accra, Kumasi)")
    department = models.CharField(max_length=100, blank=True, help_text="e.g., Choir, Ushers, Media")
    emergency_contact_name = models.CharField(max_length=150)
    emergency_contact_phone = models.CharField(max_length=15)
    dietary_requirements = models.TextField(blank=True, null=True)
    medical_notes = models.TextField(blank=True, null=True)
    
    # Status tracking
    status = models.CharField(max_length=20, choices=REGISTRATION_STATUS, default='pending')
    is_paid = models.BooleanField(default=False)
    
    registered_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-registered_at']

    def __str__(self):
        return f"Registration for {self.user.email} ({self.branch})"