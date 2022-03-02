import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from asn_user.messages import CustomMessages
from common_structure_microservices.messages import Messages
from common_structure_microservices.utilities import Enums
from community_user.models import CommunityUserModel
from invite_role.models import InviteRoleModel
from invite_role.serializer import InviteRoleSerializer
from role.models import RoleModel
from user.models import UserModel


class InviteRoleTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8092/users/api/invite_role/'
    user_name = 'Paola Pájaro'
    role_name = 'Administrador de la red'
    user_email = 'yindypaolapu@ufps.edu.co'
    invite_role_serializer = InviteRoleSerializer()

    def setUp(self):
        self.client = APIClient()
        role = RoleModel(
            inst_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            role_name='Administrador de la red en las pruebas de invite_role',
            role_list_module=[{
                "id": "c6d28c75-b79b-4154-b943-3979eb753d68",
                "perm_list": [
                    "VER",
                    "CREAR",
                    "EDITAR",
                    "BORRAR"
                ],
            }],
            role_structure=[],
            role_static=True,
            role_status='Activo')

        role.save()
        self.role_id = role.id

        invite_role = InviteRoleModel(
            inst_id='c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
            user_id='fa33a783-bd89-46e1-9306-6839dc141b05',
            role_id=self.role_id,
            inro_status=Enums.PENDING,
            inro_type=Enums.COMMUNITY,
            user_name=self.user_name,
            role_name=self.role_name,
            user_email=self.user_email,
            comm_id='fa1dc70f-9bdf-40af-b492-696d384c578a',
            cous_id='84dc58fa-73be-4eed-8829-75b288021510',
            comm_name='Silux')
        invite_role.save()
        self.inro_id = invite_role.id

        user_model = UserModel(
            id='fa33a783-bd89-46e1-9306-6839dc141b05',
            inst_id='c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
            inst_name='Universidad Francisco de Paula Santander',
            user_name=self.user_name,
            user_email=self.user_email,
            user_password='JoinUfpS',
            user_provider=Enums.REGULAR_PROVIDER,
            user_role=[{'roleId': '0685dc12-7e99-45ba-9208-bcabeb854cc2',
                        'roleName': 'igual a esa carrera nadie e importa'}],
            user_role_structure=[],
            role_active=None,
            user_admin=True,
            user_intro='Hello, it\'s me, I was wondering if after all these years you\'d like to meet',
            user_interest=['Ser viajera', 'Soñadora de tiempo completo'],
            user_phone='32548796521',
            user_photo='290fe22d-cab0-4c3d-b725-0f9526293f85',
            user_gender='Mujer',
            user_degree={'career_name': 'Marketing y comunicación social',
                         'id': 'c9b738ab-04bb-4196-ba07-3a83527aad8e'},
            user_projects=[],
            user_curriculum_vitae=None,
            user_skill=['Leer por montones'],
            user_country={'id': 48, 'name': 'Colombia', 'iso2': 'CO'},
            user_department={'id': 2877, 'name': 'Norte de Santander', 'iso2': 'NSA'},
            user_municipality={'id': 20772, 'name': 'Cúcuta'},
            user_status=Enums.ACTIVO)
        user_model.save()

    def test_get_invite_role_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        invite_roles = InviteRoleModel.objects.all()
        serializer = InviteRoleSerializer(invite_roles, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_invite_role(self):
        test_invite_role = {'inst_id': 'c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
                            'user_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                            'role_id': str(self.role_id),
                            'inro_status': Enums.PENDING,
                            'inro_type': Enums.COMMUNITY,
                            'user_name': self.user_name,
                            'role_name': self.role_name,
                            'user_email': self.user_email,
                            'comm_id': 'fa1dc70f-9bdf-40af-b492-696d384c578a',
                            'cous_id': '84dc58fa-73be-4eed-8829-75b288021510',
                            'comm_name': 'Silux', }

        response = self.client.post(path=self.URL, data=test_invite_role, format='json')
        result = json.loads(response.content)['data']

        self.assertIn('inst_id', result)
        self.assertIn('user_id', result)
        self.assertIn('role_id', result)
        self.assertIn('inro_status', result)
        self.assertIn('inro_type', result)
        self.assertIn('user_name', result)
        self.assertIn('role_name', result)
        self.assertIn('user_email', result)
        self.assertIn('comm_id', result)
        self.assertIn('cous_id', result)
        self.assertIn('comm_name', result)

        if 'id' in result:
            del result['id']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(result, test_invite_role)

    def test_get_by_id_invite_role(self):
        response = self.client.get(f'{self.URL}{self.inro_id}/', format='json')
        result = json.loads(response.content)['data']

        invite_role = InviteRoleModel.objects.get(id=self.inro_id)
        serializer = InviteRoleSerializer(invite_role)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_invite_role(self):
        tests_update = {'inst_id': 'c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
                        'user_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'role_id': '0685dc12-7e99-45ba-9208-bcabeb854cc2',
                        'inro_status': Enums.PENDING,
                        'inro_type': Enums.COMMUNITY,
                        'user_name': self.user_name,
                        'role_name': self.role_name,
                        'user_email': self.user_email,
                        'comm_id': 'fa1dc70f-9bdf-40af-b492-696d384c578a',
                        'cous_id': '84dc58fa-73be-4eed-8829-75b288021510',
                        'comm_name': 'Silux', }

        response = self.client.put(path=f'{self.URL}{self.inro_id}/', data=tests_update, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content)['message'], Messages.UPDATED_SUCCESSFULLY)
        if 'id' in result:
            del result['id']

        self.assertEqual(result, tests_update)

    def test_delete_invite_role(self):
        response = self.client.delete(f'{self.URL}{self.inro_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        invite_role_exists = InviteRoleModel.objects.filter(id=self.inro_id)
        self.assertFalse(invite_role_exists)

    def test_request_role(self):
        test_invite_role = {'inst_id': 'c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
                            'user_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                            'role_id': '0685dc12-7e99-45ba-9208-bcabeb854cc2',
                            'inro_status': Enums.PENDING,
                            'inro_type': Enums.COMMUNITY,
                            'user_name': self.user_name,
                            'role_name': self.role_name,
                            'user_email': self.user_email,
                            'comm_id': 'fa1dc70f-9bdf-40af-b492-696d384c578a',
                            'cous_id': '84dc58fa-73be-4eed-8829-75b288021510',
                            'comm_name': 'Silux', }

        response = self.client.post(path=f'{self.URL}request_role/', data=test_invite_role, format='json')
        self.assertEqual(response.data["message"], CustomMessages.INVITATION_EMAIL_SENT)

    def test_invite_take_role(self):
        test_invite_role = {'inst_id': 'c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
                            'user_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                            'role_id': '0685dc22-7e99-45ba-9208-bcabeb854cc1',
                            'inro_status': Enums.PENDING,
                            'inro_type': Enums.STANDARD,
                            'user_name': self.user_name,
                            'role_name': self.role_name,
                            'user_email': self.user_email}

        response = self.client.post(path=f'{self.URL}invite_take_role/', data=test_invite_role, format='json')
        self.assertEqual(response.data["message"], CustomMessages.INVITATION_EMAIL_SENT)

    def test_invite_take_role_already_exist(self):
        test_invite_role = {'inst_id': 'c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
                            'user_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                            'role_id': '0685dc12-7e99-45ba-9208-bcabeb854cc2',
                            'inro_status': Enums.PENDING,
                            'inro_type': Enums.STANDARD,
                            'user_name': self.user_name,
                            'role_name': self.role_name,
                            'user_email': self.user_email}

        response = self.client.post(path=f'{self.URL}invite_take_role/', data=test_invite_role, format='json')
        self.assertEqual(response.data["message"], CustomMessages.USER_ALREADY_HAS_THAT_ROLE)

    def test_invite_take_role_standard_does_not_exist(self):
        test_invite_role = {'inst_id': 'c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
                            'user_id': 'fa33a783-bd89-46e1-9306-6839dc141b04',
                            'role_id': '0685dc12-7e99-45ba-9208-bcabeb854cc2',
                            'inro_status': Enums.PENDING,
                            'inro_type': Enums.STANDARD,
                            'user_name': self.user_name,
                            'role_name': self.role_name,
                            'user_email': self.user_email}

        response = self.client.post(path=f'{self.URL}invite_take_role/', data=test_invite_role, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        result = json.loads(response.content)
        self.assertEqual(result['errors'][0]['detail'], Messages.INSTANCE_DOES_NOT_EXIST % 'Usuario')

    def test_invite_take_role_by_community(self):
        community_user = CommunityUserModel(comm_id='3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                                            comm_owner_id='fa33a783-bd89-46e1-9306-6839dc141b05',
                                            inst_id='5232fc3f-d4bc-496b-97f2-fc056ccacee1',
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
        comm_user = community_user.id

        test_invite_role = {'inst_id': '5232fc3f-d4bc-496b-97f2-fc056ccacee1',
                            'user_id': '0c3dbc81-2f07-498c-acdb-ff4991341570',
                            'role_id': '0c3dbc81-2f07-498c-acdb-ff4991341570',
                            'inro_status': Enums.PENDING,
                            'inro_type': Enums.COMMUNITY,
                            'user_name': self.user_name,
                            'role_name': self.role_name,
                            'user_email': self.user_email,
                            'comm_id': '3e62a36a-2028-4f70-b366-78ed38ecf4e4',
                            'cous_id': comm_user,
                            'comm_name': 'DreamtiColombia'}

        response = self.client.post(path=f'{self.URL}invite_take_role/', data=test_invite_role, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invite_take_role_by_community_does_not_exist(self):
        test_invite_role = {'inst_id': 'c5ff952d-cfa0-4e22-9403-5530b6bbe91f',
                            'user_id': 'fa33a783-bd89-46e1-9306-6839dc141b08',
                            'role_id': '0685dc12-7e99-45ba-9208-bcabeb854cc2',
                            'inro_status': Enums.PENDING,
                            'inro_type': Enums.COMMUNITY,
                            'user_name': self.user_name,
                            'role_name': self.role_name,
                            'user_email': self.user_email,
                            'comm_id': 'fa1dc70f-9bdf-40af-b492-696d384c578a',
                            'cous_id': '84dc58fa-73be-4eed-8829-75b288021511',
                            'comm_name': 'Silux', }

        response = self.client.post(path=f'{self.URL}invite_take_role/', data=test_invite_role, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        result = json.loads(response.content)
        self.assertEqual(result['errors'][0]['detail'], Messages.INSTANCE_DOES_NOT_EXIST % 'Comunidad')

    def test_authorize_role(self):
        test_invite_role = {'inst_id': 'c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
                            'user_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                            'role_id': self.role_id,
                            'inro_status': Enums.AUTHORIZED,
                            'inro_type': Enums.COMMUNITY}

        response = self.client.patch(path=f'{self.URL}authorize_role/{self.inro_id}/', data=test_invite_role,
                                     format='json')
        self.assertEqual(response.data['message'], Messages.UPDATED_SUCCESSFULLY)

    def test_authorize_role_does_not_exist(self):
        invite_role = InviteRoleModel(
            inst_id='c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
            user_id='ea33a783-bd89-46e1-9306-6839dc141b00',
            role_id='0685dc12-7e99-45ba-9208-bcabeb854cc2',
            inro_status=Enums.PENDING,
            inro_type=Enums.COMMUNITY,
            user_name=self.user_name,
            role_name=self.role_name,
            user_email=self.user_email,
            comm_id='fa1dc70f-9bdf-40af-b492-696d384c578a',
            cous_id='84dc58fa-73be-4eed-8829-75b288021510',
            comm_name='Silux')
        invite_role.save()
        inro_id = invite_role.id

        test_invite_role = {'inst_id': 'c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
                            'user_id': 'ea33a783-bd89-46e1-9306-6839dc141b00',
                            'role_id': '0685dc12-7e99-45ba-9208-bcabeb854cc2',
                            'inro_status': Enums.AUTHORIZED,
                            'inro_type': Enums.COMMUNITY}

        response = self.client.patch(path=f'{self.URL}authorize_role/{inro_id}/', data=test_invite_role,
                                     format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        result = json.loads(response.content)
        self.assertEqual(result['errors'][0]['detail'], Messages.INSTANCE_DOES_NOT_EXIST % 'Usuario')
