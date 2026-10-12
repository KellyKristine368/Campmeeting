from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.schedule.views import SessionViewSet

router = DefaultRouter()
router.register(r'', SessionViewSet, basename='session')

urlpatterns = [
    path('', include(router.urls)),
]