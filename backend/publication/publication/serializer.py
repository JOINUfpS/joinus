import json
import uuid
from datetime import datetime

from common_structure_microservices.entity_url import EntityUrlMap
from common_structure_microservices.exception import GenericMicroserviceError
from common_structure_microservices.messages import Messages
from common_structure_microservices.notification import SendNotification
from common_structure_microservices.remote import RemoteModel
from common_structure_microservices.send_email import send_email
from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.type_notification import TypeNotification
from common_structure_microservices.utilities import Constants, Enums
from munch import Munch
from rest_framework import serializers, status

from asn_publication.messages import MessagesCustom
from publication.models import PublicationModel
from publication_user.models import PublicationUserModel


class PublicationSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    user_photo = serializers.UUIDField(required=False, allow_null=True)
    comm_id = serializers.UUIDField(required=False, allow_null=True)
    cate_id = serializers.UUIDField(required=False, allow_null=True)
    cate_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    comm_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    publ_description = serializers.CharField(required=False, allow_null=False, allow_blank=True)
    publ_authors = serializers.ListField(child=serializers.JSONField())
    publ_comment = serializers.ListField(required=False, child=serializers.JSONField())
    publ_attachments = serializers.ListField(child=serializers.JSONField())
    publ_full_text = serializers.BooleanField(default=False)
    publ_date = serializers.DateTimeField(required=False, format=Constants.FORMAT_DATE_TIME_12,
                                          input_formats=(
                                              Constants.FORMAT_DATE_TIME_12, Constants.FORMAT_DATE_TIME_TIMEZONE_EN),
                                          default=datetime.now, allow_null=True)
    publ_amount_download = serializers.IntegerField(required=False, default=0)
    publ_interested_list = serializers.ListField(required=False, default=[], child=serializers.UUIDField())
    user_interested = serializers.BooleanField(required=False, default=False)
    publ_amount_shared = serializers.IntegerField(required=False, default=0)
    publ_link_doi = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    publ_permission_view_full_text = serializers.ListField(required=False, default=[],
                                                           child=serializers.CharField())
    created_date = serializers.DateTimeField(default=datetime.now, format=Constants.FORMAT_DATE_TIME_12,
                                             input_formats=(Constants.FORMAT_DATE_TIME_12,
                                                            Constants.FORMAT_DATE_TIME_TIMEZONE_EN,))
    publ_project_id = serializers.UUIDField(required=False, allow_null=True)
    publ_project = serializers.JSONField(required=False, allow_null=True)

    class Meta:
        model = PublicationModel
        fields = ('id',
                  'user_id',
                  'user_name',
                  'user_photo',
                  'inst_id',
                  'comm_id',
                  'comm_name',
                  'cate_id',
                  'cate_name',
                  'publ_title',
                  'publ_description',
                  'publ_standard',
                  'publ_authors',
                  'publ_privacy',
                  'publ_date',
                  'publ_comment',
                  'publ_interested_list',
                  'user_interested',
                  'publ_amount_shared',
                  'publ_amount_download',
                  'publ_attachments',
                  'publ_full_text',
                  'publ_link_doi',
                  'publ_permission_view_full_text',
                  'publ_project_id',
                  'publ_project',
                  'created_date',)

    def get_publication_related(self, publication_id, project_id, show_privates):
        publications_related = list()
        try:
            if show_privates:
                instance_publication = PublicationModel.objects.filter(publ_project_id=project_id) \
                    .exclude(id=publication_id)
            else:
                instance_publication = PublicationModel.objects.filter(publ_project_id=project_id,
                                                                       publ_privacy=False).exclude(id=publication_id)
            serializer_publication = PublicationSerializer(instance_publication, many=True)
            publications_related = serializer_publication.data

        except PublicationModel.DoesNotExist:
            pass

        return publications_related


class SendFullTextSerializer(serializers.Serializer):
    user_email = serializers.EmailField(required=True)
    publ_id = serializers.UUIDField(required=True)

    def send_full_text(self):
        publ_id = self.validated_data.get('publ_id')
        user_email = self.validated_data.get('user_email')

        publication = PublicationModel.objects.get(id=publ_id)
        publication.publ_permission_view_full_text.append(user_email)
        kwargs = {'publ_permission_view_full_text': publication.publ_permission_view_full_text}
        publication_serializer = PublicationSerializer(publication, data=kwargs, partial=True)
        publication_serializer.is_valid(raise_exception=True)
        publication_serializer.save()
        context = {
            'publication': Munch(publication_serializer.data)
        }
        send_email(file='send_full_text.html', send_to_list=[user_email],
                   subject=MessagesCustom.FULL_TEXT_ORDER_NOTIFICATION, context=context)

        return MessagesCustom.REQUEST_SENT_SUCCESSFULLY


