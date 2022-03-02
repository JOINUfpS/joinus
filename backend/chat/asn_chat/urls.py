from django.conf.urls import url
from django.urls import include, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import SimpleRouter

from asn_chat.settings import CONTEXT_PATH
from conversation import chat_consumer
from conversation.views import ConversationView
from message.views import MessageView

schema_view = get_schema_view(
    openapi.Info(
        title="Chat",
        default_version='v1',
        description="Micro servicio para la gestión de los chats"
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = SimpleRouter()
router.register('conversation', ConversationView)
router.register('message', MessageView)

urlpatterns = [
    url(f'{CONTEXT_PATH}api/', include(router.urls)),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

websocket_urlpatterns = [
    re_path(r'wss/conversation/(?P<room_name>[0-9A-Fa-f-]+)/$', chat_consumer.ChatConsumer.as_asgi()),
]
