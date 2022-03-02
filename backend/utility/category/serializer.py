import uuid

from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.utilities import Enums
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from category.models import CategoryModel


class CategorySerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4)
    cate_name = serializers.CharField(required=True, allow_blank=False, allow_null=False,
                                      validators=[UniqueValidator(queryset=CategoryModel.objects.all())])
    cate_description = serializers.CharField(required=False, allow_blank=True, allow_null=False)
    cate_type = serializers.ChoiceField(required=True, choices=Enums.LIST_TYPE_CATEGORIES)
    cate_status = serializers.ChoiceField(required=True, choices=Enums.LIST_STATUS)

    class Meta:
        model = CategoryModel
        fields = ('id',
                  'inst_id',
                  'cate_name',
                  'cate_description',
                  'cate_type',
                  'cate_status'
                  )
