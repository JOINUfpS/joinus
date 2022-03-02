import os

import django
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

import asn_notification

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "asn_notification.settings")
django.setup()
application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(
            asn_notification.urls.websocket_urlpatterns
        )
    ),
})
