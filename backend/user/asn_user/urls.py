from django.conf.urls import url
from django.urls import include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import SimpleRouter

from asn_user.settings import CONTEXT_PATH
from community.views import CommunityView
from community_user.views import CommunityUserView
from follow_user.views import FollowUserView
from invite_role.views import InviteRoleView
from module.views import ModuleView
from role.views import RoleView
from user.views import UserView

schema_view = get_schema_view(
    openapi.Info(
        title="User",
        default_version='v1',
        description="Micro servicio para la gestión de los Usuarios"
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = SimpleRouter()
router.register('follow_user', FollowUserView)
router.register('community', CommunityView)
router.register('community_user', CommunityUserView)
router.register('module', ModuleView)
router.register('invite_role', InviteRoleView)
router.register('role', RoleView)
router.register('user', UserView)

# Agregar tantas urls como vistas haya
urlpatterns = [
    url(f'{CONTEXT_PATH}api/', include(router.urls)),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui')
]
