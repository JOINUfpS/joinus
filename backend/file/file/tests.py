import json
import uuid
from tempfile import NamedTemporaryFile

from PIL import Image
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from file.models import FileModel
from file.serializer import FileActionsSerializer


class FileManagersAPITestCase(APITestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8096/files/api/file/'
    bucket = str(uuid.uuid4())

    def setUp(self):
        self.client = APIClient()
        file = FileModel(id='00e18e60-bca1-4fe4-b2f3-1ec0813fabae',
                         inst_id='bae9820f-ef39-4224-9a6a-f3431b2ad1c2',
                         file_extension='jpg',
                         file_path=r'c:\tesis-asn')
        file.save()
        self.file_id = file.id

    def test_get_object(self):
        response = self.client.get(f'{self.URL}get_object/{self.file_id}/',
                                   format='multipart')
        result = response.content
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(result, bytes)
        self.assertIsNotNone(result)

    def test_get_object_does_not_exist(self):
        response = self.client.get(f'{self.URL}get_object/f9dabf5b-954c-46b7-b20a-1df80f5b8310/', format='multipart')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_put_objects(self):
        image = Image.new('RGB', (100, 100))
        tmp_file = NamedTemporaryFile(suffix='.jpg')
        image.save(tmp_file)
        tmp_file.seek(0)
        image_send = {'file_content': tmp_file,
                      'inst_id': 'bae9820f-ef39-4224-9a6a-f3431b2ad1c2'}
        response = self.client.put(path=f'{self.URL}put_object/', data=image_send, format='multipart')

        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(result)


class FileManagersTestCase(TestCase):
    file_serializer = FileActionsSerializer()
    inst_id = 'bae9820f-ef39-4224-9a6a-f3431b2ad1c2'

    def setUp(self):
        self.client = APIClient()
        file = FileModel(id='00e18e60-bca1-4fe4-b2f3-1ec0813fabae',
                         inst_id='bae9820f-ef39-4224-9a6a-f3431b2ad1c2',
                         file_extension='jpg',
                         file_path=r'c:\tesis-asn')
        file.save()
        self.file_id = file.id

    def test_get_object(self):
        result = self.file_serializer.get_object(self.file_id)
        self.assertIsNotNone(result)

    def test_put_objects(self):
        image = Image.new('RGB', (100, 100))
        tmp_file = NamedTemporaryFile(suffix='.jpg')
        image.save(tmp_file)
        tmp_file.seek(0)
        file = {'file_content': tmp_file,
                'inst_id': self.inst_id}

        result = self.file_serializer.put_object(file)
        self.assertIn('id', result)
        self.assertIn('fileType', result)
