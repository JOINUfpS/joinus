import json
import uuid

import rstr
from common_structure_microservices.entity_url import EntityUrlMap
from common_structure_microservices.exception import GenericMicroserviceError
from common_structure_microservices.messages import Messages
from common_structure_microservices.remote import RemoteModel
from common_structure_microservices.send_email import send_email
from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.utilities import Enums
from django.contrib.auth.hashers import make_password, check_password
from munch import Munch
from rest_framework import serializers, status
from rest_framework.validators import UniqueValidator

from asn_user.messages import CustomMessages
from follow_user.models import FollowUserModel
from role.serializer import RoleSerializer
from user.models import UserModel


class UserSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    inst_id = serializers.UUIDField(required=False, allow_null=True)
    inst_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    user_email = serializers.EmailField(validators=[UniqueValidator(queryset=UserModel.objects.all())])
    user_password = serializers.CharField(required=False, write_only=True)
    user_provider = serializers.CharField(required=False, default=Enums.REGULAR_PROVIDER)
    user_role = serializers.ListField(child=serializers.JSONField(), allow_null=True, default=[{}])
    user_role_structure = serializers.JSONField(required=False, allow_null=True)
    role_active = serializers.UUIDField(required=False, allow_null=True)
    user_admin = serializers.BooleanField(required=False, default=False)
    user_interest = serializers.ListField(required=False, child=serializers.CharField(), default=[])
    user_photo = serializers.UUIDField(required=False, allow_null=True)
    user_phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    user_degree = serializers.JSONField(default={})
    user_projects = serializers.ListField(required=False, allow_null=True, child=serializers.JSONField(), default=[])
    user_skill = serializers.ListField(required=False, child=serializers.CharField(), default=[], allow_null=True)
    user_intro = serializers.CharField(required=False, allow_blank=True, allow_null=False)
    user_curriculum_vitae = serializers.UUIDField(required=False, allow_null=True)
    user_country = serializers.JSONField(required=False, default={})
    user_department = serializers.JSONField(required=False, default={})
    user_municipality = serializers.JSONField(required=False, default={})
    user_status = serializers.ChoiceField(required=False, allow_null=True, allow_blank=True, choices=Enums.LIST_STATUS,
                                          default=Enums.ACTIVO)
    user_gender = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = UserModel
        fields = ('id',
                  'inst_id',
                  'inst_name',
                  'user_name',
                  'user_email',
                  'user_password',
                  'user_provider',
                  'user_role',
                  'user_role_structure',
                  'role_active',
                  'user_admin',
                  'user_intro',
                  'user_interest',
                  'user_phone',
                  'user_photo',
                  'user_gender',
                  'user_degree',
                  'user_projects',
                  'user_curriculum_vitae',
                  'user_skill',
                  'user_country',
                  'user_department',
                  'user_municipality',
                  'user_status')

    def create(self, validated_data):
        remote_model = RemoteModel(request=self.context['request'], url=EntityUrlMap.INSTITUTION)
        institution = json.loads(remote_model.get().content)['data'][0]
        validated_data.update({
            'inst_id': institution['id'],
            'inst_name': institution['inst_name']
        })
        if 'role_active' in validated_data:
            role = RoleSerializer.get_role_by_id(inst_id=validated_data['inst_id'],
                                                 role_id=validated_data['role_active'])
            validated_data['user_role_structure'] = role['role_structure']
        validated_data.update({'user_status': Enums.INACTIVO})
        validated_data['user_email'] = validated_data['user_email'].lower()
        validated_data['user_name'] = validated_data['user_name'].title()
        user = super().create(validated_data)
        temporal_password = rstr.xeger(r'[a-z]\d[A-Z]\d[0-9]\d[?=.!@#%&,><’:;|_~*]\d')

        remote_model_confirmation = RemoteModel(request=self.context['request'], url=EntityUrlMap.CONFIRMATION_ACCOUNT)
        confirmation_account_data = {'user_id': str(user.id),
                                     'user_email': user.user_email,
                                     'temporal_password': make_password(temporal_password),
                                     'account_status': Enums.FORCE_CHANGE_PASSWORD}
        try:
            json.loads(remote_model_confirmation.create(entity_data=confirmation_account_data).content)

            context = {'user': Munch(validated_data),
                       'temporal_password': temporal_password}
            send_email(file='welcome.html', send_to_list=[validated_data['user_email']], context=context,
                       subject=CustomMessages.WELCOME_USER)

            return user

        except Exception as exception:
            user.delete()
            raise GenericMicroserviceError(detail=exception.detail, status=exception.status_code)

    def update(self, instance, validated_data):
        inst_id = validated_data.get('inst_id', instance.inst_id)
        role_active = validated_data.get('role_active', instance.role_active)
        if role_active is not None:
            role = RoleSerializer.get_role_by_id(inst_id=inst_id, role_id=role_active)
            validated_data['user_role_structure'] = role['role_structure']
        return super().update(instance, validated_data)

    def get_user_roles(self, inst_id, role_id):
        try:
            users = UserModel.objects.filter(inst_id=inst_id, role_active=role_id)
            return users
        except UserModel.DoesNotExist:
            return []

    @staticmethod
    def get_user(inst_id, user_id, user_email):
        try:
            instance = UserModel.objects.get(inst_id=inst_id, id=user_id, user_email=user_email)
            serializer = UserSerializer(instance)
            return serializer.data
        except UserModel.DoesNotExist:
            return []

    @staticmethod
    def get_admins(inst_id, user_admin):
        try:
            instance = UserModel.objects.filter(inst_id=inst_id, user_admin=user_admin)
            serializer = UserSerializer(instance, many=True)
            return serializer.data
        except UserModel.DoesNotExist:
            return []


