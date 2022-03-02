from django.conf.urls import url
from django.urls import include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import SimpleRouter

from asn_publication.settings import CONTEXT_PATH
from publication.views import PublicationView
from publication_user.views import PublicationUserView

schema_view = get_schema_view(
    openapi.Info(
        title="Publication",
        default_version='v1',
        description="Micro servicio para la gestión de las publicaciones"
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = SimpleRouter()
router.register('publication', PublicationView)
router.register('publication_user', PublicationUserView)

urlpatterns = [
    url(f'{CONTEXT_PATH}api/', include(router.urls)),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui')
]
