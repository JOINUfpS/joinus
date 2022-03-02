from django import template
from django.template.defaultfilters import stringfilter

from asn_user.settings import Profiles
from common_structure_microservices.utilities import Constants, Enums

register = template.Library()


@register.filter(is_safe=True)
@stringfilter
def get_url_invite_take_role(value):
    config_profile = Profiles()

    if config_profile.PROFILE == Constants.DEVELOP:
        return f'{value}s://studentsprojects.cloud.ufps.edu.co/{Constants.FRONTEND_CONTEXT}'
    else:
        return f'{value}://localhost:4200/{Constants.FRONTEND_CONTEXT}'


@register.filter(is_safe=True)
@stringfilter
def get_url_request_role(context=None):
    config_profile = Profiles()
    url = 'http'
    if config_profile.PROFILE == Constants.DEVELOP:
        if context != Enums.STANDARD:
            url = url + f's://studentsprojects.cloud.ufps.edu.co/{Constants.FRONTEND_CONTEXT}/usuarios/comunidad/{context}'
        else:
            url = url + f's://studentsprojects.cloud.ufps.edu.co/{Constants.FRONTEND_CONTEXT}/usuarios/invitacion-de-rol'
    else:
        if context != Enums.STANDARD:
            url = url + f'://localhost:4200/usuarios/comunidad/{context}'
        else:
            url = url + f'://localhost:4200/usuarios/invitacion-de-rol'

    return url
