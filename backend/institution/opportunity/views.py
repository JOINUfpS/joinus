from common_structure_microservices.messages import Messages
from common_structure_microservices.responses import response
from common_structure_microservices.view import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from opportunity.models import OpportunityModel
from opportunity.serializer import OpportunitySerializer, ApplyOpportunitySerializer, UserOpportunitySavedSerializer, \
    CascadeUpdateTaskUserOpportunity, CascadeDeleteTaskUserOpportunity


class OpportunityView(ModelViewSet):
    queryset = OpportunityModel.objects.all()
    serializer_class = OpportunitySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['inst_id',
                        'user_id',
                        'user_name',
                        'oppo_title']

    ordering_fields = ['oppo_title', 'created_date']

    ordering = ['created_date']

    search_fields = ['user_name',
                     'oppo_title',
                     'oppo_employer_email',
                     'oppo_type_contract',
                     'oppo_remuneration']

    @action(methods=['post'], url_path="apply_opportunity", detail=False, serializer_class=ApplyOpportunitySerializer)
    def apply_opportunity(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(message=serializer.apply_opportunity()))

    @action(methods=['get'], url_path="user_opportunity_saved/(?P<inst_id>[^/.]+)/(?P<user_id>[^/.]+)", detail=False,
            serializer_class=UserOpportunitySavedSerializer, filter_backends=[], pagination_class=None)
    def user_opportunity_saved(self, request, inst_id, user_id, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(data=serializer.user_opportunity_saved(inst_id=inst_id, user_id=user_id)))

    @action(methods=['put'], url_path="cascade_update_user", detail=False,
            serializer_class=CascadeUpdateTaskUserOpportunity)
    def cascade_update_user_opportunity(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.cascade_update_user_opportunity()
        return Response(response(message=Messages.UPDATED_SUCCESSFULLY))

    @action(methods=['delete'], url_path="cascade_delete_user/(?P<user_id>[^/.]+)", detail=False,
            serializer_class=CascadeDeleteTaskUserOpportunity)
    def cascade_delete_user_opportunity(self, request, user_id, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.cascade_delete_user_opportunity(user_id=user_id)
        return Response(response(message=Messages.DELETED_SUCCESSFULLY))
