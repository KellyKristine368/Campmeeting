from django.db import models
from apps.registration.models import Registration

class Room(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male Only'),
        ('female', 'Female Only'),
        ('mixed', 'Mixed / Family'),
    ]

    room_number = models.CharField(max_length=50, unique=True, help_text="e.g., Room 10, Cabin B")
    block_name = models.CharField(max_length=100, help_text="e.g., Male Hostel, Premium Block")
    capacity = models.PositiveIntegerField(help_text="Maximum number of people allowed")
    gender_restriction = models.CharField(max_length=10, choices=GENDER_CHOICES, default='mixed')
    
    def __str__(self):
        return f"{self.block_name} - {self.room_number}"

    @property
    def current_occupancy(self):
        return self.allocations.count()

    @property
    def is_full(self):
        return self.current_occupancy >= self.capacity


class RoomAllocation(models.Model):
    # Link to a specific room
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='allocations')
    
    # Link to a specific registration row
    registration = models.OneToOneField(Registration, on_delete=models.CASCADE, related_name='accommodation')
    
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.registration.user.get_full_name()} assigned to {self.room}"