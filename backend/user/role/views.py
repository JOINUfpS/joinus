from django.core.exceptions import MultipleObjectsReturned
from django.http import Http404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from asn_user.messages import CustomMessages
from common_structure_microservices.exception import GenericMicroserviceError
from common_structure_microservices.messages import Messages
from common_structure_microservices.responses import response
from common_structure_microservices.view import ModelViewSet
from role.cascade_task import CascadeUpdateTaskRole
from role.models import RoleModel
from role.serializer import RoleSerializer
from user.serializer import UserSerializer


class RoleView(ModelViewSet):
    queryset = RoleModel.objects.all()
    serializer_class = RoleSerializer
    cascade_update = CascadeUpdateTaskRole()
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['role_name',
                        'role_status', ]

    ordering_fields = ['role_name']

    ordering = ['role_name']

    search_fields = ['role_name',
                     'role_status', ]

    def update(self, request, *args, **kwargs):
        self.cascade_update.do_cascade_update(request=request)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            user = UserSerializer()
            users = user.get_user_roles(inst_id=instance.inst_id, role_id=instance.id)
            if len(users) > 0:
                raise GenericMicroserviceError(status=status.HTTP_400_BAD_REQUEST, detail=CustomMessages.ROLE_HAS_USERS)
            self.cascade_update.cascade_action_delete(role=instance)
        except RoleModel.DoesNotExist:
            raise Http404('No %s matches the given query.' % self.get_queryset().model._meta.object_name)
        except MultipleObjectsReturned:
            raise GenericMicroserviceError(status=status.HTTP_409_CONFLICT, detail=Messages.MULTIPLE_OBJECTS_RETURNED)
        self.perform_destroy(instance)
        return Response(response(message=Messages.DELETED_SUCCESSFULLY), status=status.HTTP_200_OK)
