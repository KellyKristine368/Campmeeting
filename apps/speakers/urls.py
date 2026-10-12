from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.speakers.views import SpeakerViewSet

# Using DRF's DefaultRouter automatically handles trailing slashes for clean React API calls
router = DefaultRouter()
router.register(r'', SpeakerViewSet, basename='speaker')

urlpatterns = [
    path('', include(router.urls)),
]