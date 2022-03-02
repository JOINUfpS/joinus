from django.conf.urls import url
from django.urls import include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import SimpleRouter

from asn_institution.settings import CONTEXT_PATH
from institution.views import InstitutionView
from opportunity.views import OpportunityView

schema_view = get_schema_view(
    openapi.Info(
        title="Institution",
        default_version='v1',
        description="Micro servicio para la gestión de las Instituciones"
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = SimpleRouter()
router.register('institution', InstitutionView)
router.register('opportunity', OpportunityView)

urlpatterns = [
    url(f'{CONTEXT_PATH}api/', include(router.urls)),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui')
]
