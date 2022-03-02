import json

from common_structure_microservices.messages import Messages
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from asn_chat.messages import CustomMessages
from conversation.models import ConversationModel
from conversation.serializer import ConversationSerializer


class ConversationTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8097/chats/api/conversation/'
    user_email = 'juanfernandoro@ufps.edu.co'
    user_name = 'Paola Pájaro'
    user_emisor_name = 'Fernando Romero'
    receiver_email = 'yindypaolapu@ufps.edu.co'
    other_user_name = 'Eduardo Pájaro'
    other_user_email = 'eduardojosepc@ufps.edu.co'

    def setUp(self):
        self.client = APIClient()
        conversation = ConversationModel(
            conv_user_emisor_id='fa33a783-bd89-46e1-9306-6839dc141b05',
            conv_user_receiver_id='7833a783-bd89-46e1-9306-6839dd141405',
            conv_user_emisor_photo_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            conv_user_receiver_photo_id='3fa85f64-5717-4562-b3fc-2c963f66afa7',
            conv_user_emisor_name=self.user_emisor_name,
            conv_user_receiver_name=self.user_name,
            conv_user_emisor_email=self.user_email,
            conv_user_receiver_email=self.receiver_email,)
        conversation.save()
        self.conv_id = conversation.id

    def test_get_conversation_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        conversations = ConversationModel.objects.all()
        serializer = ConversationSerializer(conversations, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_conversation(self):
        test_conversation = {'conv_user_emisor_id': 'fa33a783-bd89-46e2-9306-6839dc141b05',
                             'conv_user_receiver_id': '7833a783-bd89-46e1-9306-6839dd141405',
                             'conv_is_bidirectional': True,
                             'conv_user_emisor_photo_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                             'conv_user_receiver_photo_id': '3fa85f64-5717-4562-b3fc-2c963f66afa7',
                             'conv_user_emisor_name': 'Fernando Romerp',
                             'conv_user_receiver_name': self.other_user_name,
                             'conv_user_emisor_email': self.user_email,
                             'conv_user_receiver_email': self.other_user_email}

        response = self.client.post(path=self.URL, data=test_conversation, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('conv_user_emisor_id', result)
        self.assertIn('conv_user_receiver_id', result)
        self.assertIn('conv_is_bidirectional', result)
        self.assertIn('conv_user_emisor_photo_id', result)
        self.assertIn('conv_user_receiver_photo_id', result)
        self.assertIn('conv_user_emisor_name', result)
        self.assertIn('conv_user_receiver_name', result)
        self.assertIn('conv_user_emisor_email', result)
        self.assertIn('conv_user_receiver_email', result)

        if 'id' in result:
            del result['id']

        self.assertEqual(result, test_conversation)

    def test_create_conversation_with_emisor(self):
        test_conversation = {'conv_user_emisor_id': '7833a783-bd89-46e1-9306-6839dd141405',
                             'conv_user_receiver_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                             'conv_is_bidirectional': True,
                             'conv_user_emisor_photo_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                             'conv_user_receiver_photo_id': '3fa85f64-5717-4562-b3fc-2c963f66afa7',
                             'conv_user_emisor_name': 'Fernando Romerp',
                             'conv_user_receiver_name': self.other_user_name,
                             'conv_user_emisor_email': self.user_email,
                             'conv_user_receiver_email': self.other_user_email}

        response = self.client.post(path=self.URL, data=test_conversation, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_by_id_conversation(self):
        response = self.client.get(f'{self.URL}{self.conv_id}/', format='json')
        result = json.loads(response.content)['data']

        conversation = ConversationModel.objects.get(id=self.conv_id)
        serializer = ConversationSerializer(conversation)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_conversation(self):
        tests_update = {'conv_user_emisor_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'conv_user_receiver_id': '7833a783-bd89-46e1-9306-6839dd141405',
                        'conv_is_bidirectional': False,
                        'conv_user_emisor_photo_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                        'conv_user_receiver_photo_id': '3fa85f64-5717-4562-b3fc-2c963f66afa7',
                        'conv_user_emisor_name': 'Fernando Romero Ortega',
                        'conv_user_receiver_name': self.other_user_name,
                        'conv_user_emisor_email': self.user_email,
                        'conv_user_receiver_email': self.other_user_email, }

        response = self.client.put(path=f'{self.URL}{self.conv_id}/', data=tests_update, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if 'id' in result:
            del result['id']

        self.assertEqual(result, tests_update)

    def test_delete_conversation(self):
        response = self.client.delete(f'{self.URL}{self.conv_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        conversation_exists = ConversationModel.objects.filter(id=self.conv_id)
        self.assertFalse(conversation_exists)

    def test_send_message(self):
        tests_update = {'conv_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'user_emisor': {'id': '7833a783-bd89-46e1-9306-6839dd141405',
                                        'user_photo': None,
                                        'user_name': self.user_name,
                                        'user_email': self.user_email},
                        'user_receiver': {'id': '5f64-5717-4562-b3fc-2c963f66afa61405',
                                          'fous_user_id': '0b05ce59-09ff-4e57-a7eb-11bf05f5863e',
                                          'fous_photo': None,
                                          'fous_email': self.user_email,
                                          'name_fous': self.user_emisor_name},
                        'mess_content': 'Este es un mensaje de prueba para el chat'}

        response = self.client.post(path=f'{self.URL}send_message/', data=tests_update, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_send_message_without_id_conversation(self):
        tests_update = {'user_emisor': {'id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                                        'user_photo': None,
                                        'user_name': self.user_name,
                                        'user_email': self.user_email},
                        'user_receiver': {'id': '5f64-5717-4562-b3fc-2c963f66afa61405',
                                          'fous_user_id': '7833a783-bd89-46e1-9306-6839dd141405',
                                          'fous_photo': None,
                                          'fous_email': self.user_email,
                                          'name_fous': self.user_emisor_name},
                        'mess_content': 'Este es un mensaje de prueba para el chat'}

        response = self.client.post(path=f'{self.URL}send_message/', data=tests_update, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        result_id = json.loads(response.content)['data']['conv_id']
        conversation_exists = ConversationModel.objects.filter(id=result_id)
        self.assertTrue(conversation_exists)

    def test_cascade_update_user_conversation(self):
        json_update = {'user_id': '7833a783-bd89-46e1-9306-6839dd141405',
                       'user_name': self.user_name,
                       'user_photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                       'user_email': self.user_email}

        response = self.client.put(path=f'{self.URL}cascade_update_user/', data=json_update, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], Messages.UPDATED_SUCCESSFULLY)

    def test_delete_conversation_by_conv_user_receiver_id(self):
        response = self.client.delete(
            f'{self.URL}delete_conversation/7833a783-bd89-46e1-9306-6839dd141405/{self.conv_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        conversation_exists = ConversationModel.objects.filter(id=self.conv_id)
        self.assertFalse(conversation_exists)

    def test_delete_conversation_by_conv_user_emisor_id(self):
        response = self.client.delete(
            f'{self.URL}delete_conversation/fa33a783-bd89-46e2-9306-6839dc141b05/{self.conv_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        conversation_exists = ConversationModel.objects.filter(id=self.conv_id)
        self.assertFalse(conversation_exists)

    def test_delete_conversation_by_myself(self):
        conversation = ConversationModel(
            conv_user_emisor_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            conv_user_receiver_id='3fa85f64-5727-4562-b3fc-2c963f66afa7',
            conv_is_bidirectional=True,
            conv_user_emisor_photo_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            conv_user_receiver_photo_id='3fa85f64-5717-4562-b3fc-2c963f66afa7',
            conv_user_emisor_name=self.user_name,
            conv_user_receiver_name=self.user_name,
            conv_user_emisor_email=self.receiver_email,
            conv_user_receiver_email=self.receiver_email)
        conversation.save()

        response = self.client.delete(
            f'{self.URL}delete_conversation/3fa85f64-5717-4562-b3fc-2c963f66afa6/{conversation.id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data["message"], CustomMessages.DELETE_CONVERSATION_MESSAGE)