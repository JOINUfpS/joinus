from common_structure_microservices.responses import response
from common_structure_microservices.view import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from follow_user.models import FollowUserModel
from follow_user.serializer import FollowUserSerializer


class FollowUserView(ModelViewSet):
    queryset = FollowUserModel.objects.all()
    serializer_class = FollowUserSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['user_id',
                        'fous_user_id',
                        'fous_is_bidirectional',
                        'inst_id_user',
                        'inst_name_user',
                        'inst_id_fous',
                        'inst_name_fous',
                        'name_user',
                        'name_fous', ]

    ordering_fields = ['user_id']

    ordering = ['user_id']

    search_fields = ['user_id',
                     'fous_user_id',
                     'fous_is_bidirectional',
                     'inst_id_user',
                     'inst_name_user',
                     'inst_id_fous',
                     'inst_name_fous',
                     'name_user',
                     'name_fous', ]

    @action(methods=['get'], detail=False,
            url_path="suggested_users/(?P<inst_id_user>[^/.]+)/(?P<user_id>[^/.]+)",
            pagination_class=None, filter_backends=[])
    def get_suggested_users(self, request, inst_id_user, user_id, *args, **kwargs):
        serializer = self.get_serializer().get_suggested_users(inst_id_user=inst_id_user, user_id=user_id)
        return Response(response(data=serializer))

    @action(methods=['get'], detail=False,
            url_path="followed_users/(?P<inst_user_id>[^/.]+)/(?P<user_id>[^/.]+)",
            pagination_class=None, filter_backends=[], serializer_class=FollowUserSerializer)
    def get_followed_users(self, request, inst_user_id, user_id, *args, **kwargs):
        serializer = self.get_serializer().get_followed_users(inst_user_id=inst_user_id, user_id=user_id)
        return Response(response(data=serializer))

    @action(methods=['get'], detail=False,
            url_path="is_followed/(?P<inst_id>[^/.]+)/(?P<user_session>[^/.]+)/(?P<user_id>[^/.]+)",
            pagination_class=None, filter_backends=[], serializer_class=FollowUserSerializer)
    def get_is_followed(self, request, inst_id, user_session, user_id, *args, **kwargs):
        serializer = self.get_serializer().get_is_followed(inst_id=inst_id, user_session=user_session, user_id=user_id)
        return Response(response(data=serializer))

    @action(methods=['post'], url_path="follow", detail=False)
    def follow_user(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(data=serializer.follow()))

    @action(methods=['post'], url_path="unfollow/(?P<user_session>[^/.]+)", detail=False)
    def unfollow_user(self, request, user_session, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(message=serializer.unfollow(user_session)))
