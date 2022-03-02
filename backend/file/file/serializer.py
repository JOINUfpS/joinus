import os
import uuid

from common_structure_microservices.exception import GenericMicroserviceError
from common_structure_microservices.utilities import Enums, Constants
from django.core.files.storage import FileSystemStorage
from rest_framework import serializers, status

from asn_file.messages import CustomMessages
from asn_file.settings import operating_system
from file.models import FileModel


class FileActionsSerializer(serializers.Serializer):
    file_id = serializers.UUIDField(read_only=True, default=uuid.uuid4)
    file_content = serializers.FileField(required=True)
    inst_id = serializers.UUIDField(required=True)

    def get_object(self, file_id):
        content_type = 'application/json'

        try:
            file = FileModel.objects.get(id=file_id)
            if file:
                if file.file_extension in Enums.TYPE_FILE:
                    content_type = self.content_type_mapper(file.file_extension)
                path = f'{file.file_path}/{file_id}.{file.file_extension}'
                file = open(path, 'rb').read()
            else:
                raise FileModel.DoesNotExist
            return file, content_type
        except FileModel.DoesNotExist:
            raise GenericMicroserviceError(status=status.HTTP_404_NOT_FOUND, detail=CustomMessages.FILE_NOT_FOUND)

    def put_object(self, request):
        path = ''
        if operating_system == Constants.WINDOWS:
            path = os.path.abspath(os.sep) + CustomMessages.ROOT_DIR
        elif operating_system == Constants.LINUX:
            path = os.path.abspath(os.sep) + CustomMessages.ROOT_DIR
        elif operating_system == Constants.MACOS:
            path = os.path.abspath(os.sep) + '/Users/fernando.romero/' + CustomMessages.ROOT_DIR

        file = request.get('file_content')
        inst_id = request.get('inst_id')

        try:
            if not os.path.exists(path):
                os.mkdir(path, mode=0o777)
            ext = file.name.split(".")
            extension = ext.pop().lower()
            file_id = uuid.uuid4()
            file_system = FileSystemStorage()
            file_system.base_location = path
            file_system.save(f'{file_id}.{extension}', file)
            file = FileModel(id=file_id,
                             inst_id=inst_id,
                             file_extension=extension,
                             file_path=path)
            file.save()

            data = {"id": file_id,
                    "fileType": self.content_type_mapper(file.file_extension)}
            return data
        except OSError:
            raise GenericMicroserviceError(status=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=CustomMessages.OS_ERROR)

    def content_type_mapper(self, file_extension):

        content_type = {
            'pdf': Enums.CONTENT_FILE,
            'mp4': Enums.CONTENT_VIDEO,
            'png': Enums.CONTENT_IMAGE,
            'jpg': Enums.CONTENT_IMAGE,
            'jpeg': Enums.CONTENT_IMAGE,
        }

        return content_type.get(file_extension)
