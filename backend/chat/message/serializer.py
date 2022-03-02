import uuid
from datetime import datetime

from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.utilities import Constants
from rest_framework import serializers

from message.models import MessageModel


class MessageSerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    mess_date = serializers.DateTimeField(required=False, format=Constants.FORMAT_DATE_TIME_12,
                                          input_formats=(
                                              Constants.FORMAT_DATE_TIME_12,
                                              Constants.FORMAT_DATE_TIME_TIMEZONE_EN),
                                          default=datetime.now, allow_null=True)

    class Meta:
        model = MessageModel
        fields = ('id',
                  'conv_id',
                  'mess_author',
                  'mess_date',
                  'mess_content',)
