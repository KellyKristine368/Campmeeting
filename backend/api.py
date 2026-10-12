from rest_framework.routers import DefaultRouter

from apps.speakers.views import SpeakerViewSet
from apps.schedule.views import SessionViewSet
from apps.registration.views import RegistrationViewSet
from apps.accommodation.views import RoomViewSet, RoomAllocationViewSet
# Import our 3 new views
from apps.payments.views import PaymentViewSet
from apps.livestream.views import LiveStreamViewSet
from apps.contact.views import ContactMessageViewSet

router = DefaultRouter()

router.register(r'speakers', SpeakerViewSet, basename='speaker')
router.register(r'schedule', SessionViewSet, basename='session')
router.register(r'registrations', RegistrationViewSet, basename='registration')
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'room-allocations', RoomAllocationViewSet, basename='room-allocation')
# Register endpoints
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'livestream', LiveStreamViewSet, basename='livestream')
router.register(r'contact', ContactMessageViewSet, basename='contact')

api_urlpatterns = router.urls