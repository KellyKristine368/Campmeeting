from django.db import models

class LiveStream(models.Model):
    title = models.CharField(max_length=200, help_text="e.g., Camp Day 1 Evening Session")
    stream_url = models.URLField(help_text="Full URL to the stream (YouTube, Facebook Live, or Twitch)")
    embed_id = models.CharField(max_length=100, help_text="The exact video ID string needed for iframe embeds")
    is_live = models.BooleanField(default=False, help_text="Toggle this true when actively broadcasting")
    scheduled_start = models.DateTimeField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-scheduled_start']

    def __str__(self):
        return f"{self.title} - {'LIVE NOW' if self.is_live else 'Scheduled'}"