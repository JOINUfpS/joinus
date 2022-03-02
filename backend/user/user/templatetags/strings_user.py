from django import template
from django.template.defaultfilters import stringfilter

from asn_user.settings import Profiles
from common_structure_microservices.utilities import Constants

register = template.Library()


@register.filter(is_safe=True)
@stringfilter
def get_url_confirm_account(value):
    config_profile = Profiles()

    if config_profile.PROFILE == Constants.DEVELOP:
        return f'{value}s://studentsprojects.cloud.ufps.edu.co/{Constants.FRONTEND_CONTEXT}/confirmar-cuenta'
    else:
        return f'{value}://localhost:4200/confirmar-cuenta'


@register.filter(is_safe=True)
@stringfilter
def get_url_about_us(value):
    config_profile = Profiles()

    if config_profile.PROFILE == Constants.DEVELOP:
        return f'{value}s://studentsprojects.cloud.ufps.edu.co/{Constants.FRONTEND_CONTEXT}/acerca-de-nosotros'
    else:
        return f'{value}://localhost:4200/acerca-de-nosotros'
