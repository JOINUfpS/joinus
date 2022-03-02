from common_structure_microservices.messages import Messages
from common_structure_microservices.responses import response
from common_structure_microservices.view import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from conversation.models import ConversationModel
from conversation.serializer import ConversationSerializer, SendMessageSerializer, CascadeUpdateTaskUserConversation, \
    DeleteConversation


class ConversationView(ModelViewSet):
    queryset = ConversationModel.objects.all()
    serializer_class = ConversationSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = [
        'conv_user_emisor_id',
        'conv_user_receiver_id',
        'conv_is_bidirectional',
        'conv_user_emisor_name',
        'conv_user_receiver_name',
        'conv_user_emisor_email',
        'conv_user_receiver_email',
    ]

    ordering_fields = []

    ordering = []

    search_fields = [
        'conv_user_emisor_name',
        'conv_user_receiver_name',
        'conv_user_emisor_email',
        'conv_user_receiver_email', ]

    @action(methods=['post'], url_path="send_message", detail=False,
            serializer_class=SendMessageSerializer)
    def send_message(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(data=serializer.send_message(request)))

    @action(methods=['put'], url_path="cascade_update_user", detail=False,
            serializer_class=CascadeUpdateTaskUserConversation)
    def cascade_update_user_conversation(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.cascade_update_user_conversation()
        return Response(response(message=Messages.UPDATED_SUCCESSFULLY))

    @action(methods=['delete'], url_path="delete_conversation/(?P<user_session>[^/.]+)/(?P<conv_id>[^/.]+)",
            detail=False, serializer_class=DeleteConversation)
    def delete_conversation(self, request, user_session, conv_id, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(message=serializer.delete_conversation(user_session, conv_id)))
