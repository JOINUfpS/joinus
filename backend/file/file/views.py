from django.http import HttpResponse
from common_structure_microservices.messages import Messages
from common_structure_microservices.responses import response
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from file.serializer import FileActionsSerializer


class FileViewSet(viewsets.GenericViewSet):
    parser_classes = (MultiPartParser, FormParser,)

    @action(methods=['GET'], url_path="get_object/(?P<file_id>[^/.]+)", detail=False,
            serializer_class=FileActionsSerializer, pagination_class=None)
    def get_object(self, request, file_id):
        serializer = self.get_serializer(data=request.data)
        image, extension = serializer.get_object(file_id=file_id)
        return HttpResponse(image, content_type=extension)

    @action(methods=['PUT'], url_path="put_object", detail=False,
            serializer_class=FileActionsSerializer)
    def put_objects(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(data=serializer.put_object(request.data), message=Messages.CREATED_SUCCESSFULLY))
