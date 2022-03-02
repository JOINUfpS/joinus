from common_structure_microservices.responses import response
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from asn_security.messages import CustomMessages
from security.serializer import SecuritySerializer, LoginSerializer, ForgotPasswordSerializer, \
    ConfirmForgotPasswordSerializer, LogoutSerializer, TokenSerializer


class SecurityViewSet(viewsets.GenericViewSet):
    serializer_class = SecuritySerializer
    view_class = GenericViewSet()

    @action(methods=['post'], url_path="login", detail=False, serializer_class=LoginSerializer)
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message, respond = serializer.login(request=request)
        return Response(response(data=respond, message=message))

    @action(methods=['post'], url_path="forgot_password", detail=False, serializer_class=ForgotPasswordSerializer)
    def forgot_password(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        respond = serializer.forgot_password()
        return Response(response(data=respond, message=CustomMessages.FORGOT_PASSWORD_CODE))

    @action(methods=['post'], url_path="confirm-forgot-password", detail=False,
            serializer_class=ConfirmForgotPasswordSerializer)
    def confirm_forgot_password(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.confirm_forgot_password()
        return Response(response(message=CustomMessages.PASSWORD_UPDATED))

    @action(methods=['post'], url_path="logout", detail=False,
            serializer_class=LogoutSerializer)
    def logout(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.logout(request=request)
        return Response(response(message=CustomMessages.LOG_OUT_SUCCESSFULLY))

    @action(methods=['post'], url_path="refresh_token", detail=False,
            serializer_class=TokenSerializer)
    def refresh_token(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        respond = serializer.refresh_token(request=request)
        return Response(response(message=CustomMessages.REFRESH_TOKEN_SUCCESSFULLY, data=respond))

    @action(methods=['post'], url_path="user-from-token", detail=False, serializer_class=TokenSerializer)
    def user_from_token(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data, status = serializer.user_from_token()
        return Response(response(data=data, status=status))
