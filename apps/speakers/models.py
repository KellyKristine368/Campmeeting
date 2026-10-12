from django.db import models
from django.utils.text import slugify

class Speaker(models.Model):
    title = models.CharField(max_length=50, blank=True)
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, blank=True, help_text="Auto-generated URL-friendly name")
    ministry = models.CharField(max_length=200)
    bio = models.TextField()
    profile_picture = models.ImageField(upload_to='speakers/', blank=True, null=True)
    
    facebook_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']

    # Automatically generate the slug if it's left empty
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title} {self.name}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} {self.name}".strip()