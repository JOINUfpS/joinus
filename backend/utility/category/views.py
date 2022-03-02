from common_structure_microservices.utilities import Enums
from common_structure_microservices.view import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from category.cascade_task import CascadeUpdateTaskCategory
from category.models import CategoryModel
from category.serializer import CategorySerializer


class CategoryView(ModelViewSet):
    queryset = CategoryModel.objects.all()
    serializer_class = CategorySerializer
    cascade_update = CascadeUpdateTaskCategory()
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['inst_id',
                        'cate_name',
                        'cate_type',
                        'cate_status',
                        ]

    ordering_fields = ['cate_name']

    ordering = ['cate_name']

    search_fields = [
        'inst_id',
        'cate_name',
        'cate_type',
    ]

    def update(self, request, *args, **kwargs):
        cate_type = request.data['cate_type']
        if cate_type == Enums.COMMUNITY:
            self.cascade_update.cascade_action(request=request)
        return super().update(request, *args, **kwargs)
