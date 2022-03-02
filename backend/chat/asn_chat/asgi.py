import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

import asn_chat

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'asn_chat.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            asn_chat.urls.websocket_urlpatterns
        )
    ),
})
