from rest_framework import serializers
from django.utils import timezone
from .models import (
    SiteSettings, Conference,
    District, LocalChurch, Announcement
)


class ConferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Conference
        fields = ["id", "name", "code"]


class DistrictSerializer(serializers.ModelSerializer):
    conference_name = serializers.CharField(
        source="conference.name", read_only=True
    )

    class Meta:
        model  = District
        fields = ["id", "name", "conference", "conference_name"]


class LocalChurchSerializer(serializers.ModelSerializer):
    district_name = serializers.CharField(
        source="district.name", read_only=True
    )

    class Meta:
        model  = LocalChurch
        fields = ["id", "name", "district", "district_name"]


class SiteSettingsSerializer(serializers.ModelSerializer):
    days_until_start = serializers.SerializerMethodField()
    is_ongoing       = serializers.SerializerMethodField()
    is_over          = serializers.SerializerMethodField()

    class Meta:
        model   = SiteSettings
        # Don't expose the raw embed code — serve it via a separate endpoint
        exclude = ["google_maps_embed"]

    def get_days_until_start(self, obj):
        today = timezone.now().date()
        delta = obj.start_date - today
        return max(delta.days, 0)

    def get_is_ongoing(self, obj):
        today = timezone.now().date()
        return obj.start_date <= today <= obj.end_date

    def get_is_over(self, obj):
        today = timezone.now().date()
        return today > obj.end_date


class SiteSettingsMapSerializer(serializers.ModelSerializer):
    """Separate serializer just for the location page."""
    class Meta:
        model  = SiteSettings
        fields = ["google_maps_embed", "venue_name", "venue_address"]


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Announcement
        fields = ["id", "message", "created_at"]