from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from common_structure_microservices.messages import Messages
from common_structure_microservices.responses import response
from common_structure_microservices.view import ModelViewSet
from community_user.models import CommunityUserModel
from community_user.serializer import CommunityUserSerializer


class CommunityUserView(ModelViewSet):
    queryset = CommunityUserModel.objects.all()
    lookup_field = 'id'
    serializer_class = CommunityUserSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['comm_id',
                        'user_id',
                        'comm_owner_id',
                        'inst_id',
                        'cous_admin',
                        'comm_name',
                        'comm_category_name',
                        ]

    ordering_fields = ['comm_name']

    ordering = ['comm_name']

    search_fields = ['comm_id',
                     'user_id',
                     'comm_owner_id',
                     'inst_id',
                     'cous_admin',
                     'comm_name',
                     'comm_category_name',
                     ]

    @action(methods=['get'], detail=False, url_path="info_community_user/(?P<comm_id>[^/.]+)/(?P<user_id>[^/.]+)",
            pagination_class=None, filter_backends=[])
    def get_info_community_user(self, request, comm_id, user_id, *args, **kwargs):
        serializer = self.get_serializer().get_community_user(comm_id=comm_id, user_id=user_id)
        return Response(response(data=serializer))

    @action(methods=['delete'], detail=False, url_path="information/(?P<comm_id>[^/.]+)/(?P<user_id>[^/.]+)",
            pagination_class=None, filter_backends=[])
    def delete_info_community_user(self, request, comm_id, user_id, *args, **kwargs):
        self.get_serializer().delete_info_community_user(comm_id=comm_id, user_id=user_id)
        return Response(response(message=Messages.DELETED_SUCCESSFULLY), status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False, url_path="members_and_no_members/(?P<inst_id>[^/.]+)/(?P<comm_id>[^/.]+)",
            pagination_class=None, filter_backends=[])
    def get_members_and_no_members(self, request, inst_id, comm_id, *args, **kwargs):
        serializer = self.get_serializer().get_members_and_no_members(inst_id=inst_id, comm_id=comm_id)
        return Response(response(data=serializer))

    @action(methods=['patch'], url_path="approve_union/(?P<id>[^/.]+)", detail=False)
    def approve_union(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        serializer.approve_union(community_user=instance, kwargs=request.data)
        return Response(response(message=Messages.SUCCESSFUL_APPROVAL))
