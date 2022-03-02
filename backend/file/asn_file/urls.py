from django.conf.urls import url
from django.urls import include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import SimpleRouter

from asn_file.settings import CONTEXT_PATH
from file.views import FileViewSet

schema_view = get_schema_view(
    openapi.Info(
        title="File",
        default_version='v1',
        description="Micro servicio para la gestión de las archivos"
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = SimpleRouter()
router.register(r'file', FileViewSet, basename='file')

urlpatterns = [
    url(f'{CONTEXT_PATH}api/', include(router.urls)),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui')
]
