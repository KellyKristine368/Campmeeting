from django.db import models
from django.utils.text import slugify
from apps.speakers.models import Speaker

class Session(models.Model):
    # Session types help the frontend filter by 'Morning Devotional', 'Workshop', etc.
    SESSION_TYPES = [
        ('service', 'General Service'),
        ('workshop', 'Workshop / Breakout'),
        ('prayer', 'Prayer Session'),
        ('meal', 'Break / Meal Time'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True, help_text="Auto-generated URL-friendly session name")
    session_type = models.CharField(max_length=20, choices=SESSION_TYPES, default='service')
    description = models.TextField(blank=True)
    
    # Linking to your speakers app (optional, since meals or breaks don't need a speaker)
    speaker = models.ForeignKey(Speaker, on_delete=models.SET_NULL, null=True, blank=True, related_name='sessions')
    
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.CharField(max_length=150, default="Main Auditorium")
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_time']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.start_time.strftime('%d %b, %I:%M %p')})"