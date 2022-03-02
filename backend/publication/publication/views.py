from common_structure_microservices.messages import Messages
from common_structure_microservices.responses import response
from common_structure_microservices.view import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response

from publication.cascade_update import CascadeUpdateTaskPublication
from publication.models import PublicationModel
from publication.serializer import PublicationSerializer, SendFullTextSerializer, SharePublicationSerializer, \
    InterestPublicationSerializer, CascadeUpdateTaskPublicationCommunity, CascadeUpdateTaskPublicationUser, \
    CascadeUpdateTaskUserProject


class PublicationView(ModelViewSet):
    queryset = PublicationModel.objects.all()
    serializer_class = PublicationSerializer
    cascade_update = CascadeUpdateTaskPublication()
    lookup_field = 'id'
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['user_id',
                        'inst_id',
                        'comm_id',
                        'cate_name',
                        'publ_full_text',
                        'publ_standard',
                        'publ_privacy',
                        'publ_project_id'
                        ]

    ordering_fields = ['publ_date',
                       'created_date']

    ordering = ['publ_date']

    search_fields = ['user_name',
                     'publ_title',
                     'cate_name',
                     'comm_name',
                     'publ_link_doi']

    def update(self, request, *args, **kwargs):
        result = super().update(request, *args, **kwargs)
        self.cascade_update.cascade_action(request=request)
        return result

    @action(methods=['post'], url_path="send_full_text", detail=False, serializer_class=SendFullTextSerializer)
    def send_full_text(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(message=serializer.send_full_text()))

    @action(methods=['post'], url_path="share", detail=False, serializer_class=SharePublicationSerializer)
    def share_publication(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(message=serializer.share_publication()))

    @action(methods=['post'], url_path="interest", detail=False, serializer_class=InterestPublicationSerializer)
    def interest_publication(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(message=serializer.interest_publication()))

    @action(methods=['put'], url_path="cascade_update_community", detail=False,
            serializer_class=CascadeUpdateTaskPublicationCommunity)
    def cascade_update_community(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(message=serializer.cascade_update_community()))

    @action(methods=['put'], url_path="cascade_update_user", detail=False,
            serializer_class=CascadeUpdateTaskPublicationUser)
    def cascade_update_user(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.cascade_update_user()
        return Response(response(message=Messages.UPDATED_SUCCESSFULLY))

    @action(methods=['get'],
            url_path="public_related/(?P<publication_id>[^/.]+)/(?P<project_id>[^/.]+)/(?P<show_privates>[^/.]+)",
            detail=False,
            serializer_class=PublicationSerializer, filter_backends=[], pagination_class=None)
    def publication_related(self, request, publication_id, project_id, show_privates, *args, **kwargs):
        show_privates = show_privates == 'true'
        serializer = self.get_serializer().get_publication_related(publication_id=publication_id, project_id=project_id,
                                                                   show_privates=show_privates)
        return Response(response(data=serializer))

    @action(methods=['put'], url_path="cascade_update_user_project", detail=False,
            serializer_class=CascadeUpdateTaskUserProject)
    def cascade_update_user_project(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.cascade_update_user_project()
        return Response(response(message=Messages.UPDATED_SUCCESSFULLY))