class SharePublicationSerializer(serializers.Serializer):
    share_option = serializers.ChoiceField(required=True, choices=Enums.SHARE_OPTIONS)
    publ_id = serializers.UUIDField(required=True)
    user_share = serializers.JSONField(required=True)
    user_sharing = serializers.JSONField(required=True)

    def share_publication(self):
        share_option = self.validated_data.get('share_option')
        publ_id = self.validated_data.get('publ_id')
        user_share = self.validated_data.get('user_share')
        user_sharing = self.validated_data.get('user_sharing')

        try:
            publication = PublicationModel.objects.get(id=publ_id)
            publication_serializer = PublicationSerializer(publication)
            context = {
                'publication': Munch(publication_serializer.data),
                'user_share': Munch(user_share),
                'user_sharing': Munch(user_sharing)
            }

            if share_option == Enums.EMAIL:
                email_user_sharing = user_sharing['user_email'] if user_share['id'] != user_sharing['user_id'] else user_sharing['fous_email']
                send_email(file='share_publication.html', send_to_list=[email_user_sharing],
                           subject=MessagesCustom.SHARED_PUBLICATION_NOTIFICATION % user_share["user_name"],
                           context=context)
            else:
                remote_model = RemoteModel(self.context['request'], url=EntityUrlMap.CONVERSATION)
                name_user_sharing = user_sharing['name_user'] if user_share['id'] != user_sharing['user_id'] else user_sharing['name_fous']
                send_message = {'user_emisor': user_share,
                                'user_receiver': user_sharing,
                                'mess_content': f'¡Hola {name_user_sharing}!, quiero compartir contigo la '
                                                f'publicación <a href="https://studentsprojects.cloud.ufps.edu.co/{Constants.FRONTEND_CONTEXT} '
                                                f'/publicaciones/publicacion/{publication.id}/">'
                                                f'{publication.publ_title}</a>'}

                json.loads(remote_model.create(entity_data=send_message, url_path=f'send_message/').content)
            publ_amount_shared = publication.publ_amount_shared + 1
            kwargs = {'publ_amount_shared': publ_amount_shared}
            publication_update = PublicationSerializer(publication, data=kwargs, partial=True)
            publication_update.is_valid(raise_exception=True)
            publication_update.save()

            PublicationUserModel.objects.filter(publ_id=publ_id).update(publ_amount_shared=publ_amount_shared,
                                                                        puus_shared=True)

        except PublicationModel.DoesNotExist:
            raise GenericMicroserviceError(detail=Messages.INSTANCE_DOES_NOT_EXIST % 'Publicación',
                                           status=status.HTTP_404_NOT_FOUND)

        return MessagesCustom.PUBLICATION_SHARED_SUCCESSFULLY


class InterestPublicationSerializer(serializers.Serializer):
    publ_id = serializers.UUIDField(required=True)
    user_interested = serializers.UUIDField(required=True)
    user_interested_photo = serializers.UUIDField(required=True, allow_null=True)
    user_interested_name = serializers.CharField(required=True)

    def interest_publication(self):
        publ_id = self.validated_data.get('publ_id')
        user_interested = self.validated_data.get('user_interested')
        user_interested_photo = self.validated_data.get('user_interested_photo')
        user_interested_name = self.validated_data.get('user_interested_name')

        base_url = '/publicaciones/publicacion/'

        try:
            instance = PublicationModel.objects.get(id=publ_id)
            publication = PublicationSerializer(instance).data

            if str(user_interested) != publication['user_id']:
                notification_body = {
                    'noti_receiver_id': str(publication['user_id']),
                    'noti_path': f'{base_url}/',
                    'noti_type': TypeNotification.PUBLICATION.value,
                    'noti_issue': MessagesCustom.INTEREST_PUBLICATION % user_interested_name,
                    'noti_destination_name': publication["publ_title"],
                    'noti_author_photo': str(user_interested_photo),
                    'noti_author_name': user_interested_name,
                    'noti_author_id': str(publ_id)
                }

                send_notification = SendNotification()
                send_notification.task_send_notification(request=self.context['request'],
                                                         notification_body=notification_body)
            publication['publ_interested_list'].append(user_interested)
            kwargs = {'publ_interested_list': publication['publ_interested_list']}
            publication_update = PublicationSerializer(instance, data=kwargs, partial=True)
            publication_update.is_valid(raise_exception=True)
            publication_update.save()
            PublicationUserModel.objects.filter(publ_id=publ_id, user_id=user_interested).update(
                puus_interest=True)
            return publication

        except PublicationModel.DoesNotExist:
            raise GenericMicroserviceError(detail=Messages.INSTANCE_DOES_NOT_EXIST % 'Publicación',
                                           status=status.HTTP_404_NOT_FOUND)


