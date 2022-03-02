import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.hashers import make_password

from asn_user.messages import CustomMessages
from common_structure_microservices.messages import Messages
from common_structure_microservices.utilities import Enums
from user.models import UserModel
from user.serializer import UserSerializer


class UserTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8092/users/api/user/'
    inst_name = 'Universidad Francisco de Paula Santander'
    user_email = 'yindypaolapou@ufps.edu.co'
    user_interest = ['Futbol', 'Guitarra']
    user_degree = {'career_name': 'Ingeniería de sistemas', 'id': 'e2075aac-e37b-4aea-93ba-9fecaa7a2778'}
    user_country = {'id': 48, 'name': 'Colombia', 'iso2': 'CO'}
    user_department = {'id': 2877, 'name': 'Norte de Santander', 'iso2': 'NSA'}
    user_municipality = {'id': 20772, 'name': 'Cúcuta'}
    title = 'Tesis de red social académica'
    abstract = 'ASN Academic Social Network'
    project_link = 'https://dle.rae.es/social'

    def setUp(self):
        self.client = APIClient()
        self.user = UserModel(
            inst_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            inst_name=self.inst_name,
            user_name='Paola Pájaro',
            user_email=self.user_email,
            user_password=make_password('12345'),
            user_provider=Enums.REGULAR_PROVIDER,
            user_role=[],
            user_role_structure=[],
            role_active=None,
            user_admin=True,
            user_intro='Hola soy paola, me gusta la filosofia minimalista, y la lectura. Gracias por visitarme, '
                       'buen dia',
            user_interest=self.user_interest,
            user_phone='32698555',
            user_photo='59f928f7-718d-4329-9ac0-a30692db1947',
            user_gender='Femenino',
            user_degree=self.user_degree,
            user_projects=[{
                'title': self.title,
                'abstract': self.abstract,
                'start_date': '04/2021',
                'end_date': '11/2021',
                'project_link': self.project_link,
            }],
            user_curriculum_vitae='54d5778d-ca61-425f-aeda-5b94a419d6cc',
            user_skill=['Angular, y Django'],
            user_country=self.user_country,
            user_department=self.user_department,
            user_municipality=self.user_municipality,
            user_status='Inactivo')
        self.user.save()
        self.id = self.user.id

    def test_get_user_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        users = UserModel.objects.all()
        serializer = UserSerializer(users, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_user(self):
        test_user = {'inst_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                     'inst_name': self.inst_name,
                     'user_name': 'Fernando Romero',
                     'user_email': 'juanfernandoroop@ufps.edu.co',
                     'user_provider': Enums.REGULAR_PROVIDER,
                     'user_role': [],
                     'user_role_structure': [],
                     'user_admin': True,
                     'user_intro': 'Mi pasión, la programación. Mi objetivo, la libertad financiera.',
                     'user_interest': self.user_interest,
                     'user_phone': '32698555',
                     'user_photo': '59f928f7-718d-4329-9ac0-a30692db1947',
                     'user_gender': 'Masculino',
                     'user_degree': self.user_degree,
                     'user_projects': [{
                         'title': self.title,
                         'abstract': self.abstract,
                         'start_date': '04/2021',
                         'end_date': '11/2021',
                         'project_link': self.project_link,
                     }],
                     'user_curriculum_vitae': '54d5778d-ca61-425f-aeda-5b94a419d6cc',
                     'user_skill': ['Android studio, Angular, y Django'],
                     'user_country': self.user_country,
                     'user_department': self.user_department,
                     'user_municipality': self.user_municipality,
                     'user_status': 'Inactivo'}

        response = self.client.post(path=self.URL, data=test_user, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('inst_id', result)
        self.assertIn('inst_name', result)
        self.assertIn('user_name', result)
        self.assertIn('user_email', result)
        self.assertIn('user_provider', result)
        self.assertIn('user_role', result)
        self.assertIn('user_role_structure', result)
        self.assertIn('role_active', result)
        self.assertIn('user_admin', result)
        self.assertIn('user_intro', result)
        self.assertIn('user_interest', result)
        self.assertIn('user_phone', result)
        self.assertIn('user_photo', result)
        self.assertIn('user_gender', result)
        self.assertIn('user_degree', result)
        self.assertIn('user_projects', result)
        self.assertIn('user_curriculum_vitae', result)
        self.assertIn('user_skill', result)
        self.assertIn('user_country', result)
        self.assertIn('user_department', result)
        self.assertIn('user_municipality', result)
        self.assertIn('user_status', result)

        if 'id' in result:
            del result['id']
            del result['role_active']

        self.assertEqual(result, test_user)

    def test_get_by_id_user(self):
        response = self.client.get(f'{self.URL}{self.id}/', format='json')
        result = json.loads(response.content)['data']

        user = UserModel.objects.get(id=self.id)
        serializer = UserSerializer(user)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_user(self):
        tests_update = {'inst_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                        'inst_name': self.inst_name,
                        'user_name': 'Angue Gonzalez',
                        'user_email': 'angiemadeleygppoo@ufps.edu.co',
                        'user_provider': Enums.REGULAR_PROVIDER,
                        'user_role': [],
                        'user_role_structure': [],
                        'role_active': None,
                        'user_admin': True,
                        'user_intro': 'Hola soy angie, y me gusta programar',
                        'user_interest': self.user_interest,
                        'user_phone': '32698555',
                        'user_photo': '59f928f7-718d-4329-9ac0-a30692db1947',
                        'user_gender': 'Femenino',
                        'user_degree': self.user_degree,
                        'user_projects': [{
                            'title': self.title,
                            'abstract': self.abstract,
                            'start_date': '04/2021',
                            'end_date': '11/2021',
                            'project_link': self.project_link,
                        }],
                        'user_curriculum_vitae': '54d5778d-ca61-425f-aeda-5b94a419d6cc',
                        'user_skill': ['Android studio, Angular, y Django'],
                        'user_country': self.user_country,
                        'user_department': self.user_department,
                        'user_municipality': self.user_municipality,
                        'user_status': 'Activo'}

        response = self.client.put(path=f'{self.URL}{self.id}/', data=tests_update, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(result['user_name'], self.user.user_name)

        if 'id' in result:
            del result['id']

        self.assertEqual(result, tests_update)

    def test_patch_user_other_information(self):
        tests_update = {'id': self.id,
                        'user_name': 'Angue Gonzalez',
                        'user_email': 'angiemadeleygppoo@ufps.edu.co',
                        'user_phone': '32698555',
                        'user_photo': '59f928f7-718d-4329-9ac0-a30692db1947',
                        'user_degree': self.user_degree}

        response = self.client.patch(path=f'{self.URL}{self.id}/', data=tests_update, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['message'], Messages.UPDATED_SUCCESSFULLY)

    def test_patch_user_project(self):
        tests_update = {'id': self.id,
                        'user_projects': [{
                            'id': '790968ff-3d14-4349-a644-61d2e2fba35d',
                            'title': self.title,
                            'abstract': self.abstract,
                            'start_date': '04/2021',
                            'end_date': '11/2021',
                            'project_link': self.project_link}]
                        }

        response = self.client.patch(path=f'{self.URL}{self.id}/', data=tests_update, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['message'], Messages.UPDATED_SUCCESSFULLY)

    def test_delete_user(self):
        response = self.client.delete(f'{self.URL}{self.id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user_exists = UserModel.objects.filter(id=self.id)
        self.assertFalse(user_exists)

    def test_validate_user_regular(self):
        json_user = {'user_email': self.user_email, 'user_password': '12345'}
        response = self.client.post(f'{self.URL}validate_user_regular/', data=json_user, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['message'], CustomMessages.LOGGED_IN_SUCCESSFULLY)

    def test_validate_user_regular_does_not_exist(self):
        json_user = {'user_email': 'usuarionoexistente@ufps.edu.co', 'user_password': '12345'}
        response = self.client.post(f'{self.URL}validate_user_regular/', data=json_user, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(result['errors'][0]['detail'], Messages.INSTANCE_DOES_NOT_EXIST % 'El usuario ingresado')

    def test_validate_user_regular_wrong_credentials(self):
        json_user = {'user_email': self.user_email, 'user_password': '1234578'}
        response = self.client.post(f'{self.URL}validate_user_regular/', data=json_user, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(result['errors'][0]['detail'], 'Las credenciales son incorrectas')

    def test_validate_user_google_using_credentials(self):
        user = UserModel(
            inst_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            inst_name=self.inst_name,
            user_name='Eduardo Jose Pájaro Caballero',
            user_email='edurdojosepajarocaballero@ufps.edu.co',
            user_password='',
            user_provider=Enums.GOOGLE_PROVIDER,
            user_role=[],
            user_role_structure=[],
            role_active=None,
            user_admin=True,
            user_intro='',
            user_interest=[],
            user_phone='32698555',
            user_photo=None,
            user_gender='Femenino',
            user_degree=self.user_degree,
            user_projects=[{}],
            user_curriculum_vitae=None,
            user_skill=[],
            user_country=self.user_country,
            user_department=self.user_department,
            user_municipality=self.user_municipality,
            user_status='Inactivo')
        user.save()
        json_user = {'user_email': 'edurdojosepajarocaballero@ufps.edu.co', 'user_password': '1234578'}
        response = self.client.post(f'{self.URL}validate_user_regular/', data=json_user, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(result['errors'][0]['detail'], 'No se encuentran coincidencias. ¡Revisa si estas registrado '
                                                        'por google!')

    def test_validate_user_google(self):
        json_google = {'user_google': {'name': 'Paola Pájaro', 'email': self.user_email}}

        response = self.client.post(f'{self.URL}validate_user_google/', data=json_google, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['message'], CustomMessages.LOGGED_IN_SUCCESSFULLY)

    def test_validate_user_google_does_not_exist(self):
        json_google = {'user_google': {'name': 'User Google not exist', 'email': 'usergoogle@ufps.edu.co'}}

        response = self.client.post(f'{self.URL}validate_user_google/', data=json_google, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['message'], CustomMessages.LOGGED_IN_SUCCESSFULLY)

    def test_change_password(self):
        json_change = {'auth':
                           {'key':
                                {'user': self.user_email,
                                 'current_password': '12345',
                                 'new_password': 'Joinus.2021'}
                            }
                       }

        response = self.client.put(f'{self.URL}change_password/', data=json_change, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['message'], CustomMessages.PASSWORD_CHANGE_SUCCESSFUL)

    def test_forgot_password(self):
        json_forgot = {'user': self.user_email,
                       'confirmation_code': '098765'}
        response = self.client.put(f'{self.URL}forgot_password/', data=json_forgot, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['message'], Messages.UPDATED_SUCCESSFULLY)

    def test_forgot_password_does_not_exist(self):
        json_forgot = {'user': 'does_not_exit_user@ufps.edu.co',
                       'confirmation_code': '098765'}
        response = self.client.put(f'{self.URL}forgot_password/', data=json_forgot, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(result['errors'][0]['detail'], Messages.INSTANCE_DOES_NOT_EXIST % 'El usuario')

    def test_cascade_update_user_institution(self):
        json_update = {'inst_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                       'inst_name': 'Universidad Francisco de Paula Santander sede Santander'}

        response = self.client.put(f'{self.URL}cascade_update_user_institution/', data=json_update, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['message'], Messages.UPDATED_SUCCESSFULLY)
