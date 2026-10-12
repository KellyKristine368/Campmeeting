from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import (
    SiteSettings, Conference,
    District, LocalChurch, Announcement
)
from .serializers import (
    SiteSettingsSerializer, SiteSettingsMapSerializer,
    ConferenceSerializer, DistrictSerializer,
    LocalChurchSerializer, AnnouncementSerializer,
)


class HealthCheckView(APIView):
    """GET /api/core/health/ — confirms the API is running."""
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok", "message": "API is running."})


class SiteSettingsView(APIView):
    """GET /api/core/settings/ — returns global campmeeting info."""
    permission_classes = [AllowAny]

    def get(self, request):
        obj = SiteSettings.objects.first()
        if not obj:
            return Response(
                {"detail": "Site not configured yet."},
                status=404
            )
        return Response(SiteSettingsSerializer(obj).data)


class SiteSettingsMapView(APIView):
    """GET /api/core/settings/map/ — returns map embed for location page."""
    permission_classes = [AllowAny]

    def get(self, request):
        obj = SiteSettings.objects.first()
        if not obj:
            return Response(
                {"detail": "Site not configured yet."},
                status=404
            )
        return Response(SiteSettingsMapSerializer(obj).data)


class AnnouncementListView(APIView):
    """GET /api/core/announcements/ — returns active announcements."""
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Announcement.objects.filter(is_active=True)
        return Response(AnnouncementSerializer(qs, many=True).data)


# ------------------------------------------------------------------
# SDA Church Hierarchy — powers cascading dropdowns
# on the registration form in React
# ------------------------------------------------------------------
class ConferenceListView(APIView):
    """GET /api/core/conferences/ — all conferences."""
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Conference.objects.all()
        return Response(ConferenceSerializer(qs, many=True).data)


class DistrictListView(APIView):
    """
    GET /api/core/districts/                   — all districts
    GET /api/core/districts/?conference=<id>   — filter by conference
    """
    permission_classes = [AllowAny]

    def get(self, request):
        qs = District.objects.select_related("conference").all()
        conference_id = request.query_params.get("conference")
        if conference_id:
            qs = qs.filter(conference_id=conference_id)
        return Response(DistrictSerializer(qs, many=True).data)


class LocalChurchListView(APIView):
    """
    GET /api/core/churches/                 — all churches
    GET /api/core/churches/?district=<id>  — filter by district
    """
    permission_classes = [AllowAny]

    def get(self, request):
        qs = LocalChurch.objects.select_related("district").all()
        district_id = request.query_params.get("district")
        if district_id:
            qs = qs.filter(district_id=district_id)
        return Response(LocalChurchSerializer(qs, many=True).data)