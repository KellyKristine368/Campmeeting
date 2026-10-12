from django.urls import path
from . import views

urlpatterns = [
    # Health check
    path("health/",           views.HealthCheckView.as_view(),      name="health-check"),

    # Site settings
    path("settings/",         views.SiteSettingsView.as_view(),     name="site-settings"),
    path("settings/map/",     views.SiteSettingsMapView.as_view(),  name="site-map"),

    # Announcements
    path("announcements/",    views.AnnouncementListView.as_view(), name="announcements"),

    # SDA Church Hierarchy
    path("conferences/",      views.ConferenceListView.as_view(),   name="conferences"),
    path("districts/",        views.DistrictListView.as_view(),     name="districts"),
    path("churches/",         views.LocalChurchListView.as_view(),  name="churches"),
]