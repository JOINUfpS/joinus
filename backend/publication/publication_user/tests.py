import json
from datetime import datetime

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from publication_user.models import PublicationUserModel
from publication_user.serializer import PublicationUserSerializer


class PublicationUserTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8093/publications/api/publication_user/'
    user_name = 'Fernando Romero'
    publ_title = 'Esto es una publicación de prueba'
    publ_reference = 'Esta es una referencia de ejemplo'
    publ_link_doi = 'http://localhost:4200/'
    project_title = 'Tesis de red social académica'
    project_abstract = 'ASN Academic Social Network'
    project_link = 'https://dle.rae.es/social'

    def setUp(self):
        self.client = APIClient()
        publication_user = PublicationUserModel(
            publ_id='fa33a783-bd89-46e1-9306-6839dc141b05',
            user_id='37885f64-5717-4562-b3fc-2c963f66af78',
            puus_interest=True,
            puus_shared=True,
            puus_saved=True,
            publ_user_id='ee78167e-397d-4016-8a01-1c1b2b800f09',
            publ_user_name=self.user_name,
            publ_user_photo='08f56180-0df1-4fe9-b5fa-87e87b39a40e',
            cate_name='Articulo',
            comm_id=None,
            comm_name=None,
            publ_title=self.publ_title,
            publ_description='Esta es una publicación realizada desde las pruebas unitarias e integración',
            publ_authors=[{
                'id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                'author_name': 'Paola Pájaro',
                'author_photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6'
            }],
            publ_comment=[{}],
            publ_privacy=True,
            publ_amount_interest=2,
            publ_amount_shared=2,
            publ_attachments=[],
            publ_link_doi=self.publ_link_doi,
            publ_project_id='3a00665b-830f-49a2-821f-74fa2e0fa485',
            publ_project={
                'title': self.project_title,
                'abstract': self.project_abstract,
                'start_date': '04/2021',
                'end_date': '11/2021',
                'link': self.project_link
            },
            created_date=datetime.now(),
        )
        publication_user.save()
        self.puus_id = publication_user.id

    def test_get_publication_user_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        publication_users = PublicationUserModel.objects.all()
        serializer = PublicationUserSerializer(publication_users, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_publication_user(self):
        test_publication_user = {
            'publ_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
            'user_id': '37885f64-5717-4562-b3fc-2c963f66af78',
            'puus_interest': True,
            'puus_shared': True,
            'puus_saved': True,
            'publ_user_id': 'ee78167e-397d-4016-8a01-1c1b2b800f09',
            'publ_user_name': self.user_name,
            'publ_user_photo': '08f56180-0df1-4fe9-b5fa-87e87b39a40e',
            'cate_name': 'Articulo',
            'comm_id': None,
            'comm_name': None,
            'publ_title': self.publ_title,
            'publ_description': 'Esta es una publicación realizada desde las pruebas unitarias e integración',
            'publ_authors': [{
                'id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                'author_name': self.user_name,
                'author_photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6'
            }],
            'publ_comment': [{}],
            'publ_privacy': True,
            'publ_amount_interest': 2,
            'publ_amount_shared': 2,
            'publ_attachments': [],
            'publ_link_doi': self.publ_link_doi,
            'publ_project_id': '3a00665b-830f-49a2-821f-74fa2e0fa485',
            'publ_project': {
                'title': self.project_title,
                'abstract': self.project_abstract,
                'start_date': '04/2021',
                'end_date': '11/2021',
                'link': self.project_link
            },
            'created_date': '04-05-2020 07:54 PM',
        }

        response = self.client.post(path=self.URL, data=test_publication_user, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('publ_id', result)
        self.assertIn('user_id', result)
        self.assertIn('puus_interest', result)
        self.assertIn('puus_shared', result)
        self.assertIn('puus_saved', result)
        self.assertIn('publ_user_id', result)
        self.assertIn('publ_user_name', result)
        self.assertIn('publ_user_photo', result)
        self.assertIn('cate_name', result)
        self.assertIn('comm_name', result)
        self.assertIn('comm_id', result)
        self.assertIn('publ_title', result)
        self.assertIn('publ_description', result)
        self.assertIn('publ_authors', result)
        self.assertIn('publ_comment', result)
        self.assertIn('publ_privacy', result)
        self.assertIn('publ_amount_interest', result)
        self.assertIn('publ_amount_shared', result)
        self.assertIn('publ_attachments', result)
        self.assertIn('publ_link_doi', result)
        self.assertIn('publ_project_id', result)
        self.assertIn('publ_project', result)
        self.assertIn('created_date', result)

        if 'id' in result:
            del result['id']

        self.assertEqual(result, test_publication_user)

    def test_get_by_id_publication_user(self):
        response = self.client.get(f'{self.URL}{self.puus_id}/', format='json')
        result = json.loads(response.content)['data']

        publication_user = PublicationUserModel.objects.get(id=self.puus_id)
        serializer = PublicationUserSerializer(publication_user)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_publication_user(self):
        tests_update = {'publ_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'user_id': '37885f64-5717-4562-b3fc-2c963f66af78',
                        'puus_interest': True,
                        'puus_shared': True,
                        'puus_saved': True,
                        'publ_user_id': 'ee78167e-397d-4016-8a01-1c1b2b800f09',
                        'publ_user_name': self.user_name,
                        'publ_user_photo': '08f56180-0df1-4fe9-b5fa-87e87b39a40e',
                        'cate_name': 'Articulo',
                        'comm_id': None,
                        'comm_name': None,
                        'publ_title': self.publ_title,
                        'publ_description': 'Esta es una publicación actualizada desde las pruebas unitarias e '
                                            'integración',
                        'publ_authors': [{
                            'id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                            'author_name': self.user_name,
                            'author_photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6'
                        }],
                        'publ_comment': [{}],
                        'publ_privacy': True,
                        'publ_amount_interest': 2,
                        'publ_amount_shared': 2,
                        'publ_attachments': [],
                        'publ_project_id': '3a00665b-830f-49a2-821f-74fa2e0fa485',
                        'publ_project': {
                            'title': self.project_title,
                            'abstract': self.project_abstract,
                            'start_date': '04/2021',
                            'end_date': '11/2021',
                            'link': self.project_link
                        },
                        'publ_link_doi': self.publ_link_doi,
                        'created_date': '04-05-2021 06:54 AM', }

        response = self.client.put(path=f'{self.URL}{self.puus_id}/', data=tests_update, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        if 'id' in result:
            del result['id']

        self.assertEqual(result, tests_update)

    def test_delete_publication_user(self):
        response = self.client.delete(f'{self.URL}{self.puus_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        publication_user_exists = PublicationUserModel.objects.filter(id=self.puus_id)
        self.assertFalse(publication_user_exists)
