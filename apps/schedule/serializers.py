from rest_framework import serializers
from apps.schedule.models import Session
from apps.speakers.serializers import SpeakerSerializer

class SessionSerializer(serializers.ModelSerializer):
    # This nests the speaker object inside the session JSON response
    speaker = SpeakerSerializer(read_only=True)
    
    # Human-friendly date/time strings formatted perfectly for React UI display
    formatted_date = serializers.DateTimeField(format="%A, %B %d", source='start_time', read_only=True)
    formatted_start = serializers.DateTimeField(format="%I:%M %p", source='start_time', read_only=True)
    formatted_end = serializers.DateTimeField(format="%I:%M %p", source='end_time', read_only=True)

    class Meta:
        model = Session
        fields = [
            'id', 'title', 'slug', 'session_type', 'description', 
            'speaker', 'start_time', 'end_time', 'location',
            'formatted_date', 'formatted_start', 'formatted_end'
        ]