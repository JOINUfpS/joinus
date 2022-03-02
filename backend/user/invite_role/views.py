from common_structure_microservices.messages import Messages
from common_structure_microservices.responses import response
from common_structure_microservices.view import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from asn_user.messages import CustomMessages
from invite_role.models import InviteRoleModel
from invite_role.serializer import InviteRoleSerializer


class InviteRoleView(ModelViewSet):
    queryset = InviteRoleModel.objects.all()
    serializer_class = InviteRoleSerializer
    lookup_field = 'id'
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['inst_id',
                        'user_id',
                        'role_id',
                        'inro_status',
                        'user_name',
                        'role_name',
                        'inro_type']

    ordering_fields = ['role_name']

    ordering = ['role_name']

    search_fields = ['user_id',
                     'role_id',
                     'inro_status', ]

    @action(methods=['post'], url_path="request_role", detail=False, serializer_class=InviteRoleSerializer)
    def request_role(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.request_role(serializer.data)
        return Response(response(message=CustomMessages.INVITATION_EMAIL_SENT))

    @action(methods=['post'], url_path="invite_take_role", detail=False, serializer_class=InviteRoleSerializer)
    def invite_take_role(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        respond = serializer.invite_take_role(serializer.data)
        return Response(response(message=respond))

    @action(methods=['patch'], url_path="authorize_role/(?P<id>[^/.]+)", detail=False,
            serializer_class=InviteRoleSerializer)
    def authorize_role(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        serializer.authorize_role(invite_role=serializer)
        return Response(response(message=Messages.UPDATED_SUCCESSFULLY))
