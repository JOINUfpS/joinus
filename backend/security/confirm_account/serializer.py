import datetime
import json
import uuid

from common_structure_microservices.entity_url import EntityUrlMap
from common_structure_microservices.exception import GenericMicroserviceError
from common_structure_microservices.remote import RemoteModel
from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.utilities import Enums
from django.contrib.auth.hashers import check_password, make_password
from rest_framework import serializers, status

from asn_security.execption import ConfirmationTimeExpiredException, TemporaryPasswordNotCorrectException
from asn_security.messages import CustomMessages
from confirm_account.models import ConfirmAccountModel


class ConfirmAccountSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    user_id = serializers.UUIDField(required=False, allow_null=True)
    user_password = serializers.CharField(required=False, write_only=True)
    temporal_password = serializers.CharField(write_only=True)
    account_status = serializers.ChoiceField(required=False, choices=Enums.LIST_ACCOUNT_CONFIRMATION,
                                             default=Enums.FORCE_CHANGE_PASSWORD)
    created_date = serializers.DateTimeField(required=False, default=datetime.datetime.now)

    class Meta:
        model = ConfirmAccountModel
        fields = ('id',
                  'user_id',
                  'user_email',
                  'user_password',
                  'temporal_password',
                  'account_status',
                  'created_date')

    def confirming_account(self):

        user_email = self.validated_data.get('user_email')
        temporal_password = self.validated_data.get('temporal_password')
        user_password = self.validated_data.get('user_password')
        today = datetime.datetime.now(datetime.timezone.utc)

        try:
            confirm_account = ConfirmAccountModel.objects.get(user_email=user_email)
            result = (today - confirm_account.created_date)
            if result.days == 7:
                confirm_account.delete()
                raise ConfirmationTimeExpiredException

            if not check_password(temporal_password, confirm_account.temporal_password):
                raise TemporaryPasswordNotCorrectException

            remote_model = RemoteModel(request=self.context['request'], url=EntityUrlMap.USER)
            user = {
                'user_email': confirm_account.user_email,
                'user_password': make_password(user_password),
                'user_status': Enums.ACTIVO
            }
            user_response_raw = remote_model.retrive(entity_id=confirm_account.user_id, entity_data=user)
            user_response_json = json.loads(user_response_raw.content)
            user_response = user_response_json.get('data', None)

            if user_response is None:
                raise GenericMicroserviceError(detail=user_response_raw.detail, status=user_response_raw.status_code)

            confirm_account.delete()

            return CustomMessages.ACCOUNT_CONFIRMED_SUCCESSFULLY

        except ConfirmAccountModel.DoesNotExist:
            raise GenericMicroserviceError(detail=CustomMessages.ACCOUNT_DOES_NOT_EXIST,
                                           status=status.HTTP_404_NOT_FOUND)
