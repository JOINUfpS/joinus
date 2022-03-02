from common_structure_microservices.view import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from message.models import MessageModel
from message.serializer import MessageSerializer


class MessageView(ModelViewSet):
    queryset = MessageModel.objects.all()
    serializer_class = MessageSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['id',
                        'conv_id',
                        'mess_author',
                        'mess_date',
                        'mess_content']

    ordering_fields = ['mess_date']

    ordering = ['mess_date']

    search_fields = ['id',
                     'conv_id',
                     'mess_author',
                     'mess_date',
                     'mess_content']