class ValidateUserRegularSerializer(serializers.Serializer):
    user_email = serializers.EmailField(required=True)
    user_password = serializers.CharField(required=True)

    def validate_user_regular(self):
        user_email = self.validated_data.get('user_email')
        user_password = self.validated_data.get('user_password')

        try:
            user_exist = UserModel.objects.get(user_email=user_email)
            if user_exist:
                if user_exist.user_provider == Enums.REGULAR_PROVIDER and not check_password(user_password,
                                                                                             user_exist.user_password):
                    raise GenericMicroserviceError(status=status.HTTP_400_BAD_REQUEST,
                                                   detail='Las credenciales son incorrectas')
                elif user_exist.user_provider == Enums.GOOGLE_PROVIDER:
                    raise GenericMicroserviceError(status=status.HTTP_400_BAD_REQUEST,
                                                   detail='No se encuentran coincidencias. '
                                                          '¡Revisa si estas registrado por google!')

                user_serializer = UserSerializer(user_exist).data
                return user_serializer

        except UserModel.DoesNotExist:
            raise GenericMicroserviceError(status=status.HTTP_404_NOT_FOUND,
                                           detail=Messages.INSTANCE_DOES_NOT_EXIST % 'El usuario ingresado')


class ValidateUserGoogleSerializer(serializers.Serializer):
    user_google = serializers.JSONField(required=True)

    def validate_google_user(self):
        user = self.validated_data.get('user_google')
        user_email = user['email'].lower()
        try:
            user_exist = UserModel.objects.get(user_email=user_email)
            user_serializer = UserSerializer(user_exist).data

            return user_serializer

        except UserModel.DoesNotExist:
            remote_model = RemoteModel(request=self.context['request'], url=EntityUrlMap.INSTITUTION)
            institution = json.loads(remote_model.get().content)['data'][0]
            user_id = uuid.uuid4()

            user_model = UserModel(id=user_id,
                                   inst_id=institution['id'],
                                   inst_name=institution['inst_name'],
                                   user_name=user['name'].title(),
                                   user_email=user_email,
                                   user_password=None,
                                   user_provider=Enums.GOOGLE_PROVIDER,
                                   user_role=[],
                                   user_role_structure=[],
                                   user_admin=False,
                                   user_photo=None,
                                   user_degree={},
                                   user_projects=[],
                                   user_skill=[],
                                   user_interest=[],
                                   user_country={'id': 48, 'name': 'Colombia', 'iso2': 'CO'},
                                   user_department={'id': 2877, 'name': 'Norte de Santander', 'iso2': 'NSA'},
                                   user_municipality={'id': 20772, 'name': 'Cúcuta'},
                                   user_status=Enums.ACTIVO)
            user_model.save()
            user_serializer = UserSerializer(user_model).data
            return user_serializer


class ChangePasswordSerializer(serializers.Serializer):
    user_id = serializers.UUIDField(required=False)
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def change_password(self):
        user_id = self.validated_data.get('user_id', None)
        current_password = self.validated_data.get('current_password')
        new_password = self.validated_data.get('new_password')

        try:
            if user_id is not None:
                user_exist = UserModel.objects.get(id=user_id)
                user_password = user_exist.user_password

                if not check_password(current_password, user_password):
                    raise GenericMicroserviceError(status=status.HTTP_400_BAD_REQUEST,
                                                   detail='La contraseña actual es incorrecta.')

                elif check_password(new_password, user_password):
                    raise GenericMicroserviceError(status=status.HTTP_400_BAD_REQUEST,
                                                   detail='La nueva contraseña debe ser diferente a la actual.')

                user_new_password = make_password(new_password)
                kwargs = {'user_password': user_new_password}
                user_update = UserSerializer(user_exist, data=kwargs, partial=True)
                user_update.is_valid(raise_exception=True)
                user_update.save()

        except UserModel.DoesNotExist:
            raise GenericMicroserviceError(status=status.HTTP_404_NOT_FOUND,
                                           detail='El usuario es inválido.')


class ForgotPasswordSerializer(serializers.Serializer):
    user = serializers.EmailField(required=True)
    confirmation_code = serializers.CharField(required=True)

    def forgot_password(self):
        user = self.validated_data.get('user')
        confirmation_code = self.validated_data.get('confirmation_code')
        try:
            user_exist = UserModel.objects.get(user_email=user)
            kwargs = {'user_password': confirmation_code}
            user_update = UserSerializer(user_exist, data=kwargs, partial=True)
            user_update.is_valid(raise_exception=True)
            user_update.save()
            return user_update.data

        except UserModel.DoesNotExist:
            raise GenericMicroserviceError(status=status.HTTP_404_NOT_FOUND,
                                           detail=Messages.INSTANCE_DOES_NOT_EXIST % 'El usuario')


class CascadeUpdateUserInstitution(serializers.Serializer):
    inst_id = serializers.UUIDField(required=True)
    inst_name = serializers.CharField(required=True)

    def cascade_update_user_institution(self):
        inst_id = self.validated_data.get('inst_id')
        inst_name = self.validated_data.get('inst_name')

        UserModel.objects.filter(inst_id=inst_id).update(inst_name=inst_name)
        FollowUserModel.objects.filter(inst_id_user=inst_id).update(inst_name_user=inst_name, inst_name_fous=inst_name)
