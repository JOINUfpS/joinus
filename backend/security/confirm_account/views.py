from common_structure_microservices.responses import response
from common_structure_microservices.view import CreateModelMixin, DestroyModelMixin, GenericViewSet
from rest_framework.decorators import action
from rest_framework.response import Response

from confirm_account.models import ConfirmAccountModel
from confirm_account.serializer import ConfirmAccountSerializer


class ConfirmAccountView(CreateModelMixin, DestroyModelMixin, GenericViewSet):
    queryset = ConfirmAccountModel.objects.all()
    serializer_class = ConfirmAccountSerializer

    @action(methods=['put'], url_path="confirming_account", detail=False, serializer_class=ConfirmAccountSerializer)
    def confirming_account(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(response(message=serializer.confirming_account()))
