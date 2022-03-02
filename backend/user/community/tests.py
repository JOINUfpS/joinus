import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from asn_user.messages import CustomMessages
from common_structure_microservices.messages import Messages
from community.cascade_delete import CascadeDeleteTaskCommunity
from community.models import CommunityModel
from community.serializer import CommunitySerializer
from community_user.models import CommunityUserModel


class CommunityTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8092/users/api/community/'
    cascade_delete = CascadeDeleteTaskCommunity()
    community_serializer = CommunitySerializer()

    def setUp(self):
        self.client = APIClient()
        community = CommunityModel(inst_id='3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                                   comm_photo_id='fa33a783-bd89-46e1-9306-6839dc141b05',
                                   comm_owner_id='5232fc3f-d4bc-496b-97f2-fc056ccacee1',
                                   comm_name='Silux',
                                   comm_description='Dudas o problemas entrando al mundillo de GNU/Linux? pregunte acá.'
                                                    ' Bienvenido. Grupo de la comunidad del semillero de investigación '
                                                    'de software libre y Linux de la UFPS - SILUX',
                                   comm_category='71ae64b5-3a71-4934-a7cc-284b903f6ff8',
                                   comm_category_name='Comunidad',
                                   comm_privacy=True,
                                   comm_amount_member=5)
        community.save()
        self.comm_id = community.id

        community_user = CommunityUserModel(comm_id=self.comm_id,
                                            comm_owner_id='fa33a783-bd89-46e1-9306-6839dc141b05',
                                            inst_id='3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                                            user_id='0c3dbc81-2f07-498c-acdb-ff4991341570',
                                            cous_pending_approval=False,
                                            inst_name='La vida de un par de emprendedores',
                                            cous_admin=True,
                                            comm_name='DreamtiColombia',
                                            user_name='Fernando y Paola',
                                            user_email='dreamticolombia@gmail.com',
                                            user_phone='3209853254',
                                            user_photo='8da8858c-a44b-4567-8198-d0d74840734e',
                                            comm_category_name='Emprendimiento')
        community_user.save()

    def test_get_community_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        communities = CommunityModel.objects.all()
        serializer = CommunitySerializer(communities, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_community(self):
        test_community = {'inst_id': '3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                          'comm_photo_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                          'comm_owner_id': '0d81950c-ff26-47ba-942e-afc73ac334b2',
                          'comm_name': 'viral',
                          'comm_description': 'Este es un semillero de investigación dedicado al desarrollo de video '
                                              'juegos',
                          'comm_category': 'b0eaa710-17e6-4d59-8b99-b0ac15fad159',
                          'comm_category_name': 'Semillero',
                          'comm_privacy': False,
                          'comm_amount_member': 100,
                          'community_user': {
                              'inst_name': 'La vida de un par de emprendedores',
                              'user_name': 'Fernando Romero y Paola Pájaro',
                              'user_email': 'dreamticolombia@gmail.com',
                              'user_phone': '3003719281',
                              'user_photo': '932cdffd-eeb8-45b6-993f-875791203057'}
                          }

        response = self.client.post(path=self.URL, data=test_community, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('inst_id', result)
        self.assertIn('comm_photo_id', result)
        self.assertIn('comm_owner_id', result)
        self.assertIn('comm_name', result)
        self.assertIn('comm_description', result)
        self.assertIn('comm_category', result)
        self.assertIn('comm_category_name', result)
        self.assertIn('comm_privacy', result)
        self.assertIn('comm_amount_member', result)

        if 'id' in result:
            del result['id']
            del test_community['community_user']

        self.assertEqual(result, test_community)

    def test_create_community_without_community_user(self):
        community = {"inst_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                     "comm_photo_id": "fa33a783-bd89-46e1-9306-6839dc141b05",
                     "comm_owner_id": "0d81950c-ff26-47ba-942e-afc73ac334b2",
                     "comm_name": "viral",
                     "comm_description": "Este es un semillero de investigación dedicado al desarrollo de video juegos",
                     "comm_category": "b0eaa710-17e6-4d59-8b99-b0ac15fad159",
                     "comm_category_name": "Semillero",
                     "comm_privacy": False,
                     "comm_amount_member": 100}

        response = self.client.post(path=self.URL, data=community, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        result = json.loads(response.content)
        self.assertEqual(result['errors'][0], CustomMessages.COMMUNITY_USER_FIELD_REQUIRED)

    def test_get_by_id_community(self):
        response = self.client.get(f'{self.URL}{self.comm_id}/', format='json')
        result = json.loads(response.content)['data']

        community = CommunityModel.objects.get(id=self.comm_id)
        serializer = CommunitySerializer(community)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_community(self):
        tests_update = {'inst_id': '3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                        'comm_photo_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'comm_owner_id': '0d81950c-ff26-47ba-942e-afc73ac334b2',
                        'comm_name': 'viral',
                        'comm_description': 'Este es un semillero de investigación dedicado al desarrollo de video '
                                            'juegos y como impacta esto en la sdiferentes areas de las personas',
                        'comm_category': 'b0eaa710-17e6-4d59-8b99-b0ac15fad159',
                        'comm_category_name': 'Semillero',
                        'comm_privacy': False,
                        'comm_amount_member': 100}

        response = self.client.put(path=f'{self.URL}{self.comm_id}/', data=tests_update, format='json')

        result = json.loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['message'], Messages.UPDATED_SUCCESSFULLY)

        if 'id' in result['data']:
            del result['data']['id']

        self.assertEqual(result['data'], tests_update)

    def test_delete_community(self):
        response = self.client.delete(f'{self.URL}{self.comm_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        community_exists = CommunityModel.objects.filter(id=self.comm_id)
        self.assertFalse(community_exists)

    def test_delete_community_by_cascade_delete(self):
        result = self.cascade_delete.cascade_action(self.comm_id)
        self.assertIsNone(result)

    def test_communities_categories(self):
        response = self.client.get(
            f'{self.URL}communities_categories/3e62a36a-2028-4f70-b366-78ed38ecf4e4/'
            f'0c3dbc81-2f07-498c-acdb-ff4991341570/', format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('communities_managed', result)
        self.assertIn('communities_member', result)
        self.assertIn('communities_pending_approval', result)
        self.assertIn('other_communities', result)

    def test_communities_categories_by_serializer(self):
        result = self.community_serializer.get_communities_by_categories('3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                                                                         '0c3dbc81-2f07-498c-acdb-ff4991341570')
        self.assertIn('communities_managed', result)
        self.assertIn('communities_member', result)
        self.assertIn('communities_pending_approval', result)
        self.assertIn('other_communities', result)

    def test_cascade_update_category_community(self):
        json_update = {'cate_id': 'b0eaa710-17e6-4d59-8b99-b0ac15fad159',
                       'cate_name': 'Semillero de investigación'}
        response = self.client.put(path=f'{self.URL}cascade_update_category_community/', data=json_update,
                                   format='json')

        message = json.loads(response.content)['message']
        self.assertEqual(message, Messages.UPDATED_SUCCESSFULLY)
