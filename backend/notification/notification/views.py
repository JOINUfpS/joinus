from common_structure_microservices.messages import Messages
from common_structure_microservices.responses import response
from common_structure_microservices.view import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from notification.models import NotificationModel
from notification.serializer import NotificationSerializer, NotificationCommunityInvitation, \
    NotificationNewPublicationCommunity, NotificationToDelete, CascadeUpdateTaskUser, CascadeDeleteTaskUserSerializer


class NotificationView(ModelViewSet):
    queryset = NotificationModel.objects.all()
    serializer_class = NotificationSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['noti_receiver_id',
                        'noti_author_id',
                        'noti_type',
                        'noti_author_name']

    ordering_fields = ['noti_date']

    ordering = ['noti_date']

    search_fields = ['noti_type',
                     'noti_author_name']

    def create(self, request, *args, **kwargs):
        response_create = super().create(request, *args, **kwargs)
        notification_serializer = NotificationSerializer()
        notification_serializer.send_notify(noti_receiver_id=request.data['noti_receiver_id'])
        # NotificationSerializer.join_group_user_to_room(request.data['comm_id'], request.data['comm_owner_id'])
        return response_create

    @action(methods=['post'], url_path="notify_community_invitation", detail=False,
            serializer_class=NotificationCommunityInvitation)
    def notify_community_invitation(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(message=serializer.notify_community_invitation()))

    @action(methods=['post'], url_path="notify_new_publication_community", detail=False,
            serializer_class=NotificationNewPublicationCommunity)
    def notify_new_publication_community(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(message=serializer.notify_new_publication_community()))

    @action(methods=['post'], detail=False,
            url_path="join_group_user_to_room/(?P<room_name>[^/.]+)/(?P<group_user_name>[^/.]+)")
    def join_group_user_to_room(self, room_name, group_user_name):
        serializer = self.get_serializer()
        return Response(
            response(message=serializer.join_group_user_to_room(room_name=room_name, group_user_name=group_user_name)))

    @action(methods=['post'], url_path="delete_invitation_community", detail=False,
            serializer_class=NotificationToDelete)
    def delete_invitation_community(self, request):
        serializer = self.get_serializer().delete_invitation_community(request=request)
        return Response(response(message=serializer))

    @action(methods=['put'], url_path="cascade_update_user", detail=False, serializer_class=CascadeUpdateTaskUser)
    def cascade_update_user(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.cascade_update_user()
        return Response(response(message=Messages.UPDATED_SUCCESSFULLY))

    @action(methods=['put'], url_path="cascade_delete_user/(?P<user_id>[^/.]+)", detail=False,
            serializer_class=CascadeDeleteTaskUserSerializer)
    def cascade_delete_user(self, request, user_id, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.cascade_delete_user(user_id=user_id)
        return Response(response(message=Messages.DELETED_SUCCESSFULLY))
