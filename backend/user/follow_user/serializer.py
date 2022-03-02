import uuid

from django.db.models import Q
from rest_framework import serializers

from asn_user.messages import CustomMessages
from common_structure_microservices.notification import SendNotification
from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.type_notification import TypeNotification
from common_structure_microservices.utilities import Enums
from follow_user.models import FollowUserModel
from user.models import UserModel
from user.serializer import UserSerializer


class FollowUserSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    fous_is_bidirectional = serializers.BooleanField(default=False)
    user_degree = serializers.JSONField(required=False, allow_null=True, default={})
    fous_degree = serializers.JSONField(required=False, allow_null=True, default={})
    user_photo = serializers.UUIDField(required=False, allow_null=True)
    fous_photo = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = FollowUserModel
        fields = ('id',
                  'user_id',
                  'fous_user_id',
                  'fous_is_bidirectional',
                  'inst_id_user',
                  'inst_id_fous',
                  'name_user',
                  'name_fous',
                  'inst_name_user',
                  'inst_name_fous',
                  'user_email',
                  'fous_email',
                  'user_degree',
                  'fous_degree',
                  'user_photo',
                  'fous_photo',)

    def get_followed_users(self, inst_user_id, user_id):
        followed_users = self.__get_followed_users(inst_user_id, user_id)
        followers_users = self.__get_followers_users(inst_user_id, user_id)

        return {'followed_users': followed_users,
                'followers_users': followers_users, }

    def __get_followed_users(self, inst_user_id, user_id):
        instance_follow_user = FollowUserModel.objects.filter(Q(inst_id_user=inst_user_id, user_id=user_id) |
                                                              Q(inst_id_user=inst_user_id, fous_user_id=user_id,
                                                                fous_is_bidirectional=True))
        serializer_follow_user = FollowUserSerializer(instance_follow_user, many=True)
        return serializer_follow_user.data

    def __get_followers_users(self, inst_user_id, user_id):
        instance_follow_user = FollowUserModel.objects.filter(Q(inst_id_user=inst_user_id, fous_user_id=user_id) |
                                                              Q(inst_id_user=inst_user_id, user_id=user_id,
                                                                fous_is_bidirectional=True))
        serializer_follow_user = FollowUserSerializer(instance_follow_user, many=True)
        return serializer_follow_user.data

    def get_suggested_users(self, inst_id_user, user_id):
        instance_user = UserModel.objects.filter(inst_id=inst_id_user, user_status=Enums.ACTIVO).exclude(id=user_id)
        serializer_user = UserSerializer(instance_user, many=True)
        others_user = serializer_user.data

        instance_follow_user = FollowUserModel.objects.filter(
            Q(inst_id_user=inst_id_user, user_id=user_id) |
            Q(inst_id_user=inst_id_user, fous_user_id=user_id, fous_is_bidirectional=True)
        )
        serializer_follow_user = FollowUserSerializer(instance_follow_user, many=True)
        users_followed_by_me = serializer_follow_user.data
        suggested_users = list()
        for other_user in others_user:
            suggested = True
            for follow_user in users_followed_by_me:
                if (other_user['id'] == follow_user['fous_user_id']) or (
                        other_user['id'] == follow_user['user_id'] and follow_user['fous_is_bidirectional']):
                    suggested = False
                    break

            if suggested:
                suggested_users.append(other_user)

        return suggested_users

    def get_is_followed(self, inst_id, user_session, user_id):
        instance_follow_user = FollowUserModel.objects.filter(
            Q(inst_id_user=inst_id, user_id=user_session, fous_user_id=user_id) |
            Q(inst_id_user=inst_id, user_id=user_id, fous_user_id=user_session, fous_is_bidirectional=True)
        )
        serializer_follow_user = FollowUserSerializer(instance_follow_user, many=True)
        return serializer_follow_user.data

    def follow(self):
        user_id = self.validated_data.get('user_id', None)
        fous_user_id = self.validated_data.get('fous_user_id', None)

        instance_follow_user = FollowUserModel.objects.filter(
            Q(user_id=user_id, fous_user_id=fous_user_id) |
            Q(user_id=fous_user_id, fous_user_id=user_id)
        )
        serializer_follow_user = FollowUserSerializer(instance_follow_user, many=True)

        if serializer_follow_user.data.__len__() == 0:
            follow_user = self.validated_data
            super().create(follow_user)
            notification_body = {
                'noti_receiver_id': str(fous_user_id),
                'noti_path': 'perfil',
                'noti_type': TypeNotification.USER.value,
                'noti_issue': CustomMessages.USER_STARTED_FOLLOW % follow_user["name_user"],
                'noti_author_photo': str(follow_user["user_photo"]),
                'noti_author_name': follow_user["name_user"],
                'noti_author_id': str(user_id)
            }
        else:
            for instance in instance_follow_user:
                instance.fous_is_bidirectional = True
                instance.save()
                follow_user_noti = instance

            notification_body = {
                'noti_receiver_id': str(follow_user_noti.user_id),
                'noti_path': 'perfil',
                'noti_type': TypeNotification.USER.value,
                'noti_issue': CustomMessages.USER_STARTED_FOLLOW % follow_user_noti.name_fous,
                'noti_author_photo': str(
                    follow_user_noti.fous_photo) if follow_user_noti.fous_photo is not None else None,
                'noti_author_name': follow_user_noti.name_user,
                'noti_author_id': str(follow_user_noti.fous_user_id)
            }

            follow_user = serializer_follow_user.data[0]

        send_notification = SendNotification()
        send_notification.task_send_notification(request=self.context['request'], notification_body=notification_body)

        return follow_user

    def unfollow(self, user_session):
        user_id = self.validated_data.get('user_id', None)
        fous_user_id = self.validated_data.get('fous_user_id', None)
        try:
            follow_user_model = FollowUserModel.objects.get(user_id=user_id, fous_user_id=fous_user_id)
            follow_user_serializer = FollowUserSerializer(follow_user_model)
            follow_user_data = follow_user_serializer.data
            if follow_user_data['user_id'] == user_session:
                name_user_unfollow = follow_user_data['name_fous']
            else:
                name_user_unfollow = follow_user_data['name_user']
            if not follow_user_data['fous_is_bidirectional']:
                follow_user_model.delete()
            else:
                kwargs = {}
                if follow_user_data['user_id'] == user_session:
                    kwargs = self.__exchange_data(follow_user_data)
                elif follow_user_data['fous_user_id'] == user_session:
                    kwargs = {'fous_is_bidirectional': False}

                follow_user = FollowUserSerializer(follow_user_model, data=kwargs, partial=True)
                follow_user.is_valid(raise_exception=True)
                follow_user.save()
            return CustomMessages.USER_STOPPED_FOLLOWING % name_user_unfollow

        except FollowUserModel.DoesNotExist:
            return []

    def __exchange_data(self, follow_user_data):

        kwargs = {
            'user_id': follow_user_data['fous_user_id'],
            'fous_user_id': follow_user_data['user_id'],
            'fous_is_bidirectional': False,
            'inst_id_user': follow_user_data['inst_id_fous'],
            'inst_id_fous': follow_user_data['inst_id_user'],
            'name_user': follow_user_data['name_fous'],
            'name_fous': follow_user_data['name_user'],
            'inst_name_user': follow_user_data['inst_name_fous'],
            'inst_name_fous': follow_user_data['inst_name_user'],
            'user_email': follow_user_data['fous_email'],
            'fous_email': follow_user_data['user_email'],
            'user_degree': follow_user_data['fous_degree'],
            'fous_degree': follow_user_data['user_degree'],
            'user_photo': follow_user_data['fous_photo'],
            'fous_photo': follow_user_data['user_photo']
        }

        return kwargs
