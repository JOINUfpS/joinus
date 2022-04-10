from common_structure_microservices.authentication import CustomAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from asn_user.messages import CustomMessages
from common_structure_microservices.messages import Messages
from common_structure_microservices.responses import response
from common_structure_microservices.view import ModelViewSet
from user.cascade_destroy_thread import CascadeDestroyTaskUserThread
from user.cascade_update_thread import CascadeUpdateTaskUserThread
from user.models import UserModel
from user.serializer import UserSerializer, ValidateUserRegularSerializer, ValidateUserGoogleSerializer, \
    ChangePasswordSerializer, ForgotPasswordSerializer, CascadeUpdateUserInstitution


class UserView(ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['inst_id',
                        'user_name',
                        'user_email',
                        'user_phone',
                        'user_gender',
                        'role_active',
                        'user_status']

    ordering_fields = ['user_name']

    ordering = ['user_name']

    search_fields = ['user_name',
                     'user_email',
                     'user_phone',
                     'user_gender',
                     'user_degree']

    def update(self, request, *args, **kwargs):
        CascadeUpdateTaskUserThread(request, kwargs).start()
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        CascadeDestroyTaskUserThread(request, **kwargs).start()
        return super().destroy(request, *args, **kwargs)

    @action(methods=['post'], url_path="validate_user_regular", detail=False,
            serializer_class=ValidateUserRegularSerializer)
    def validate_user_regular(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        respond = serializer.validate_user_regular()
        return Response(response(data=respond, message=CustomMessages.LOGGED_IN_SUCCESSFULLY))

    @action(methods=['post'], url_path="validate_user_google", detail=False,
            serializer_class=ValidateUserGoogleSerializer)
    def validate_user_google(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        respond = serializer.validate_google_user()
        return Response(response(data=respond, message=CustomMessages.LOGGED_IN_SUCCESSFULLY))

    @action(methods=['put'], url_path="change_password", detail=False, serializer_class=ChangePasswordSerializer,
            authentication_classes=[CustomAuthentication])
    def change_password(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.change_password()
        return Response(response(message=CustomMessages.PASSWORD_CHANGE_SUCCESSFUL))

    @action(methods=['put'], url_path="forgot_password", detail=False, serializer_class=ForgotPasswordSerializer)
    def forgot_password(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        respond = serializer.forgot_password()
        return Response(response(data=respond, message=Messages.UPDATED_SUCCESSFULLY))

    @action(methods=['put'], detail=False, url_path="cascade_update_user_institution",
            serializer_class=CascadeUpdateUserInstitution)
    def cascade_update_user_institution(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.cascade_update_user_institution()
        return Response(response(message=Messages.UPDATED_SUCCESSFULLY))
