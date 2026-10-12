from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import uuid

User = get_user_model()


# ------------------------------------------------------------------
# JWT — add extra user info into the token payload
# so React knows who is logged in without a separate API call
# ------------------------------------------------------------------
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"]        = user.email
        token["full_name"]    = user.get_full_name()
        token["is_staff"]     = user.is_staff
        token["is_organiser"] = user.is_organiser
        token["is_verified"]  = user.is_verified
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add user info alongside the tokens in the response
        data["user"] = {
            "id":           self.user.id,
            "email":        self.user.email,
            "full_name":    self.user.get_full_name(),
            "is_staff":     self.user.is_staff,
            "is_organiser": self.user.is_organiser,
            "is_verified":  self.user.is_verified,
        }
        return data


# ------------------------------------------------------------------
# Register
# ------------------------------------------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(
        write_only=True,
        label="Confirm password"
    )

    class Meta:
        model  = User
        fields = [
            "first_name", "last_name",
            "email", "phone_number",
            "password", "password2"
        ]
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name":  {"required": True},
        }

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError(
                {"password": "Passwords do not match."}
            )
        return data

    def create(self, validated_data):
        validated_data.pop("password2")

        # Create user — not verified yet
        user = User.objects.create_user(
            email        = validated_data["email"],
            password     = validated_data["password"],
            first_name   = validated_data["first_name"],
            last_name    = validated_data["last_name"],
            phone_number = validated_data.get("phone_number", ""),
            is_verified  = False,
        )

        # Send verification email
        self._send_verification_email(user)
        return user

    def _send_verification_email(self, user):
        verification_link = (
            f"{settings.FRONTEND_URL}/verify-email?token={user.verification_token}"
        )
        send_mail(
            subject="✅ Verify Your Email — Campmeeting",
            message=(
                f"Hi {user.first_name},\n\n"
                f"Thank you for registering! Please verify your email by clicking the link below:\n\n"
                f"{verification_link}\n\n"
                f"This link will remain valid. If you did not create an account, ignore this email.\n\n"
                f"God bless you,\n"
                f"The Campmeeting Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )


# ------------------------------------------------------------------
# Email Verification
# ------------------------------------------------------------------
class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.UUIDField()

    def validate_token(self, value):
        try:
            self.user = User.objects.get(verification_token=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired verification token.")

        if self.user.is_verified:
            raise serializers.ValidationError("This account is already verified.")

        return value

    def save(self):
        self.user.is_verified        = True
        self.user.verification_token = None   # invalidate token after use
        self.user.save(update_fields=["is_verified", "verification_token"])
        return self.user


# ------------------------------------------------------------------
# User Profile
# ------------------------------------------------------------------
class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model  = User
        fields = [
            "id", "email", "first_name", "last_name",
            "full_name", "phone_number", "is_verified",
            "is_organiser", "date_joined",
        ]
        read_only_fields = ["email", "is_verified", "is_organiser", "date_joined"]


# ------------------------------------------------------------------
# Change Password
# ------------------------------------------------------------------
class ChangePasswordSerializer(serializers.Serializer):
    old_password  = serializers.CharField(write_only=True)
    new_password  = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )
    new_password2 = serializers.CharField(
        write_only=True,
        label="Confirm new password"
    )

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate(self, data):
        if data["new_password"] != data["new_password2"]:
            raise serializers.ValidationError(
                {"new_password": "Passwords do not match."}
            )
        return data

    def save(self):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user