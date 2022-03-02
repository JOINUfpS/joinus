import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from asn_user.messages import CustomMessages
from common_structure_microservices.utilities import Enums
from module.models import ModuleModel
from role.models import RoleModel
from role.serializer import RoleSerializer
from user.models import UserModel


class RoleTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8092/users/api/role/'

    def setUp(self):
        self.client = APIClient()
        role = RoleModel(
            inst_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            role_name='Administrador de la red pruebas',
            role_list_module=[{
                'id': 'c6d28c75-b79b-4154-b943-3979eb753d68',
                'perm_list': [
                    'VER',
                    'CREAR',
                    'EDITAR',
                    'BORRAR'
                ],
            }],
            role_structure=[],
            role_static=True,
            role_status='Activo')

        role.save()
        self.role_id = role.id

    def test_get_role_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        roles = RoleModel.objects.all()
        serializer = RoleSerializer(roles, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_role(self):
        module = ModuleModel(modu_name='Pruebas uniarias e integración',
                             modu_router='/tesis-asn/pruebas/',
                             modu_icon='prueba',
                             modu_status='Activo',
                             modu_permissions=['VER',
                                               'CREAR',
                                               'EDITAR',
                                               'BORRAR'],
                             modu_is_generic=False)
        module.save()

        test_role = {'inst_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                     'role_name': 'Administrador organizacional',
                     'role_list_module': [{
                         'id': str(module.id),
                         'perm_list': [
                             'VER',
                             'CREAR',
                             'EDITAR',
                             'BORRAR'
                         ],
                     }],
                     'role_structure': [],
                     'role_static': False,
                     'role_status': 'Activo'}

        response = self.client.post(path=self.URL, data=test_role, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('inst_id', result)
        self.assertIn('role_name', result)
        self.assertIn('role_list_module', result)
        self.assertIn('role_structure', result)
        self.assertIn('role_static', result)
        self.assertIn('role_status', result)

        if 'id' in result:
            del result['id']
            del result['role_structure']
            del test_role['role_structure']

        self.assertEqual(result, test_role)

    def test_get_by_id_role(self):
        response = self.client.get(f'{self.URL}{self.role_id}/', format='json')
        result = json.loads(response.content)['data']

        role = RoleModel.objects.get(id=self.role_id)
        serializer = RoleSerializer(role)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_role(self):
        self.create_user()
        tests_update = {'id': str(self.role_id),
                        'inst_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                        'role_name': 'Administrador organizacional',
                        'role_list_module': [{'id': '1267a09f-831e-4184-a7d3-7590f9eb6900',
                                              'perm_list': [
                                                  'VER',
                                                  'CREAR',
                                                  'EDITAR',
                                                  'BORRAR'
                                              ],
                                              },
                                             {'id': 'c86d4e1c-d813-4463-bcac-3a14dfe5a12a',
                                              'perm_list': [
                                                  'VER',
                                                  'CREAR',
                                                  'EDITAR',
                                                  'BORRAR'
                                              ],
                                              }],
                        'role_structure': [{'id': '0a8a7dab-80dc-48fe-baba-282cd668e431',
                                            'modu_name': 'Pruebas uniarias e integración',
                                            'modu_router': '/tesis-asn/pruebas/',
                                            'modu_icon': 'prueba',
                                            'modu_status': 'Activo',
                                            'modu_permissions': ['VER', 'CREAR', 'EDITAR', 'BORRAR'],
                                            'modu_is_generic': False}],
                        'role_static': False,
                        'role_status': 'Activo'}

        response = self.client.put(path=f'{self.URL}{self.role_id}/', data=tests_update, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        if 'id' in result:
            del result['role_structure']
            del tests_update['role_structure']

        self.assertEqual(result, tests_update)

    def create_user(self):
        user = UserModel(inst_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
                         inst_name='Universidad Francisco de Paula Santander',
                         user_name='Paola Pájaro',
                         user_email='yindypaolapou@ufps.edu.co',
                         user_provider=Enums.REGULAR_PROVIDER,
                         user_role=[{'roleId': str(self.role_id),
                                     'roleName': 'Administrador de la red'}],
                         user_role_structure=[],
                         role_active=self.role_id,
                         user_admin=True,
                         user_intro='Hola!, Mi meta es tener libertad financiera. Hace algo mas de 2 año inicie mi '
                                    'vida laboral, programando apps móviles en Java para Android y también en el '
                                    'lenguaje C. Tengo experiencia en software bancario, manejando transacciones en '
                                    'terminales POS. Me gusta el framework de Android Studio, la programación '
                                    'orientada objetos. He incursionado en Python con su framework Django, Bases de '
                                    'datos MySQL, Servidores Linux y sus diversos comandos.',
                         user_interest=['Android',
                                        'Java',
                                        'Musica',
                                        'Estudio',
                                        'Ajedrez'],
                         user_phone='32698555',
                         user_photo='59f928f7-718d-4329-9ac0-a30692db1947',
                         user_gender='Femenino',
                         user_degree={'career_name': 'Ingeniería de sistemas',
                                      'id': 'e2075aac-e37b-4aea-93ba-9fecaa7a2778'},
                         user_projects=[{'id': '86f2f6e4-a44b-4c4a-8928-9fa99279133b',
                                         'title': 'Implantación de una Red Social Académica (ASN) en la Universidad '
                                                  'Francisco de Paula Santander',
                                         'abstract': '<p>Este es un proyecto de grado en el cual se desea implantar '
                                                     'una Red Social Académica en la UFPS, con motivación de aumentar '
                                                     'los indices colaborativos y la propagación social de '
                                                     'conocimiento entre las distintas carreras universitarias.</p>',
                                         'start_date': '01/2021',
                                         'end_date': '12/2021',
                                         'link': None}],
                         user_curriculum_vitae='54d5778d-ca61-425f-aeda-5b94a419d6cc',
                         user_skill=['Angular, y Django'],
                         user_country={'id': 48, 'name': 'Colombia', 'iso2': 'CO'},
                         user_department={'id': 2877, 'name': 'Norte de Santander', 'iso2': 'NSA'},
                         user_municipality={'id': 20772, 'name': 'Cúcuta'},
                         user_status='Inactivo')
        user.save()

    def test_delete_role_that_has_users(self):
        self.create_user()
        response = self.client.delete(f'{self.URL}{self.role_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        result = json.loads(response.content)
        self.assertEqual(result['errors'][0]['detail'], CustomMessages.ROLE_HAS_USERS)

    def test_delete_role_does_not_exist(self):
        response = self.client.delete(f'{self.URL}3fa85f64-5717-4562-b3fc-2c963f66afa6/', format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        result = json.loads(response.content)
        self.assertEqual(result['errors'][0]['detail'], 'No encontrado.')

    def test_delete_role(self):
        user = UserModel(inst_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
                         inst_name='Universidad Francisco de Paula Santander',
                         user_name='Paola Pájaro',
                         user_email='yindypaolapou@ufps.edu.co',
                         user_provider=Enums.REGULAR_PROVIDER,
                         user_role=[{'roleId': str(self.role_id),
                                     'roleName': 'Administrador de la red'}],
                         user_role_structure=[],
                         role_active=None,
                         user_admin=True,
                         user_intro='Hola soy paola, me gusta la filosofia minimalista, y la lectura. Gracias por '
                                    'visitarme, buen dia',
                         user_interest=['Futbol', 'Guitarra'],
                         user_phone='32698555',
                         user_photo='59f928f7-718d-4329-9ac0-a30692db1947',
                         user_gender='Femenino',
                         user_degree={'career_name': 'Ingeniería de sistemas',
                                      'id': 'e2075aac-e37b-4aea-93ba-9fecaa7a2778'},
                         user_projects=[{
                             'id': 'e009e2aa-1e35-4166-837b-09254eb83a89',
                             'title': 'Tesis de red social académica',
                             'abstract': 'ASN Academic Social Network',
                             'start_date': '04/2021',
                             'end_date': '11/2021',
                             'project_link': 'https://dle.rae.es/social',
                         }],
                         user_curriculum_vitae='54d5778d-ca61-425f-aeda-5b94a419d6cc',
                         user_skill=['finanzas personales',
                                     'gestión de tiempo',
                                     'guitarra'],
                         user_country={'id': 48, 'name': 'Colombia', 'iso2': 'CO'},
                         user_department={'id': 2877, 'name': 'Norte de Santander', 'iso2': 'NSA'},
                         user_municipality={'id': 20772, 'name': 'Cúcuta'},
                         user_status='Inactivo')
        user.save()
        response = self.client.delete(f'{self.URL}{self.role_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        role_exists = RoleModel.objects.filter(id=self.role_id)
        self.assertFalse(role_exists)
