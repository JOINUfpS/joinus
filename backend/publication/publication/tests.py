import json
from datetime import datetime

from common_structure_microservices.messages import Messages
from common_structure_microservices.utilities import Enums
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from asn_publication.messages import MessagesCustom
from publication.models import PublicationModel
from publication.serializer import PublicationSerializer


class PublicationTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8093/publications/api/publication/'
    user_name = 'Paola Pájaro'
    user_email = 'yindypaolapu@ufps.edu.co'
    publ_title = 'Esto es una publicación de prueba'
    publ_link_doi = 'http://localhost:4200/'
    project_abstract = 'ASN Academic Social Network'
    project_link = 'https://dle.rae.es/social'

    def setUp(self):
        self.client = APIClient()
        publication = PublicationModel(
            user_id='fa33a783-bd89-46e1-9306-6839dc141b05',
            user_name=self.user_name,
            user_photo='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            inst_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            comm_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            cate_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            cate_name='Articulo',
            comm_name='Silux',
            publ_title=self.publ_title,
            publ_description='Esta es una publicación realizada desde las pruebas unitarias e integración',
            publ_standard=True,
            publ_authors=[{
                'id': '1ceeb01e-1446-41fd-9abc-296a205ce98e',
                'author_name': 'Fernando Romero',
                'author_photo': 'ec236349-7266-468e-87f2-24dad1554208'
            }],
            publ_privacy=True,
            publ_date=datetime.now(),
            publ_comment=[{
                'id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                'comm_user_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                'comm_user_name': self.user_name,
                'comm_user_photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                'comm_content': 'Por que hace una analogia a que eva comio del fruto prohibido',
                'comm_date': '29-09-2021 06:43 AM'
            }],
            publ_interested_list=['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
            user_interested=True,
            publ_amount_shared=10,
            publ_amount_download=10,
            publ_attachments=[],
            publ_full_text=False,
            publ_link_doi=self.publ_link_doi,
            publ_project_id='3a00665b-830f-49a2-821f-74fa2e0fa485',
            publ_project={
                'id': '3a00665b-830f-49a2-821f-74fa2e0fa485',
                'title': 'Tesis de red social académica',
                'abstract': self.project_abstract,
                'start_date': '04/2021',
                'end_date': '11/2021',
                'link': self.project_link
            },
            publ_permission_view_full_text=[self.user_email],
            created_date=datetime.now(),
        )
        publication.save()
        self.publ_id = publication.id

    def test_get_publication_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        publications = PublicationModel.objects.all()
        serializer = PublicationSerializer(publications, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_publication(self):
        test_publication = {
            'user_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
            'user_name': self.user_name,
            'user_photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            'inst_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            'comm_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            'cate_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            'cate_name': 'Articulo',
            'comm_name': 'Silux',
            'publ_title': 'Esto es una publicación de prueba 2',
            'publ_description': 'Esta es una publicación realizada desde las pruebas unitarias e integración',
            'publ_standard': True,
            'publ_authors': [{}],
            'publ_privacy': True,
            'publ_date': '04-05-2019 08:00 PM',
            'publ_comment': [{}],
            'publ_interested_list': ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
            'user_interested': True,
            'publ_amount_shared': 10,
            'publ_amount_download': 10,
            'publ_attachments': [],
            'publ_full_text': False,
            'publ_link_doi': 'http://localhost:4200/',
            'publ_permission_view_full_text': [self.user_email],
            'publ_project_id': '3a00665b-830f-49a2-821f-74fa2e0fa485',
            'publ_project': {
                'id': '3a00665b-830f-49a2-821f-74fa2e0fa485',
                'title': 'Tesis de red social académica JoinUS',
                'abstract': self.project_abstract,
                'start_date': '04/2021',
                'end_date': '11/2021',
                'link': self.project_link,
            },
            'created_date': '04-05-2018 08:00 PM',
        }

        response = self.client.post(path=self.URL, data=test_publication, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user_id', result)
        self.assertIn('user_name', result)
        self.assertIn('user_photo', result)
        self.assertIn('inst_id', result)
        self.assertIn('comm_id', result)
        self.assertIn('cate_id', result)
        self.assertIn('cate_name', result)
        self.assertIn('comm_name', result)
        self.assertIn('publ_title', result)
        self.assertIn('publ_description', result)
        self.assertIn('publ_standard', result)
        self.assertIn('publ_authors', result)
        self.assertIn('publ_privacy', result)
        self.assertIn('publ_date', result)
        self.assertIn('publ_comment', result)
        self.assertIn('publ_interested_list', result)
        self.assertIn('user_interested', result)
        self.assertIn('publ_amount_shared', result)
        self.assertIn('publ_amount_download', result)
        self.assertIn('publ_attachments', result)
        self.assertIn('publ_full_text', result)
        self.assertIn('publ_link_doi', result)
        self.assertIn('publ_permission_view_full_text', result)
        self.assertIn('publ_project_id', result)
        self.assertIn('publ_project', result)
        self.assertIn('created_date', result)

        if 'id' in result:
            del result['id']

        self.assertEqual(result, test_publication)

    def test_get_by_id_publication(self):
        response = self.client.get(f'{self.URL}{self.publ_id}/', format='json')
        result = json.loads(response.content)['data']

        publication = PublicationModel.objects.get(id=self.publ_id)
        serializer = PublicationSerializer(publication)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_publication(self):
        tests_update = {'user_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'user_name': self.user_name,
                        'user_photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                        'inst_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                        'comm_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                        'cate_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                        'cate_name': 'Articulo',
                        'comm_name': 'Silux',
                        'publ_title': 'Esto es una publicación de prueba en pruebas unitarias',
                        'publ_description': 'Esta es una publicación realizada desde las pruebas unitarias e '
                                            'integración',
                        'publ_standard': True,
                        'publ_authors': [{}],
                        'publ_privacy': True,
                        'publ_date': '04-05-2021 08:00 PM',
                        'publ_comment': [{}],
                        'publ_interested_list': ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
                        'user_interested': True,
                        'publ_amount_shared': 10,
                        'publ_amount_download': 10,
                        'publ_attachments': [],
                        'publ_full_text': False,
                        'publ_link_doi': self.publ_link_doi,
                        'publ_project_id': '3a00665b-830f-49a2-821f-74fa2e0fa485',
                        'publ_project': {
                            'id': '3a00665b-830f-49a2-821f-74fa2e0fa485',
                            'title': 'Tesis de red social académica',
                            'abstract': self.project_abstract,
                            'start_date': '04/2021',
                            'end_date': '11/2021',
                            'link': self.project_link,
                        },
                        'publ_permission_view_full_text': [self.user_email],
                        'created_date': '04-05-2020 08:00 PM', }

        response = self.client.put(path=f'{self.URL}{self.publ_id}/', data=tests_update, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if 'id' in result:
            del result['id']

        self.assertEqual(result, tests_update)

    def test_delete_publication(self):
        response = self.client.delete(f'{self.URL}{self.publ_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        publication_exists = PublicationModel.objects.filter(id=self.publ_id)
        self.assertFalse(publication_exists)

    def test_send_full_text(self):
        json_send = {'user_email': self.user_email,
                     'publ_id': self.publ_id}
        response = self.client.post(path=f'{self.URL}send_full_text/', data=json_send, format='json')
        self.assertEqual(response.data['message'], MessagesCustom.REQUEST_SENT_SUCCESSFULLY)

    def test_share_publication(self):
        json_share = {'share_option': Enums.EMAIL,
                      'publ_id': self.publ_id,
                      'user_share': {'user_name': self.user_name},
                      'user_sharing': {'fous_email': self.user_email}}

        response = self.client.post(path=f'{self.URL}share/', data=json_share, format='json')
        self.assertEqual(response.data['message'], MessagesCustom.PUBLICATION_SHARED_SUCCESSFULLY)

    def test_interest_publication(self):
        json_interest = {'publ_id': self.publ_id,
                         'user_interested': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                         'user_interested_photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                         'user_interested_name': 'Paola Pájaro'}

        response = self.client.post(path=f'{self.URL}interest/', data=json_interest, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cascade_update_community(self):
        json_cascade_update = {'comm_id': '0b05ce59-09ff-4e57-a7eb-11bf05f5863e',
                               'comm_name': 'Comunidad de sabrosura'}
        response = self.client.put(path=f'{self.URL}cascade_update_community/', data=json_cascade_update, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cascade_update_user(self):
        json_cascade_update = {'user_id': '0b05ce59-09ff-4e57-a7eb-11bf05f5863e',
                               'user_name': self.user_name,
                               'user_photo': 'fa33a783-bd89-46e1-9306-6839dc141b05'}
        response = self.client.put(path=f'{self.URL}cascade_update_user/', data=json_cascade_update, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], Messages.UPDATED_SUCCESSFULLY)

    def test_publication_related(self):
        response = self.client.get(
            path=f'{self.URL}public_related/{self.publ_id}/3a00665b-830f-49a2-821f-74fa2e0fa485/true/',
            format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], Messages.SUCCESSFUL_MESSAGE)

    def test_cascade_update_user_project(self):
        user_projects = {'user_projects': [
            {'id': '3a00665b-830f-49a2-821f-74fa2e0fa485',
             'title': 'Tesis de red social académica para la universidad francisco de paula santander',
             'abstract': self.project_abstract,
             'start_date': '04/2021',
             'end_date': '11/2021',
             'link': self.project_link}]
        }
        response = self.client.put(path=f'{self.URL}cascade_update_user_project/', data=user_projects, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], Messages.UPDATED_SUCCESSFULLY)
