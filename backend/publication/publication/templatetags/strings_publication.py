from common_structure_microservices.profiles import Profiles
from common_structure_microservices.utilities import Constants
from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()


@register.filter(is_safe=True)
@stringfilter
def get_url_publication(publ_id):
    config_profile = Profiles()

    if config_profile.PROFILE == Constants.DEVELOP:
        return f'https://studentsprojects.cloud.ufps.edu.co/{Constants.FRONTEND_CONTEXT}/publicaciones/publicacion/{publ_id}/'
    else:
        return f'http://localhost:4200/publicaciones/publicacion/{publ_id}/'
