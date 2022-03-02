import uuid

from rest_framework import serializers

from asn_user.messages import CustomMessages
from common_structure_microservices.delete_notification import DeleteNotification
from common_structure_microservices.notification import SendNotification
from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.type_notification import TypeNotification
from common_structure_microservices.utilities import Enums
from community_user.models import CommunityUserModel
from user.models import UserModel
from user.serializer import UserSerializer


class CommunityUserSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    cous_admin = serializers.BooleanField(default=False)
    cous_pending_approval = serializers.BooleanField(default=True)
    user_photo = serializers.UUIDField(required=False, allow_null=True)
    user_phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    comm_photo = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = CommunityUserModel
        fields = ('id',
                  'comm_id',
                  'comm_owner_id',
                  'comm_photo',
                  'user_id',
                  'cous_pending_approval',
                  'cous_admin',
                  'comm_name',
                  'comm_category_name',
                  'user_name',
                  'user_email',
                  'user_phone',
                  'user_photo',
                  'inst_id',
                  'inst_name',)

    def create(self, request, *args, **kwargs):
        community_user = super().create(request)
        self.notify(community_user=community_user, request_union_approved=False)
        return community_user

    def approve_union(self, community_user, kwargs):
        instance = CommunityUserModel.objects.get(id=community_user.id)
        community_user = CommunityUserSerializer(instance, data=kwargs, partial=True)
        community_user.is_valid(raise_exception=True)
        community_user.save()
        self.notify(community_user=instance, request_union_approved=True)

    def notify(self, community_user, request_union_approved):
        notification_do_delete = {
            'noti_receiver_id': str(community_user.user_id),
            'noti_author_id': str(community_user.comm_id),
        }
        if request_union_approved:
            noti_receiver_id = str(community_user.user_id)
            noti_author_name = ''
            noti_author_photo = str(community_user.comm_photo) if community_user.comm_photo is not None else None
            noti_type = TypeNotification.COMMUNITY.value
            noti_issue = CustomMessages.HAS_APPROVED_YOUR_REQUEST_COMMUNITY % str(community_user.comm_name)
            notification_do_delete.update({'noti_receiver_id': str(community_user.comm_owner_id)})
        elif community_user.cous_pending_approval:
            noti_receiver_id = str(community_user.comm_owner_id)
            noti_author_name = str(community_user.user_name)
            noti_issue = CustomMessages.REQUEST_TO_JOIN_THE_COMMUNITY.format(noti_author_name, community_user.comm_name)
            noti_type = TypeNotification.REQUEST_COMMUNITY.value
            noti_author_photo = str(community_user.user_photo)
        else:
            noti_receiver_id = str(community_user.comm_owner_id)
            noti_author_name = str(community_user.user_name)
            noti_issue = CustomMessages.HAS_JOINED_YOUR_COMMUNITY % (noti_author_name, str(community_user.comm_name))
            noti_type = TypeNotification.COMMUNITY.value
            noti_author_photo = str(community_user.user_photo)

        notification_body = {
            'noti_receiver_id': noti_receiver_id,
            'noti_path': "/usuarios/comunidad/",
            'noti_type': noti_type,
            'noti_author_id': str(community_user.comm_id),
            'noti_author_name': noti_author_name,
            'noti_author_photo': str(noti_author_photo) if noti_author_photo is not None else None,
            'noti_issue': noti_issue,
            'noti_destination_name': str(community_user.comm_name)
        }

        delete_notification = DeleteNotification()
        delete_notification.task_delete_notification(request=self.context['request'],
                                                     notification_body=notification_do_delete)
        send_notification = SendNotification()
        send_notification.task_send_notification(request=self.context['request'], notification_body=notification_body)

    def get_members_and_no_members(self, inst_id, comm_id):
        all_users = self.__get_all_users(inst_id)
        users_members = self.__get_users_members(inst_id, comm_id)
        members, no_members = self.__classify_users(all_users, users_members)
        return {
            'members': members,
            'no_members': no_members
        }

    def __get_users_members(self, inst_id, comm_id):
        instance_community_user = CommunityUserModel.objects.filter(inst_id=inst_id, comm_id=comm_id)
        return CommunityUserSerializer(instance_community_user, many=True).data

    def __get_all_users(self, inst_id):
        instance_user = UserModel.objects.filter(inst_id=inst_id, user_status=Enums.ACTIVO)
        serializer_user = UserSerializer(instance_user, many=True)
        return serializer_user.data

    def __classify_users(self, all_users, users_members):
        members = list()
        no_members = list()
        limit_min = len(users_members)
        for user in all_users:
            if limit_min > 0:
                is_member = False
                for member in users_members:
                    if user['id'] == member['user_id']:
                        limit_min -= 1
                        is_member = True
                        user['is_member'] = True
                        members.append(user)

                if not is_member:
                    user['is_member'] = False
                    no_members.append(user)
            else:
                user['is_member'] = False
                no_members.append(user)

        return members, no_members

    def get_community_user(self, comm_id, user_id):
        instance_community_user = CommunityUserModel.objects.filter(comm_id=comm_id, user_id=user_id)
        return CommunityUserSerializer(instance_community_user, many=True).data

    def delete_info_community_user(self, comm_id, user_id):
        instance_community_user = CommunityUserModel.objects.filter(comm_id=comm_id, user_id=user_id)
        for community_user in instance_community_user:
            community_user.delete()
            notification_do_delete = {
                'noti_receiver_id': str(community_user.comm_owner_id),
                'noti_author_id': str(community_user.comm_id),
                'noti_author_name': community_user.user_name
            }
            delete_notification = DeleteNotification()
            delete_notification.task_delete_notification(request=self.context['request'],
                                                         notification_body=notification_do_delete)
