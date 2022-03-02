import json
import uuid
from datetime import datetime

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from common_structure_microservices.entity_url import EntityUrlMap
from common_structure_microservices.notification import SendNotification
from common_structure_microservices.remote import RemoteModel
from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.type_notification import TypeNotification
from django.db.models import Q
from rest_framework import serializers

from asn_chat.messages import CustomMessages
from conversation.models import ConversationModel
from message.models import MessageModel
from message.serializer import MessageSerializer


class ConversationSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    conv_user_receiver_id = serializers.UUIDField(allow_null=True)
    conv_user_emisor_photo_id = serializers.UUIDField(required=False, allow_null=True)
    conv_user_receiver_photo_id = serializers.UUIDField(required=False, allow_null=True)
    conv_user_receiver_email = serializers.CharField(allow_null=True)

    class Meta:
        model = ConversationModel
        fields = ('id',
                  'conv_user_emisor_id',
                  'conv_user_receiver_id',
                  'conv_is_bidirectional',
                  'conv_user_emisor_photo_id',
                  'conv_user_receiver_photo_id',
                  'conv_user_emisor_name',
                  'conv_user_receiver_name',
                  'conv_user_emisor_email',
                  'conv_user_receiver_email',
                  )

    def create(self, validated_data):
        try:
            conversation_with_emisor_model = ConversationModel.objects.filter(
                conv_user_emisor_id=validated_data['conv_user_emisor_id'],
                conv_user_receiver_id=validated_data['conv_user_receiver_id'])
            conversation_with_emisor_serializer = ConversationSerializer(conversation_with_emisor_model, many=True).data
            if conversation_with_emisor_serializer.__len__() == 0:
                conversation_with_receiver_model = ConversationModel.objects.filter(
                    conv_user_emisor_id=validated_data['conv_user_receiver_id'],
                    conv_user_receiver_id=validated_data['conv_user_emisor_id'])
                conversation_with_receiver_serializer = ConversationSerializer(conversation_with_receiver_model,
                                                                               many=True).data
                if conversation_with_receiver_serializer.__len__() == 0:
                    raise ConversationModel.DoesNotExist
                else:
                    conv_id = conversation_with_receiver_serializer[0]['id']
                    kwargs = {'conv_is_bidirectional': True,
                              'conv_user_receiver_email': validated_data['conv_user_emisor_email']}
            else:
                conv_id = conversation_with_emisor_serializer[0]['id']
                kwargs = {'conv_is_bidirectional': True,
                          'conv_user_receiver_email': validated_data['conv_user_receiver_email']}

            conversation_model = ConversationModel.objects.get(id=conv_id)
            conversation_serializer = ConversationSerializer(conversation_model, data=kwargs, partial=True)
            conversation_serializer.is_valid(raise_exception=True)
            conversation_serializer.save()
            return conversation_model

        except ConversationModel.DoesNotExist:
            conversation = super().create(validated_data)
            notification_body = {
                'noti_receiver_id': str(validated_data.get('conv_user_receiver_id')),
                'noti_path': 'chat',
                'noti_type': TypeNotification.CHAT.value,
                'noti_issue': CustomMessages.WANT_TALK_WITH_YOU % str(validated_data.get('conv_user_emisor_name')),
                'noti_author_photo': str(validated_data.get('conv_user_emisor_photo_id')) if validated_data.get(
                    'conv_user_emisor_photo_id') is not None else None,
                'noti_author_name': validated_data.get('conv_user_emisor_name'),
                'noti_author_id': str(validated_data.get('conv_user_emisor_id'))
            }
            send_notification = SendNotification()
            send_notification.task_send_notification(request=self.context['request'],
                                                     notification_body=notification_body)
            return conversation

    def send_message(self, message):
        channel_layer = get_channel_layer()
        group_name = '%s' % str(message.conv_id)
        async_to_sync(channel_layer.group_send)(
            group_name, {
                'type': 'chat_message',
                'conv_id': str(message.conv_id),
                'mess_author': str(message.mess_author),
                'mess_content': message.mess_content,
                'mess_date': str(message.mess_date)
            }
        )


