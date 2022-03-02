import uuid

from munch import Munch
from rest_framework import serializers, status

from asn_user.messages import CustomMessages
from common_structure_microservices.exception import GenericMicroserviceError
from common_structure_microservices.messages import Messages
from common_structure_microservices.notification import SendNotification
from common_structure_microservices.send_email import send_email
from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.type_notification import TypeNotification
from common_structure_microservices.utilities import Enums, Constants
from community_user.models import CommunityUserModel
from community_user.serializer import CommunityUserSerializer
from invite_role.models import InviteRoleModel
from role.models import RoleModel
from role.serializer import RoleSerializer
from user.models import UserModel
from user.serializer import UserSerializer


class InviteRoleSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    user_email = serializers.EmailField()
    inro_status = serializers.ChoiceField(choices=Enums.LIST_AUTHORIZE_ROLE)
    inro_type = serializers.ChoiceField(choices=Enums.LIST_TYPE_INVITE_ROLE)
    comm_id = serializers.UUIDField(required=False, allow_null=True)
    cous_id = serializers.UUIDField(required=False, allow_null=True)
    comm_name = serializers.CharField(required=False, allow_blank=True)
    role_id = serializers.UUIDField(required=False, allow_null=True)
    role_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = InviteRoleModel
        fields = ('id',
                  'inst_id',
                  'user_id',
                  'role_id',
                  'inro_status',
                  'inro_type',
                  'user_name',
                  'role_name',
                  'user_email',
                  'comm_id',
                  'cous_id',
                  'comm_name',)

    def request_role_html(self):
        return 'request_role.html'

    def create(self, validated_data):
        super().create(validated_data)
        invite_role = validated_data
        inst_id = invite_role.get('inst_id')
        user_id = invite_role.get('user_id')
        self.update_user(inst_id, user_id, invite_role)
        context = {'role': Munch(validated_data)}
        send_email(file='invite_take_role.html', send_to_list=[invite_role['user_email']], context=context,
                   subject=CustomMessages.ROLE_INVITATION)
        notification_body = {
            'noti_receiver_id': str(user_id),
            'noti_path': 'perfil',
            'noti_type': TypeNotification.USER.value,
            'noti_issue': CustomMessages.NEW_ROLE,
            'noti_author_photo': None,
            'noti_author_name': '',
            'noti_author_id': str(user_id),
            'noti_destination_name': ''
        }

        self.sending_notification(notification_body)
        return invite_role

    def request_role(self, invite_role):
        super().create(invite_role)
        inst_id = invite_role.get('inst_id', None)
        admins = UserModel.objects.filter(inst_id=inst_id, user_admin=True)
        user_serializer = UserSerializer(admins, many=True).data
        emails = []
        for user in user_serializer:
            emails.append(user['user_email'])

        context = {'invite_role': Munch(invite_role)}
        send_email(file=self.request_role_html(), send_to_list=emails, subject=CustomMessages.ROLE_INVITATION,
                   context=context)

    def invite_take_role(self, invite_role):
        inro_type = invite_role['inro_type']
        inst_id = invite_role['inst_id']
        user_id = invite_role['user_id']
        comm_id = invite_role['comm_id']
        cous_id = invite_role['cous_id']
        title = '¡Se te ha extendido la invitación a tener otro rol!'
        if inro_type == Enums.COMMUNITY:
            try:

                instance = CommunityUserModel.objects.get(id=cous_id, comm_id=comm_id, inst_id=inst_id, user_id=user_id)
                kwargs = {'cous_admin': True}
                community_user = CommunityUserSerializer(instance, data=kwargs, partial=True)
                community_user.is_valid(raise_exception=True)
                community_user.save()
                title = '¡Ahora eres un administrador!'

                context = {'title': title,
                           'invite_role': invite_role}

                send_email(file=self.request_role_html(), send_to_list=[invite_role['user_email']], context=context,
                           subject=title)
                notification_body = {
                    'noti_receiver_id': str(user_id),
                    'noti_path': 'usuarios/comunidad/',
                    'noti_type': TypeNotification.COMMUNITY.value,
                    'noti_issue': f'Ahora eres administrador de la comunidad <b>{invite_role["comm_name"]}</b>',
                    'noti_author_photo': str(community_user['comm_photo'].value) if community_user[
                                                                                        'comm_photo'].value is not None else None,
                    'noti_author_name': '',
                    'noti_author_id': comm_id,
                    'noti_destination_name': invite_role['comm_name']
                }

                self.sending_notification(notification_body)

            except CommunityUserModel.DoesNotExist:
                raise GenericMicroserviceError(detail=Messages.INSTANCE_DOES_NOT_EXIST % 'Comunidad',
                                               status=status.HTTP_404_NOT_FOUND)

        else:
            invite_role_created = super().create(invite_role)
            try:
                instance = UserModel.objects.get(inst_id=inst_id, id=user_id)
                serializer = UserSerializer(instance)
                user_roles = serializer['user_role'].value
                role_id = invite_role['role_id']
                role_name = invite_role['role_name']
                for user_role in user_roles:
                    if role_id == user_role['roleId']:
                        invite_role_created.delete()
                        return CustomMessages.USER_ALREADY_HAS_THAT_ROLE

                user_roles.append({'roleId': role_id, 'roleName': role_name})
                kwargs = {'user_role': user_roles}

                user = UserSerializer(instance, data=kwargs, partial=True)
                user.is_valid(raise_exception=True)
                user.save()

                context = {'title': title,
                           'invite_role': invite_role,
                           'role_name': role_name}

                send_email(file='invite_take_role.html', send_to_list=[invite_role['user_email']], context=context,
                           subject=title)

                notification_body = {
                    'noti_receiver_id': str(user_id),
                    'noti_path': f'/perfil/{user_id}',
                    'noti_type': TypeNotification.USER.value,
                    'noti_issue': 'Se te otorgo un nuevo rol, entra a tu perfil para revisar cual fue',
                    'noti_author_photo': None,
                    'noti_author_name': '',
                    'noti_author_id': str(user_id),
                    'noti_destination_name': ''
                }

                self.sending_notification(notification_body)

                return CustomMessages.INVITATION_EMAIL_SENT

            except UserModel.DoesNotExist:
                raise GenericMicroserviceError(detail=Messages.INSTANCE_DOES_NOT_EXIST % 'Usuario',
                                               status=status.HTTP_404_NOT_FOUND)

    def authorize_role(self, invite_role):
        user_id = invite_role['user_id'].value
        inst_id = invite_role['inst_id'].value
        updated = self.update_user(inst_id=inst_id, user_id=user_id,
                                   invite_role=invite_role.data)
        if updated:
            instance = InviteRoleModel.objects.get(id=invite_role['id'].value)
            validated_data = {'inro_status': Enums.AUTHORIZED}
            self.update(instance=instance, validated_data=validated_data)

            context = {
                'title': 'Tu solicitud de nuevo rol, ¡ha sido aceptada!',
                'description': 'Tu solicitud de nuevo rol fue aprobada, se te ha asignado un nuevo rol'
            }

            send_email(file=self.request_role_html(), context=context, send_to_list=[invite_role['user_email'].value],
                       subject=CustomMessages.ROLE_INVITATION)

            notification_body = {
                'noti_receiver_id': str(user_id),
                'noti_path': '/perfil/{user_id}',
                'noti_type': TypeNotification.USER.value,
                'noti_issue': CustomMessages.NEW_ROLE,
                'noti_author_photo': None,
                'noti_author_name': '',
                'noti_author_id': str(user_id),
                'noti_destination_name': ''
            }

            self.sending_notification(notification_body)

    def update_user(self, inst_id, user_id, invite_role):
        try:
            instance = UserModel.objects.get(inst_id=inst_id, id=user_id)
            serializer = UserSerializer(instance)
            user_roles = serializer['user_role'].value
            user_roles.append({'roleId': str(invite_role['role_id']),
                               'roleName': invite_role['role_name']})
            kwargs = {'user_role': user_roles}

            if serializer['user_role_structure'].value == []:
                role_model = RoleModel.objects.get(id=invite_role['role_id'])
                role_structure = RoleSerializer(role_model).data['role_structure']
                kwargs.update({'user_role_structure': role_structure})

            user = UserSerializer(instance, data=kwargs, partial=True)
            user.is_valid(raise_exception=True)
            return user.save()
        except UserModel.DoesNotExist:
            raise GenericMicroserviceError(detail=Messages.INSTANCE_DOES_NOT_EXIST % 'Usuario',
                                           status=status.HTTP_404_NOT_FOUND)

    def sending_notification(self, notification_body):
        send_notification = SendNotification()
        send_notification.task_send_notification(request=self.context['request'], notification_body=notification_body)
