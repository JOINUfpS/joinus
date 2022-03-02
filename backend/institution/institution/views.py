import json

from common_structure_microservices.entity_url import EntityUrlMap
from common_structure_microservices.exception import GenericMicroserviceError
from common_structure_microservices.remote import RemoteModel
from common_structure_microservices.view import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.filters import SearchFilter, OrderingFilter

from asn_institution.messages import CustomMessages
from institution.cascade_update import CascadeUpdateTaskInstitution
from institution.models import InstitutionModel
from institution.serializer import InstitutionSerializer


class InstitutionView(ModelViewSet):
    queryset = InstitutionModel.objects.all()
    serializer_class = InstitutionSerializer
    cascade_update = CascadeUpdateTaskInstitution()
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['inst_name',
                        'inst_address',
                        'inst_country',
                        'inst_department',
                        'inst_municipality',
                        'inst_head', ]

    ordering_fields = ['inst_name']

    ordering = ['inst_name']

    search_fields = ['inst_name',
                     'inst_address',
                     'inst_country',
                     'inst_department',
                     'inst_municipality',
                     'inst_head', ]

    def update(self, request, *args, **kwargs):
        self.cascade_update.cascade_action(request=request)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        remote_model = RemoteModel(request=request, url=EntityUrlMap.USER)
        params = {'inst_id': f'{instance.id}'}
        users = json.loads(remote_model.filter(**params).content)
        if users['paginator']['count'] > 0:
            raise GenericMicroserviceError(status=status.HTTP_400_BAD_REQUEST,
                                           detail=CustomMessages.INSTITUTION_CANNOT_BE_REMOVED)
        else:
            return super().destroy(request, *args, **kwargs)
