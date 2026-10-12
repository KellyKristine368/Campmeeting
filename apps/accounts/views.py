from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    VerifyEmailSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    Creates account and sends verification email.
    Does NOT issue tokens yet — user must verify email first.
    """
    queryset           = User.objects.all()
    serializer_class   = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "success": True,
                "message": (
                    "Account created successfully. "
                    "Please check your email to verify your account."
                ),
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    """
    POST /api/auth/verify-email/
    Receives the UUID token from the email link and marks user as verified.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Issue tokens now that email is verified — user is logged in
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "success": True,
                "message": "Email verified successfully. You are now logged in.",
                "tokens": {
                    "access":  str(refresh.access_token),
                    "refresh": str(refresh),
                },
                "user": {
                    "id":           user.id,
                    "email":        user.email,
                    "full_name":    user.get_full_name(),
                    "is_verified":  user.is_verified,
                    "is_organiser": user.is_organiser,
                },
            }
        )


class LoginView(TokenObtainPairView):
    """
    POST /api/auth/login/
    Returns access + refresh tokens with user info.
    Blocks login if email is not verified.
    """
    serializer_class   = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # Check verification before issuing tokens
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
            if not user.is_verified:
                return Response(
                    {
                        "success": False,
                        "message": (
                            "Please verify your email before logging in. "
                            "Check your inbox for the verification link."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
        except User.DoesNotExist:
            pass  # Let the serializer handle the invalid credentials error

        return super().post(request, *args, **kwargs)


class ResendVerificationEmailView(APIView):
    """
    POST /api/auth/resend-verification/
    Triggers a new verification email for an unverified user account.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"success": False, "message": "Email field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            user = User.objects.get(email=email)
            if user.is_verified:
                return Response(
                    {"success": False, "message": "This email account is already verified."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # --- Triggering Pipeline ---
            # Call your email logic here (e.g., generating token and sending the email)
            # Example: user.send_verification_email() 
            
            return Response(
                {"success": True, "message": "A new verification link has been sent to your inbox."},
                status=status.HTTP_200_OK
            )
            
        except User.DoesNotExist:
            # For security, return a 200 status so users can't scan for valid emails
            return Response(
                {"success": True, "message": "If an account exists with that email, a verification link has been sent."},
                status=status.HTTP_200_OK
            )


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Blacklists the refresh token to securely destroy the session.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"success": False, "message": "Refresh token is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            token = RefreshToken(refresh_token)
            token.blacklist()  # Destroys token inside token_blacklist app
            
            return Response(
                {"success": True, "message": "Logged out successfully."},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception:
            return Response(
                {"success": False, "message": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class ProfileView(generics.RetrieveUpdateAPIView):
    """
    GET /api/auth/profile/     -> Retrieves logged-in user profile details
    PUT/PATCH /api/auth/profile/ -> Updates profile details
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Always return the currently logged-in user object
        return self.request.user


class ChangePasswordView(APIView):
    """
    POST /api/auth/change-password/
    Allows logged-in users to update their password securely.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        # Set the new password securely
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response(
            {"success": True, "message": "Password updated successfully."},
            status=status.HTTP_200_OK
        )