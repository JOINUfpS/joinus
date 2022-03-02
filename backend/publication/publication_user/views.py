from common_structure_microservices.view import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from publication_user.models import PublicationUserModel
from publication_user.serializer import PublicationUserSerializer


class PublicationUserView(ModelViewSet):
    queryset = PublicationUserModel.objects.all()
    serializer_class = PublicationUserSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['user_id', 'publ_id']

    ordering_fields = ['created_date']

    ordering = ['created_date']

    search_fields = ['publ_user_name',
                     'comm_name', ]