class CascadeUpdateTaskPublicationCommunity(serializers.Serializer):
    comm_id = serializers.UUIDField(required=True)
    comm_name = serializers.CharField(required=True)

    def cascade_update_community(self):
        comm_id = self.validated_data.get('comm_id')
        comm_name = self.validated_data.get('comm_name')

        PublicationModel.objects.filter(comm_id=comm_id).update(comm_name=comm_name)
        PublicationUserModel.objects.filter(comm_id=comm_id).update(comm_name=comm_name)


class CascadeUpdateTaskPublicationUser(serializers.Serializer):
    user_id = serializers.UUIDField(required=True)
    user_name = serializers.CharField(required=True)
    user_photo = serializers.UUIDField(required=False, allow_null=True)

    def cascade_update_user(self):
        user_id = self.validated_data.get('user_id')
        user_name = self.validated_data.get('user_name')
        user_photo = self.validated_data.get('user_photo')
        user = {'user_id': user_id,
                'user_name': user_name,
                'user_photo': user_photo}
        publications = PublicationModel.objects.all()
        for publication in publications:
            publication_model = PublicationModel.objects.get(id=publication.id)
            authors = publication_model.publ_authors
            comments = publication_model.publ_comment
            for author in authors:
                if author['id'] == str(user_id):
                    author['author_name'] = user_name
                    author['author_photo'] = user_photo
            for comment in comments:
                if comment['comm_user_id'] == str(user_id):
                    comment['comm_user_name'] = user_name
                    comment['comm_user_photo'] = user_photo

            self.update_user_info(publication_model, user, publication)

    def update_user_info(self, publication_model, user, publication):
        user_id = user.get('user_id')
        user_name = user.get('user_name')
        user_photo = user.get('user_photo')

        if publication_model.user_id == user_id:
            if not publication_model.publ_standard:
                PublicationModel.objects.filter(id=publication.id) \
                    .update(user_name=user_name,
                            user_photo=user_photo,
                            publ_comment=publication_model.publ_comment)

                PublicationUserModel.objects.filter(publ_user_id=user_id) \
                    .update(publ_user_name=user_name,
                            publ_user_photo=user_photo,
                            publ_comment=publication_model.publ_comment)
            else:
                PublicationModel.objects.filter(id=publication.id, user_id=user_id) \
                    .update(user_name=user_name,
                            user_photo=user_photo,
                            publ_authors=publication_model.publ_authors,
                            publ_comment=publication_model.publ_comment)

                PublicationUserModel.objects.filter(publ_user_id=user_id, publ_id=publication.id) \
                    .update(publ_user_name=user_name,
                            publ_user_photo=user_photo,
                            publ_authors=publication_model.publ_authors,
                            publ_comment=publication_model.publ_comment)
        else:
            PublicationModel.objects.filter(id=publication.id).update(
                publ_authors=publication_model.publ_authors,
                publ_comment=publication_model.publ_comment)

            PublicationUserModel.objects.filter(publ_id=publication.id) \
                .update(publ_authors=publication_model.publ_authors,
                        publ_comment=publication_model.publ_comment)


class CascadeUpdateTaskUserProject(serializers.Serializer):
    user_projects = serializers.ListField(required=True, child=serializers.JSONField())

    def cascade_update_user_project(self):
        user_projects = self.validated_data.get('user_projects')

        for project in user_projects:
            PublicationModel.objects.filter(publ_project_id=project['id']).update(publ_project=project)
            PublicationUserModel.objects.filter(publ_project_id=project['id']).update(publ_project=project)
