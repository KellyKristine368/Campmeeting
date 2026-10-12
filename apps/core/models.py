from django.db import models


# ------------------------------------------------------------------
# SDA Church Hierarchy
# Conference → District → Local Church
# These power the cascading dropdowns on the registration form
# ------------------------------------------------------------------
class Conference(models.Model):
    """
    e.g. Ghana Conference, Northern Ghana Conference,
    Volta River Conference
    """
    name = models.CharField(max_length=200, unique=True)
    code = models.CharField(
        max_length=20, blank=True,
        help_text="Short code e.g. GC, NGC, VRC"
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class District(models.Model):
    """e.g. Accra Central District, Tema District"""
    conference = models.ForeignKey(
        Conference,
        on_delete=models.CASCADE,
        related_name="districts"
    )
    name = models.CharField(max_length=200)

    class Meta:
        ordering        = ["name"]
        unique_together = ["conference", "name"]

    def __str__(self):
        return f"{self.name} — {self.conference.name}"


class LocalChurch(models.Model):
    """e.g. Adenta SDA Church, Tema Community 1 SDA Church"""
    district = models.ForeignKey(
        District,
        on_delete=models.CASCADE,
        related_name="churches"
    )
    name = models.CharField(max_length=200)

    class Meta:
        ordering        = ["name"]
        unique_together = ["district", "name"]

    def __str__(self):
        return self.name


# ------------------------------------------------------------------
# Site Settings — one row controls the entire site
# ------------------------------------------------------------------
class SiteSettings(models.Model):
    campmeeting_name = models.CharField(
        max_length=200,
        default="Annual Campmeeting"
    )
    theme = models.CharField(
        max_length=300, blank=True,
        help_text="This year's theme e.g. 'Revive Us Again'"
    )
    theme_scripture = models.CharField(
        max_length=300, blank=True,
        help_text="e.g. Psalm 85:6"
    )
    start_date = models.DateField()
    end_date   = models.DateField()

    # Venue
    venue_name        = models.CharField(max_length=200)
    venue_address     = models.TextField()
    google_maps_embed = models.TextField(
        blank=True,
        help_text="Paste the full Google Maps iframe embed code here"
    )

    # Registration control
    registration_open = models.BooleanField(
        default=True,
        help_text="Toggle to open or close registrations"
    )
    registration_fee = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00,
        help_text="Set to 0.00 for free registration"
    )

    # Church contact
    church_name     = models.CharField(max_length=200)
    church_email    = models.EmailField(blank=True)
    church_phone    = models.CharField(max_length=20, blank=True)
    whatsapp_number = models.CharField(
        max_length=20, blank=True,
        help_text="Include country code e.g. 233201234567"
    )

    # Social media
    facebook_url        = models.URLField(blank=True)
    instagram_url       = models.URLField(blank=True)
    youtube_channel_url = models.URLField(blank=True)

    # Hero image for homepage
    hero_image = models.ImageField(
        upload_to="site/", blank=True, null=True
    )

    class Meta:
        verbose_name        = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return self.campmeeting_name


# ------------------------------------------------------------------
# Announcement Banner
# ------------------------------------------------------------------
class Announcement(models.Model):
    message    = models.TextField(
        help_text="Short message shown at the top of the site"
    )
    is_active  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.message[:80]