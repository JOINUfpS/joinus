from django.conf.urls import url
from django.urls import include, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import SimpleRouter

from asn_notification.settings import CONTEXT_PATH
from notification import notification_consumer
from notification.views import NotificationView

schema_view = get_schema_view(
    openapi.Info(
        title="Notification",
        default_version='v1',
        description="Micro servicio para la gestión de las notificaciones"
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = SimpleRouter()
router.register('notification', NotificationView)

# Agregar tantas urls como vistas haya
urlpatterns = [
    url(f'{CONTEXT_PATH}api/', include(router.urls)),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui')
]

websocket_urlpatterns = [
    re_path(r'wss/noti_individual/(?P<receiver_id>[0-9A-Fa-f-]+)/$',
            notification_consumer.NotificationConsumer.as_asgi()),
]
