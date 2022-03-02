from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from common_structure_microservices.view import ModelViewSet
from module.models import ModuleModel
from module.serializer import ModuleSerializer


class ModuleView(ModelViewSet):
    queryset = ModuleModel.objects.all()
    serializer_class = ModuleSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['modu_name',
                        'modu_is_generic']

    ordering_fields = ['modu_name']

    ordering = ['modu_name']

    search_fields = ['modu_name', ]
