from django import template
from django.template.defaultfilters import stringfilter

from asn_security.settings import Profiles
from common_structure_microservices.utilities import Constants

register = template.Library()


@register.filter(is_safe=True)
@stringfilter
def get_url_forgot_password(value):
    config_profile = Profiles()

    if config_profile.PROFILE == Constants.DEVELOP:
        return f'{value}s://studentsprojects.cloud.ufps.edu.co/{Constants.FRONTEND_CONTEXT}/recuperar-clave'
    else:
        return f'{value}://localhost:4200/recuperar-clave'
