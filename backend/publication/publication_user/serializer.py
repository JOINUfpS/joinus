import uuid
from datetime import datetime

from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.utilities import Constants
from rest_framework import serializers

from publication_user.models import PublicationUserModel


class PublicationUserSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    publ_user_photo = serializers.UUIDField(required=False, allow_null=True)
    cate_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    comm_id = serializers.UUIDField(required=False, allow_null=True)
    comm_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    publ_description = serializers.CharField(required=False, allow_null=False, allow_blank=True)
    publ_authors = serializers.ListField(child=serializers.JSONField())
    publ_comment = serializers.ListField(required=False, child=serializers.JSONField())
    publ_attachments = serializers.ListField(child=serializers.JSONField())
    publ_link_doi = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    publ_project_id = serializers.UUIDField(required=False, allow_null=True)
    publ_project = serializers.JSONField(required=False, allow_null=True)
    created_date = serializers.DateTimeField(required=False, default=datetime.now, allow_null=True,
                                             format=Constants.FORMAT_DATE_TIME_12,
                                             input_formats=(Constants.FORMAT_DATE_TIME_12,))

    class Meta:
        model = PublicationUserModel
        fields = ('id',
                  'publ_id',
                  'user_id',
                  'puus_interest',
                  'puus_shared',
                  'puus_saved',
                  'publ_user_id',
                  'publ_user_name',
                  'publ_user_photo',
                  'cate_name',
                  'comm_id',
                  'comm_name',
                  'publ_title',
                  'publ_description',
                  'publ_authors',
                  'publ_comment',
                  'publ_privacy',
                  'publ_amount_interest',
                  'publ_amount_shared',
                  'publ_attachments',
                  'publ_link_doi',
                  'publ_project_id',
                  'publ_project',
                  'created_date',)
