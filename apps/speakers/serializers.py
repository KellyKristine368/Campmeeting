from rest_framework import serializers
from apps.speakers.models import Speaker

class SpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speaker
        fields = [
            'id', 'title', 'name', 'ministry', 'bio', 
            'profile_picture', 'facebook_url', 'twitter_url', 
            'instagram_url', 'order'
        ]