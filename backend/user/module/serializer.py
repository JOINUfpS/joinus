import uuid

from rest_framework import serializers

from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.utilities import Enums
from module.models import ModuleModel


class ModuleSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    modu_name = serializers.CharField(required=True)
    modu_status = serializers.CharField(required=False, default=Enums.ACTIVO)
    modu_permissions = serializers.ListField(required=True, child=serializers.CharField())
    modu_is_generic = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = ModuleModel
        fields = ('id',
                  'modu_name',
                  'modu_router',
                  'modu_icon',
                  'modu_status',
                  'modu_permissions',
                  'modu_is_generic')

    def get_modules(self, modu_id=None):
        try:
            if modu_id is None:
                modules = ModuleModel.objects.all()
                modules_serializer = ModuleSerializer(modules, many=True)
            else:
                modules = ModuleModel.objects.get(id=modu_id)
                modules_serializer = ModuleSerializer(modules)

            return modules_serializer.data
        except ModuleModel.DoesNotExist:
            return []
