from common_structure_microservices.view import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from university_career.models import UniversityCareerModel
from university_career.serializer import UniversityCareerSerializer


class UniversityCareerView(ModelViewSet):
    queryset = UniversityCareerModel.objects.all()
    serializer_class = UniversityCareerSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['id',
                        'career_name',
                        ]

    ordering_fields = ['career_name']

    ordering = ['career_name']

    search_fields = [
        'career_name'
    ]
