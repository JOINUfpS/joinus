import json

from django.contrib.auth.hashers import make_password

from common_structure_microservices.messages import Messages
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from common_structure_microservices.utilities import Enums
from community.models import CommunityModel
from community_user.models import CommunityUserModel
from community_user.serializer import CommunityUserSerializer
from user.models import UserModel


class CommunityUserTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8092/users/api/community_user/'
    inst_name = 'La vida de un par de emprendedores'
    other_inst_name = 'Universidad Francisco de Paula Santander'
    user_email = 'dreamticolombia@gmail.com'
    user_name = 'Fernando Romero'
    other_user_name = 'Paola Pájaro'
    other_user_email = 'juanfernadoro@ufps.edu.co'
    email_for_community = 'usuario_para_comunidad@ufps.edu.co'
    title_project = 'Tesis de red social académica'
    abstract_project = 'ASN Academic Social Network'
    user_department = {'id': 2877, 'name': 'Norte de Santander', 'iso2': 'NSA'}
    user_municipality = {'id': 20772, 'name': 'Cúcuta'}
    user_degree = {'career_name': 'Ingeniería de sistemas', 'id': 'e2075aac-e37b-4aea-93ba-9fecaa7a2778'}
    user_skill = ['Angular, y Django']
    user_intro = 'Hola soy paola, me gusta la filosofia minimalista, y la lectura. Gracias por visitarme, buen dia'

    def setUp(self):
        self.client = APIClient()
        community_user = CommunityUserModel(comm_id='3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                                            comm_owner_id='fa33a783-bd89-46e1-9306-6839dc141b05',
                                            inst_id='5232fc3f-d4bc-496b-97f2-fc056ccacee1',
                                            user_id='0c3dbc81-2f07-498c-acdb-ff4991341570',
                                            cous_pending_approval=False,
                                            inst_name=self.inst_name,
                                            cous_admin=True,
                                            comm_name='DreamtiColombia',
                                            user_name='Fernando y Paola',
                                            user_email=self.user_email,
                                            user_phone='3209853254',
                                            user_photo='8da8858c-a44b-4567-8198-d0d74840734e',
                                            comm_category_name='Emprendimiento')
        community_user.save()
        self.comm_id = community_user.comm_id
        self.id = community_user.id

    def test_get_community_user_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        communities = CommunityUserModel.objects.all()
        serializer = CommunityUserSerializer(communities, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_community_user_pending_approval(self):
        test_community_user = {'comm_id': '3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                               'comm_owner_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                               'inst_id': '0d81950c-ff26-47ba-942e-afc73ac334b2',
                               'user_id': '0c3dbc81-2f07-498c-acdb-ff4991341570',
                               'cous_pending_approval': True,
                               'inst_name': self.other_inst_name,
                               'comm_photo': None,
                               'cous_admin': False,
                               'comm_name': 'Viral',
                               'user_name': self.user_name,
                               'user_email': self.other_user_email,
                               'user_phone': '3003719281',
                               'user_photo': '932cdffd-eeb8-45b6-993f-875791203057',
                               'comm_category_name': '100'}

        response = self.client.post(path=self.URL, data=test_community_user, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('comm_id', result)
        self.assertIn('comm_owner_id', result)
        self.assertIn('inst_id', result)
        self.assertIn('user_id', result)
        self.assertIn('cous_pending_approval', result)
        self.assertIn('inst_name', result)
        self.assertIn('comm_photo', result)
        self.assertIn('cous_admin', result)
        self.assertIn('comm_name', result)
        self.assertIn('user_name', result)
        self.assertIn('user_email', result)
        self.assertIn('user_phone', result)
        self.assertIn('user_photo', result)
        self.assertIn('comm_category_name', result)

        if 'id' in result:
            del result['id']

        self.assertEqual(result, test_community_user)

    def test_create_community_user_pending_approval_false(self):
        test_community_user = {'comm_id': '3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                               'comm_owner_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                               'inst_id': '0d81950c-ff26-47ba-942e-afc73ac334b2',
                               'user_id': '0c3dbc81-2f07-498c-acdb-ff4991341570',
                               'cous_pending_approval': False,
                               'inst_name': self.other_inst_name,
                               'comm_photo': None,
                               'cous_admin': False,
                               'comm_name': 'Silux',
                               'user_name': self.user_name,
                               'user_email': self.other_user_email,
                               'user_phone': '30209854125',
                               'user_photo': '932cdffd-eeb8-45b6-993f-875791203057',
                               'comm_category_name': '100'}

        response = self.client.post(path=self.URL, data=test_community_user, format='json')
        result = json.loads(response.content)['data']

        if 'id' in result:
            del result['id']

        self.assertEqual(result, test_community_user)

    def test_get_by_id_community_user(self):
        response = self.client.get(f'{self.URL}{self.id}/', format='json')
        result = json.loads(response.content)['data']

        community_user = CommunityUserModel.objects.get(id=self.id)
        serializer = CommunityUserSerializer(community_user)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_community_user(self):
        tests_update = {'comm_id': '3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                        'comm_owner_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'inst_id': '5232fc3f-d4bc-496b-97f2-fc056ccacee1',
                        'user_id': '0c3dbc81-2f07-498c-acdb-ff4991341570',
                        'cous_pending_approval': False,
                        'inst_name': self.inst_name,
                        'comm_photo': None,
                        'cous_admin': True,
                        'comm_name': 'DreamtiColombia',
                        'user_name': 'Fernando Romero y Paola Pájaro',
                        'user_email': self.user_email,
                        'user_phone': '3003719281',
                        'user_photo': '932cdffd-eeb8-45b6-993f-875791203057',
                        'comm_category_name': 'Emprendimiento'}

        response = self.client.put(path=f'{self.URL}{self.id}/', data=tests_update, format='json')

        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['message'], Messages.UPDATED_SUCCESSFULLY)

        if 'id' in result['data']:
            del result['data']['id']

        self.assertEqual(result['data'], tests_update)

    def test_delete_community_user(self):
        response = self.client.delete(f'{self.URL}{self.id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        community_user_exists = CommunityUserModel.objects.filter(id=self.id)
        self.assertFalse(community_user_exists)

    def test_get_info_community_user(self):
        response = self.client.get(
            f'{self.URL}info_community_user/{self.comm_id}/0c3dbc81-2f07-498c-acdb-ff4991341570/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        result = json.loads(response.content)['data']
        self.assertTrue(result is not None)

    def test_delete_info_community_user(self):
        response = self.client.delete(
            f'{self.URL}information/3e62a36a-2028-4f70-b366-78ed38ecf4e4/0c3dbc81-2f07-498c-acdb-ff4991341570/',
            format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], Messages.DELETED_SUCCESSFULLY)

    def test_get_members_and_no_members(self):
        user = UserModel(
            inst_id='5232fc3f-d4bc-496b-97f2-fc056ccacee1',
            inst_name=self.other_inst_name,
            user_name=self.other_user_name,
            user_email=self.email_for_community,
            user_password=make_password('12345'),
            user_provider=Enums.REGULAR_PROVIDER,
            user_role=[],
            user_role_structure=[],
            role_active=None,
            user_admin=True,
            user_intro=self.user_intro,
            user_interest=[],
            user_phone='32698555',
            user_photo='59f928f7-718d-4329-9ac0-a30692db1947',
            user_gender='Femenino',
            user_degree=self.user_degree,
            user_projects=[{
                'title': self.title_project,
                'abstract': self.abstract_project,
                'start_date': '04/2021',
                'end_date': '11/2021',
                'project_link': 'https://dle.rae.es/sociales',
            }],
            user_curriculum_vitae='54d5778d-ca61-425f-aeda-5b94a419d6cc',
            user_skill=self.user_skill,
            user_country={'id': 48, 'name': 'Colombia', 'iso2': 'CO'},
            user_department=self.user_department,
            user_municipality=self.user_municipality,
            user_status='Inactivo')
        user.save()

        community_user = CommunityUserModel(comm_id='3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                                            comm_owner_id='fa33a783-bd89-46e1-9306-6839dc141b05',
                                            inst_id='5232fc3f-d4bc-496b-97f2-fc056ccacee1',
                                            user_id='0c3dbc81-2f07-498c-acdb-ff4991341574',
                                            cous_pending_approval=False,
                                            inst_name=self.inst_name,
                                            cous_admin=True,
                                            comm_name='DreamtiColombia',
                                            user_name='Paola Bird',
                                            user_email=self.user_email,
                                            user_phone='3209853254',
                                            user_photo='8da8858c-a44b-4567-8198-d0d74840734e',
                                            comm_category_name='Emprendimiento')
        community_user.save()

        response = self.client.get(
            f'{self.URL}members_and_no_members/5232fc3f-d4bc-496b-97f2-fc056ccacee1/3e62a36a-2028-4f70-b366-'
            f'78ed38ecf4e4/', format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('members', result)
        self.assertIn('no_members', result)

        self.assertEqual(response.data['message'], Messages.SUCCESSFUL_MESSAGE)

    def test_get_members_and_no_members_members(self):
        user = UserModel(
            inst_id='5232fc3f-d4bc-496b-97f2-fc056ccacee1',
            inst_name=self.other_inst_name,
            user_name=self.other_user_name,
            user_email=self.email_for_community,
            user_password=make_password('12345'),
            user_provider=Enums.REGULAR_PROVIDER,
            user_role=[{'roleId': '2d12bacc-8f7a-4624-85e2-7dacda5927bf',
                        'roleName': 'Prueba de rol'}],
            user_role_structure=[],
            role_active=None,
            user_admin=True,
            user_intro=self.user_intro,
            user_interest=[],
            user_phone='32698555',
            user_photo='59f928f7-718d-4329-9ac0-a30692db1947',
            user_gender='Femenino',
            user_degree=self.user_degree,
            user_projects=[{
                'id': '282cf1ab-c602-40fe-877b-9607b8ad1f29',
                'title': self.title_project,
                'abstract': self.abstract_project,
                'start_date': '04/2021',
                'end_date': '11/2021',
                'project_link': 'https://dle.rae.es/social',
            }],
            user_curriculum_vitae='54d5778d-ca61-425f-aeda-5b94a419d6cc',
            user_skill=self.user_skill,
            user_country={'id': 48, 'name': 'Colombia', 'iso2': 'CO'},
            user_department=self.user_department,
            user_municipality=self.user_municipality,
            user_status='Inactivo')
        user.save()
        user_id = user.id

        community_user = CommunityUserModel(comm_id='3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                                            comm_owner_id='fa33a783-bd89-46e1-9306-6839dc141b05',
                                            inst_id='5232fc3f-d4bc-496b-97f2-fc056ccacee1',
                                            user_id=user_id,
                                            cous_pending_approval=False,
                                            inst_name=self.inst_name,
                                            cous_admin=False,
                                            comm_name='DreamtiColombia',
                                            user_name='Paola Bird',
                                            user_email=self.user_email,
                                            user_phone='3209853254',
                                            user_photo='8da8858c-a44b-4567-8198-d0d74840734e',
                                            comm_category_name='Emprendimiento')
        community_user.save()

        response = self.client.get(
            f'{self.URL}members_and_no_members/5232fc3f-d4bc-496b-97f2-fc056ccacee1/3e62a36a-2028-4f70-b366-'
            f'78ed38ecf4e4/', format='json')
        result = json.loads(response.content)['data']

        self.assertIn('members', result)
        self.assertIn('no_members', result)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], Messages.SUCCESSFUL_MESSAGE)

    def test_get_members_and_no_members_community_with_out_members(self):
        user = UserModel(
            inst_id='3e62a36a-2028-4f70-b366-78ed38ecf4e4',
            inst_name=self.other_inst_name,
            user_name=self.other_user_name,
            user_email=self.email_for_community,
            user_password=make_password('12345'),
            user_provider=Enums.REGULAR_PROVIDER,
            user_role=[],
            user_role_structure=[],
            role_active=None,
            user_admin=True,
            user_intro=self.user_intro,
            user_interest=[],
            user_phone='32698555',
            user_photo='59f928f7-718d-4329-9ac0-a30692db1947',
            user_gender='Masculino',
            user_degree=self.user_degree,
            user_projects=[{
                'title': self.title_project,
                'abstract': self.abstract_project,
                'start_date': '04/2021',
                'end_date': '11/2021',
                'project_link': 'https://dle.rae.es/social',
            }],
            user_curriculum_vitae='54d5778d-ca61-425f-aeda-5b94a419d6cc',
            user_skill=self.user_skill,
            user_country={'id': 48, 'name': 'Colombia', 'iso2': 'CO'},
            user_department=self.user_department,
            user_municipality=self.user_municipality,
            user_status='Inactivo')
        user.save()

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
        comm_id = community.id

        response = self.client.get(
            f'{self.URL}members_and_no_members/3e62a36a-2028-4f70-b366-78ed38ecf4e4/{str(comm_id)}/', format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('members', result)
        self.assertIn('no_members', result)

        self.assertEqual(response.data['message'], Messages.SUCCESSFUL_MESSAGE)

    def test_approve_union(self):
        test_community_user = {'comm_id': '3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                               'comm_owner_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                               'inst_id': '0d81950c-ff26-47ba-942e-afc73ac334b2',
                               'user_id': '0c3dbc81-2f07-498c-acdb-ff4991341570',
                               'cous_pending_approval': False,
                               'inst_name': self.other_inst_name,
                               'comm_photo': None,
                               'cous_admin': False,
                               'comm_name': 'Viral',
                               'user_name': self.user_name,
                               'user_email': self.other_user_email,
                               'user_phone': '3003719281',
                               'user_photo': '932cdffd-eeb8-45b6-993f-875791203057',
                               'comm_category_name': '100'}

        response = self.client.patch(f'{self.URL}approve_union/{self.id}/',
                                     data=test_community_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], Messages.SUCCESSFUL_APPROVAL)