class SendMessageSerializer(serializers.Serializer):
    conv_id = serializers.UUIDField(required=False)
    user_emisor = serializers.JSONField(required=False)
    user_receiver = serializers.JSONField(required=True)
    mess_content = serializers.CharField(required=True)

    def send_message(self, request):
        conversation_id = self.validated_data.get('conv_id')
        user_emisor = self.validated_data.get('user_emisor')
        user_receiver = self.validated_data.get('user_receiver')
        mess_content = self.validated_data.get('mess_content')
        try:
            if conversation_id is None:
                user_emisor_id = user_emisor['id']
                user_receiver_is_fous = True if user_receiver['user_id'] == user_emisor['id'] else False
                user_receiver_id = user_receiver['fous_user_id'] if user_receiver_is_fous else user_receiver['user_id']
                conversation_id = self.__search_id_conversation(user_emisor_id, user_receiver_id)
            else:
                user_emisor_id = user_emisor

            conversation = ConversationModel.objects.get(id=conversation_id)
            if not conversation.conv_is_bidirectional:
                self.__save_conversation_like_bidirectional(request, conversation)

        except ConversationModel.DoesNotExist:
            user_receiver_is_fous = True if user_receiver['user_id'] == user_emisor['id'] else False
            conversation_saved = self.__saved_conversation(user_receiver_is_fous, user_emisor, user_receiver)
            conversation_id = conversation_saved.id
            user_emisor_id = user_emisor['id']

        message = MessageModel(conv_id=conversation_id,
                               mess_author=user_emisor_id,
                               mess_date=datetime.now(),
                               mess_content=mess_content)

        message.save()
        message_serializer = MessageSerializer(message).data
        conversation_serializer = ConversationSerializer()
        conversation_serializer.send_message(message)

        return message_serializer

    def __search_id_conversation(self, user_emisor_id, user_receiver_id):
        instance_conversation = ConversationModel.objects.filter(
            Q(conv_user_emisor_id=user_emisor_id, conv_user_receiver_id=user_receiver_id) |
            Q(conv_user_emisor_id=user_receiver_id, conv_user_receiver_id=user_emisor_id))
        serializer_conversation = ConversationSerializer(instance_conversation, many=True)

        if serializer_conversation.data.__len__() == 0:
            raise ConversationModel.DoesNotExist
        conversation_serializer = serializer_conversation.data[0]
        return conversation_serializer['id']

    def __save_conversation_like_bidirectional(self, request, conversation):
        kwargs = {'conv_is_bidirectional': True}
        remote_model = RemoteModel(request=request, url=EntityUrlMap.USER)
        if conversation.conv_user_receiver_email is None:
            user_receiver = json.loads(remote_model.get(conversation.conv_user_receiver_id).content)['data']
            kwargs.update({'conv_user_receiver_email': user_receiver['user_email']})
        elif conversation.conv_user_emisor_email is None:
            user_emisor = json.loads(remote_model.get(conversation.conv_user_emisor_id.content))['data']
            kwargs.update({'conv_user_emisor_email': user_emisor['user_email']})
        conversation_serializer = ConversationSerializer(conversation, data=kwargs, partial=True)
        conversation_serializer.is_valid(raise_exception=True)
        conversation_serializer.save()

    def __saved_conversation(self, user_receiver_is_fous, user_emisor, user_receiver):
        if user_receiver_is_fous:
            user_receiver_id = user_receiver['fous_user_id']
            user_receiver_photo = user_receiver['fous_photo']
            user_receiver_name = user_receiver['name_fous']
            user_receiver_email = user_receiver['fous_email']
        else:
            user_receiver_id = user_receiver['user_id']
            user_receiver_photo = user_receiver['user_photo']
            user_receiver_name = user_receiver['name_user']
            user_receiver_email = user_receiver['user_email']

        conversation_saved = ConversationModel(conv_user_emisor_id=user_emisor['id'],
                                               conv_user_receiver_id=user_receiver_id,
                                               conv_is_bidirectional=True,
                                               conv_user_emisor_photo_id=user_emisor['user_photo'],
                                               conv_user_receiver_photo_id=user_receiver_photo,
                                               conv_user_emisor_name=user_emisor['user_name'],
                                               conv_user_receiver_name=user_receiver_name,
                                               conv_user_emisor_email=user_emisor['user_email'],
                                               conv_user_receiver_email=user_receiver_email)

        conversation_saved.save()
        return conversation_saved


class DeleteConversation(serializers.Serializer):

    def delete_conversation(self, user_session, conv_id):
        conversation_model = ConversationModel.objects.get(id=conv_id)
        conversation_serializer = ConversationSerializer(conversation_model).data
        kwargs = {}
        if conversation_serializer['conv_user_emisor_id'] == conversation_serializer['conv_user_receiver_id'] or \
                not conversation_serializer['conv_is_bidirectional']:
            conversation_model.delete()
            MessageModel.objects.filter(conv_id=conv_id).delete()

        elif conversation_serializer['conv_is_bidirectional']:
            if conversation_serializer['conv_user_emisor_id'] == user_session:
                kwargs = {'id': conversation_serializer['id'],
                          'conv_user_emisor_id': conversation_serializer['conv_user_receiver_id'],
                          'conv_user_receiver_id': conversation_serializer['conv_user_emisor_id'],
                          'conv_is_bidirectional': False,
                          'conv_user_emisor_photo_id': conversation_serializer['conv_user_receiver_photo_id'],
                          'conv_user_receiver_photo_id': conversation_serializer['conv_user_emisor_photo_id'],
                          'conv_user_emisor_name': conversation_serializer['conv_user_receiver_name'],
                          'conv_user_receiver_name': conversation_serializer['conv_user_emisor_name'],
                          'conv_user_emisor_email': conversation_serializer['conv_user_receiver_email'],
                          'conv_user_receiver_email': None}
            elif conversation_serializer['conv_user_receiver_id'] == user_session:
                kwargs = {'conv_is_bidirectional': False,
                          'conv_user_receiver_email': None}

            conversation_serializer = ConversationSerializer(conversation_model, data=kwargs, partial=True)
            conversation_serializer.is_valid(raise_exception=True)
            conversation_serializer.save()

        return CustomMessages.DELETE_CONVERSATION_MESSAGE


class CascadeUpdateTaskUserConversation(serializers.Serializer):
    user_id = serializers.UUIDField(required=True)
    user_name = serializers.CharField(required=True)
    user_photo = serializers.UUIDField(required=True)
    user_email = serializers.EmailField(required=True)

    def cascade_update_user_conversation(self):
        user_id = self.validated_data.get('user_id')
        user_name = self.validated_data.get('user_name')
        user_photo = self.validated_data.get('user_photo')
        user_email = self.validated_data.get('user_email')

        ConversationModel.objects.filter(conv_user_emisor_id=user_id).update(conv_user_emisor_photo_id=user_photo,
                                                                             conv_user_emisor_name=user_name,
                                                                             conv_user_emisor_email=user_email)

        ConversationModel.objects.filter(conv_user_receiver_id=user_id).update(conv_user_receiver_photo_id=user_photo,
                                                                               conv_user_receiver_name=user_name,
                                                                               conv_user_receiver_email=user_email)
