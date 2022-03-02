import json
from datetime import datetime

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from message.models import MessageModel
from message.serializer import MessageSerializer


class MessageTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8097/chats/api/message/'
    user_name = 'Paola Pájaro'

    def setUp(self):
        self.client = APIClient()
        message = MessageModel(
            conv_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            mess_author='fa33a783-bd89-46e1-9306-6839dc141b05',
            mess_date=datetime.now(),
            mess_content='Estos son los ultimos pasos a dar en esta interminable tesis de grado')
        message.save()
        self.mess_id = message.id

    def test_get_message_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        messages = MessageModel.objects.all()
        serializer = MessageSerializer(messages, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_message(self):
        test_message = {'conv_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                        'mess_author': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'mess_date': '28-09-2021 12:01 PM',
                        'mess_content': 'Estos son los ultimos pasos a dar en esta interminable tesis de grado, gracias'}

        response = self.client.post(path=self.URL, data=test_message, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('conv_id', result)
        self.assertIn('mess_author', result)
        self.assertIn('mess_date', result)
        self.assertIn('mess_content', result)

        if 'id' in result:
            del result['id']

        self.assertEqual(result, test_message)

    def test_get_by_id_message(self):
        response = self.client.get(f'{self.URL}{self.mess_id}/', format='json')
        result = json.loads(response.content)['data']

        message = MessageModel.objects.get(id=self.mess_id)
        serializer = MessageSerializer(message)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_message(self):
        tests_update = {'conv_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                        'mess_author': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'mess_date': '29-09-2021 01:10 PM',
                        'mess_content': 'Estos son los ultimos pasos a dar en esta interminable tesis de grado '
                                        'llamada Joinufps'}

        response = self.client.put(path=f'{self.URL}{self.mess_id}/', data=tests_update, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if 'id' in result:
            del result['id']

        self.assertEqual(result, tests_update)

    def test_delete_message(self):
        response = self.client.delete(f'{self.URL}{self.mess_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        message_exists = MessageModel.objects.filter(id=self.mess_id)
        self.assertFalse(message_exists)
