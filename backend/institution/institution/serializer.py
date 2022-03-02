import uuid

from common_structure_microservices.serializer import AuditorySerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from institution.models import InstitutionModel


class InstitutionSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    inst_name = serializers.CharField(validators=[UniqueValidator(queryset=InstitutionModel.objects.all())])
    inst_photo = serializers.UUIDField(required=False, allow_null=True)
    inst_website = serializers.URLField(required=False, allow_blank=True, allow_null=False)
    inst_phone = serializers.CharField(required=False, allow_blank=True, allow_null=False)
    inst_fax = serializers.CharField(required=False, allow_blank=True, allow_null=False)

    class Meta:
        model = InstitutionModel
        fields = ('id',
                  'inst_name',
                  'inst_photo',
                  'inst_address',
                  'inst_country',
                  'inst_department',
                  'inst_municipality',
                  'inst_head',
                  'inst_website',
                  'inst_phone',
                  'inst_fax',)
