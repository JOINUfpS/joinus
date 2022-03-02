import json
from datetime import datetime

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from asn_notification.messages import CustomMessages
from notification.models import NotificationModel
from notification.serializer import NotificationSerializer


class NotificationTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8098/notifications/api/notification/'
    noti_path = 'tesis_asn/publications/'
    noti_author_name = 'Paola Pájaro'
    noti_issue = 'le ha dado me interesa a la publicación'
    noti_destination_name = '¿como sedudir a una mujer y no morir en el intento?'

    def setUp(self):
        self.client = APIClient()
        notification = NotificationModel(
            noti_is_read=False,
            noti_date=datetime.now(),
            noti_receiver_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            noti_path=self.noti_path,
            noti_type='publication',
            noti_author_id='fa33a783-bd89-46e1-9306-6839dc141b05',
            noti_author_name=self.noti_author_name,
            noti_author_photo='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            noti_issue=self.noti_issue,
            noti_destination_name=self.noti_destination_name, )
        notification.save()
        self.noti_id = notification.id

    def test_get_notification_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        categories = NotificationModel.objects.all()
        serializer = NotificationSerializer(categories, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_notification(self):
        test_notification = {
            'noti_is_read': False,
            'noti_date': '15-01-2021 04:05 PM',
            'noti_receiver_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            'noti_path': self.noti_path,
            'noti_type': 'publication',
            'noti_author_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
            'noti_author_name': self.noti_author_name,
            'noti_author_photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            'noti_issue': self.noti_issue,
            'noti_destination_name': self.noti_destination_name,
        }

        response = self.client.post(path=self.URL, data=test_notification, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('noti_is_read', result)
        self.assertIn('noti_date', result)
        self.assertIn('noti_receiver_id', result)
        self.assertIn('noti_path', result)
        self.assertIn('noti_type', result)
        self.assertIn('noti_author_id', result)
        self.assertIn('noti_author_name', result)
        self.assertIn('noti_author_photo', result)
        self.assertIn('noti_issue', result)
        self.assertIn('noti_destination_name', result)

        if 'id' in result:
            del result['id']

        self.assertEqual(result, test_notification)

    def test_get_by_id_notification(self):
        response = self.client.get(f'{self.URL}{self.noti_id}/', format='json')
        result = json.loads(response.content)['data']

        notification = NotificationModel.objects.get(id=self.noti_id)
        serializer = NotificationSerializer(notification)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_notification(self):
        tests_update = {
            'noti_is_read': True,
            'noti_date': '15-01-2021 04:05 PM',
            'noti_receiver_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            'noti_path': self.noti_path,
            'noti_type': 'publication',
            'noti_author_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
            'noti_author_name': self.noti_author_name,
            'noti_author_email': '',
            'noti_author_photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            'noti_issue': self.noti_issue,
            'noti_destination_name': self.noti_destination_name
        }
        response = self.client.put(path=f'{self.URL}{self.noti_id}/', data=tests_update, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if 'id' in result:
            del result['id']

        self.assertEqual(result, tests_update)

    def test_delete_notification(self):
        response = self.client.delete(f'{self.URL}{self.noti_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        notification_exists = NotificationModel.objects.filter(id=self.noti_id)
        self.assertFalse(notification_exists)

    def test_notification_delete_invitation_community(self):
        notification_delete = {'noti_receiver_id': 'fa33a783-bd89-46e1-9306-6839dc141b09',
                               'noti_author_id': '3fa85f64-5717-4562-b3fc-2c963f66afa4',
                               'noti_author_name': self.noti_author_name}

        response = self.client.post(f'{self.URL}delete_invitation_community/', data=notification_delete, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], CustomMessages.DELETE_NOTIFICATION)

    def test_notify_community_invitation(self):
        notication_community = {"noti_author_name": "Fernando Romero",
                                "noti_community": {
                                    'id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                                    'name': 'Silux',
                                    'photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6'
                                },
                                "noti_inviteds": [{'id': '41a85f64-5717-4562-b3fc-2c963f66af89',
                                                   'userName': 'Paola pájaro',
                                                   'userDegree': 'Ingeniera de sistemas',
                                                   'userPhoto': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                                                   'isMember': False, }]
                                }
        response = self.client.post(path=f'{self.URL}notify_community_invitation/', data=notication_community,
                                    format='json')
        self.assertEqual(response.data["message"], CustomMessages.INVITATIONS_BEEN_SENT)

    def test_notify_new_publication_community(self):
        notification_publication = {'noti_members': ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
                                    'noti_author_id': '0b05ce59-09ff-4e57-a7eb-11bf05f5863e',
                                    'noti_author_name': self.noti_author_name,
                                    'noti_author_photo': None,
                                    'noti_comm_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                                    'noti_comm_name': 'Comunidad de prueba'}
        response = self.client.post(path=f'{self.URL}notify_new_publication_community/', data=notification_publication,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cascade_update_user(self):
        notification_update = {'user_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                               'user_name': self.noti_author_name,
                               'user_photo': None}
        response = self.client.put(path=f'{self.URL}cascade_update_user/', data=notification_update, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cascade_delete_user(self):
        response = self.client.put(path=f'{self.URL}cascade_delete_user/0b05ce59-09ff-4e57-a7eb-11bf05f5863e/',
                                   format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
