from django.contrib import admin
from .models import (
    SiteSettings, Conference,
    District, LocalChurch, Announcement
)

admin.site.site_header  = "⛺ Campmeeting Admin"
admin.site.site_title   = "Campmeeting"
admin.site.index_title  = "Welcome to the Campmeeting Dashboard"


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Event Details", {
            "fields": (
                "campmeeting_name", "theme",
                "theme_scripture", "start_date",
                "end_date", "hero_image"
            )
        }),
        ("Venue", {
            "fields": (
                "venue_name", "venue_address",
                "google_maps_embed"
            )
        }),
        ("Registration", {
            "fields": ("registration_open", "registration_fee")
        }),
        ("Church Contact", {
            "fields": (
                "church_name", "church_email",
                "church_phone", "whatsapp_number"
            )
        }),
        ("Social Media", {
            "fields": (
                "facebook_url", "instagram_url",
                "youtube_channel_url"
            )
        }),
    )

    def has_add_permission(self, request):
        # Only ever allow one SiteSettings row
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        # Prevent accidental deletion
        return False


@admin.register(Conference)
class ConferenceAdmin(admin.ModelAdmin):
    list_display  = ["name", "code"]
    search_fields = ["name"]


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display  = ["name", "conference"]
    list_filter   = ["conference"]
    search_fields = ["name"]


@admin.register(LocalChurch)
class LocalChurchAdmin(admin.ModelAdmin):
    list_display  = ["name", "district"]
    list_filter   = ["district__conference", "district"]
    search_fields = ["name"]


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display  = ["message", "is_active", "created_at"]
    list_editable = ["is_active"]