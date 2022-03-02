import uuid

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.utilities import Enums
from module.serializer import ModuleSerializer
from role.models import RoleModel


class RoleSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    role_name = serializers.CharField(validators=[UniqueValidator(queryset=RoleModel.objects.all())])
    role_list_module = serializers.ListField(required=True, child=serializers.JSONField())
    role_structure = serializers.ListField(required=False, child=serializers.JSONField(), allow_null=True,
                                           allow_empty=True)
    role_static = serializers.BooleanField(required=False, default=False)
    role_status = serializers.CharField(required=False, default=Enums.ACTIVO)

    class Meta:
        model = RoleModel
        fields = ('id',
                  'inst_id',
                  'role_name',
                  'role_list_module',
                  'role_structure',
                  'role_static',
                  'role_status',
                  )

    def create(self, validated_data):
        role_model = self.Meta.model
        if validated_data['role_list_module'] != [{}]:
            validated_data['role_structure'] = self.create_structure(
                role_list_module=validated_data['role_list_module'])
        role_instance = role_model.objects.create(**validated_data)
        return role_instance

    def update(self, instance, validated_data):
        if validated_data['role_list_module'] != [{}]:
            validated_data['role_structure'] = self.create_structure(
                role_list_module=validated_data['role_list_module'])
        return super().update(instance, validated_data)

    def create_structure(self, role_list_module):
        role_structure = []
        module_serializer = ModuleSerializer()
        modules = module_serializer.get_modules()
        for x in range(0, len(role_list_module)):
            for module in modules:
                if role_list_module[x]['id'] == module['id']:
                    module['modu_permissions'] = role_list_module[x]['perm_list']
                    role_structure.append(module)
        return role_structure

    @staticmethod
    def get_role_by_id(inst_id, role_id):
        try:
            role = RoleModel.objects.get(inst_id=inst_id, id=role_id)
            role_serializer = RoleSerializer(role)
            return role_serializer.data

        except RoleModel.DoesNotExist:
            return []
