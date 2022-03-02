import uuid

from common_structure_microservices.serializer import AuditorySerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from university_career.models import UniversityCareerModel


class UniversityCareerSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4)
    career_name = serializers.CharField(required=True, allow_blank=False, allow_null=False,
                                        validators=[UniqueValidator(queryset=UniversityCareerModel.objects.all())])

    class Meta:
        model = UniversityCareerModel
        fields = ('id',
                  'career_name'
                  )
