import uuid
from datetime import datetime

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.type_notification import TypeNotification
from common_structure_microservices.utilities import Constants, FrontendUrl
from rest_framework import serializers

from asn_notification.messages import CustomMessages
from notification.models import NotificationModel


class NotificationSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    noti_is_read = serializers.BooleanField(required=False, default=False)
    noti_date = serializers.DateTimeField(required=False, default=datetime.now, allow_null=True,
                                          format=Constants.FORMAT_DATE_TIME_12,
                                          input_formats=(Constants.FORMAT_DATE_TIME_12,
                                                         Constants.FORMAT_DATE_TIME_TIMEZONE_EN,))
    noti_destination_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    noti_author_name = serializers.CharField(allow_blank=True)
    noti_author_photo = serializers.UUIDField(required=False, allow_null=True)
    noti_author_email = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = NotificationModel
        fields = ('id',
                  'noti_is_read',
                  'noti_date',
                  'noti_receiver_id',
                  'noti_path',
                  'noti_type',
                  'noti_author_id',
                  'noti_author_name',
                  'noti_author_photo',
                  'noti_author_email',
                  'noti_issue',
                  'noti_destination_name',)

    def send_notify(self, noti_receiver_id):
        channel_layer = get_channel_layer()
        group_name = '{}'.format(noti_receiver_id)
        async_to_sync(channel_layer.group_send)(
            group_name, {
                'type': 'new_notification',
                'message': 'new notification'
            }
        )


class NotificationCommunityInvitation(serializers.Serializer):
    noti_author_name = serializers.CharField(required=True)
    noti_community = serializers.JSONField(required=True)
    noti_inviteds = serializers.ListField(required=True, child=serializers.JSONField())

    def notify_community_invitation(self):
        community = self.validated_data['noti_community']
        users_to_invite = self.validated_data['noti_inviteds']
        notification_serializer = NotificationSerializer()
        for user_to_invite in users_to_invite:
            self.__save_notification_community_invitation(community, user_to_invite['id'])
            notification_serializer.send_notify(user_to_invite['id'])
        return CustomMessages.INVITATIONS_BEEN_SENT

    def __save_notification_community_invitation(self, community, id_user_to_invite):
        notification_model = NotificationModel(
            noti_is_read=False,
            noti_date=datetime.now(),
            noti_receiver_id=id_user_to_invite,
            noti_path=FrontendUrl.URL_BASE_COMMUNITY,
            noti_type=TypeNotification.INVITATION_COMMUNITY.value,
            noti_author_id=community['id'],
            noti_author_name=self.validated_data['noti_author_name'],
            noti_author_photo=community['photo'],
            noti_issue=CustomMessages.ISSUE_INVITATION_COMMUNITY % (
                self.validated_data['noti_author_name']),
            noti_destination_name=community['name']
        )
        notification_model.save()


class NotificationNewPublicationCommunity(serializers.Serializer):
    noti_members = serializers.ListField(required=True, child=serializers.UUIDField())
    noti_author_id = serializers.UUIDField(required=True)
    noti_author_name = serializers.CharField(required=True)
    noti_author_photo = serializers.UUIDField(required=True, allow_null=True)
    noti_comm_id = serializers.UUIDField(required=True)
    noti_comm_name = serializers.CharField(required=True)

    def notify_new_publication_community(self):
        noti_members = self.validated_data['noti_members']
        for member_id in noti_members:
            self.__save_notification_new_publication_community(noti_receiver_id=member_id, data=self.validated_data)

    def __save_notification_new_publication_community(self, noti_receiver_id, data):
        notification_model = NotificationModel(
            noti_is_read=False,
            noti_date=datetime.now(),
            noti_receiver_id=noti_receiver_id,
            noti_path=FrontendUrl.URL_BASE_COMMUNITY,
            noti_type=TypeNotification.PUBLICATION.value,
            noti_author_id=data['noti_author_id'],
            noti_author_name=self.data['noti_author_name'],
            noti_author_photo=data['noti_author_photo'],
            noti_issue=CustomMessages.ISSUE_PUBLICACION_COMMUNITY % self.data['noti_author_name'] % data[
                'noti_comm_name'],
            noti_destination_name=data['noti_comm_name']
        )
        notification_model.save()


class NotificationToDelete(serializers.Serializer):
    noti_receiver_id = serializers.UUIDField(required=True)
    noti_author_id = serializers.UUIDField(required=True)
    noti_author_name = serializers.CharField(required=False)

    def delete_invitation_community(self, request):
        instance_notification = NotificationModel.objects.filter(noti_receiver_id=request.data['noti_receiver_id'],
                                                                 noti_author_id=request.data['noti_author_id'], )
        for notification in instance_notification:
            notification.delete()
        return CustomMessages.DELETE_NOTIFICATION


class CascadeUpdateTaskUser(serializers.Serializer):
    user_id = serializers.UUIDField(required=True)
    user_name = serializers.CharField(required=True)
    user_photo = serializers.UUIDField(required=True, allow_null=True)

    def cascade_update_user(self):
        user_id = self.validated_data.get('user_id')
        user_name = self.validated_data.get('user_name')
        user_photo = self.validated_data.get('user_photo')

        NotificationModel.objects.filter(noti_author_id=user_id).update(noti_author_name=user_name,
                                                                        noti_author_photo=user_photo)


class CascadeDeleteTaskUserSerializer(serializers.Serializer):

    def cascade_delete_user(self, user_id):
        NotificationModel.objects.filter(noti_author_id=user_id).delete()
        NotificationModel.objects.filter(noti_receiver_id=user_id).delete()
