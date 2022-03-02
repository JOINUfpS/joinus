from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from asn_user.messages import CustomMessages
from common_structure_microservices.messages import Messages
from common_structure_microservices.responses import response
from common_structure_microservices.view import RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin, \
    ListModelMixin, GenericViewSet
from community.cascade_delete import CascadeDeleteTaskCommunity
from community.cascade_update import CascadeUpdateTaskCommunity
from community.models import CommunityModel
from community.serializer import CommunitySerializer, CascadeUpdateCategoryCommunity


class CommunityView(RetrieveModelMixin,
                    UpdateModelMixin,
                    DestroyModelMixin,
                    ListModelMixin,
                    GenericViewSet):
    queryset = CommunityModel.objects.all()
    serializer_class = CommunitySerializer
    cascade_update = CascadeUpdateTaskCommunity()
    cascade_delete = CascadeDeleteTaskCommunity()
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['comm_name',
                        'comm_category',
                        'comm_category_name',
                        'inst_id',
                        'comm_owner_id']

    ordering_fields = ['comm_name']

    ordering = ['comm_name']

    search_fields = ['comm_name',
                     'comm_category_name']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if 'community_user' not in request.data or request.data['community_user'] == {}:
            raise ValidationError(detail=CustomMessages.COMMUNITY_USER_FIELD_REQUIRED, code=status.HTTP_400_BAD_REQUEST)

        self.get_serializer().create(validated_data=request.data)

        return Response(response(data=serializer.data, message=Messages.CREATED_SUCCESSFULLY),
                        status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        self.cascade_update.cascade_action(request=request)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self.cascade_delete.cascade_action(comm_id=kwargs.get('pk'))
        return super().destroy(request, *args, **kwargs)

    @action(methods=['get'], detail=False, url_path="communities_categories/(?P<inst_id>[^/.]+)/(?P<user_id>[^/.]+)",
            pagination_class=None, filter_backends=[])
    def get_communities_by_categories(self, request, inst_id, user_id, *args, **kwargs):
        serializer = self.get_serializer().get_communities_by_categories(inst_id=inst_id, user_id=user_id)
        return Response(response(data=serializer))

    @action(methods=['put'], detail=False, url_path="cascade_update_category_community",
            serializer_class=CascadeUpdateCategoryCommunity)
    def cascade_update_category_community(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.cascade_update_category_community()
        return Response(response(message=Messages.UPDATED_SUCCESSFULLY))
