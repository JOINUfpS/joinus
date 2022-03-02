import json

from common_structure_microservices.messages import Messages
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from asn_user.messages import CustomMessages
from common_structure_microservices.utilities import Enums
from follow_user.models import FollowUserModel
from follow_user.serializer import FollowUserSerializer
from user.models import UserModel


class FollowUserTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8092/users/api/follow_user/'
    inst_name = 'Universidad Francisco de Paula Santander'
    name_user = 'Fernando Romero'
    name_fous = 'Paola Pájaro'
    user_email = 'juanfernandoro@ufps.edu.co'
    fous_email = 'yindypaolapu@ufps.edu.co'
    user_degree = {'career_name': 'Ingeniería de sistemas',
                   'id': 'e2075aac-e37b-4aea-93ba-9fecaa7a2778'}
    fous_degree = {'career_name': 'Psicologa',
                   'id': 'f2075aac-e37b-4aea-93ba-9fecaa7a2776'}

    def setUp(self):
        self.client = APIClient()
        follow_user = FollowUserModel(
            user_id='738b3f09-cfed-4925-acf4-57eea6ac4219',
            fous_user_id='056fd787-dd67-4878-a6d5-a2b766d3e917',
            fous_is_bidirectional=True,
            inst_id_user='c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
            inst_id_fous='c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
            name_user=self.name_user,
            name_fous=self.name_fous,
            inst_name_user=self.inst_name,
            inst_name_fous=self.inst_name,
            user_email=self.user_email,
            fous_email=self.fous_email,
            user_degree=self.user_degree,
            fous_degree=self.user_degree,
            user_photo=None,
            fous_photo=None)

        follow_user.save()
        self.fous_id = follow_user.id

        user_model = UserModel(
            id='fa33a783-bd89-46e1-9306-6839dc141b05',
            inst_id='c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
            inst_name=self.inst_name,
            user_name=self.name_user,
            user_email=self.user_email,
            user_password='JoinUfpS',
            user_provider=Enums.REGULAR_PROVIDER,
            user_role=[],
            user_role_structure={},
            role_active=None,
            user_admin=False,
            user_intro='Hello, it\'s me',
            user_interest=['Ser viajera', 'Deseos de recorrer el mundo'],
            user_phone='55555',
            user_photo='a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
            user_gender='Mujer',
            user_degree={'career_name': 'Psicología', 'id': 'f2075aac-e37b-4aea-93ba-9fecaa7a2776'},
            user_projects=[],
            user_curriculum_vitae=None,
            user_skill=['Leer por montones'],
            user_country={'id': 48, 'name': 'Colombia', 'iso2': 'CO'},
            user_department={'id': 2877, 'name': 'Norte de Santander', 'iso2': 'NSA'},
            user_municipality={'id': 20772, 'name': 'Cúcuta'},
            user_status=Enums.ACTIVO)
        user_model.save()

        user_model = UserModel(
            id='fa33a783-bd89-46e1-9306-6839dc141b65',
            inst_id='c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
            inst_name=self.inst_name,
            user_name=self.name_user,
            user_email='juanfernandopu@ufps.edu.co',
            user_password='JoinUfpS.2021',
            user_provider=Enums.REGULAR_PROVIDER,
            user_role=[],
            user_role_structure={},
            role_active=None,
            user_admin=False,
            user_intro='Hello, it\'s me',
            user_interest=['Ser viajera', 'fotografiá', 'Inversiones en bolsa'],
            user_phone='55555',
            user_photo=None,
            user_gender='Mujer',
            user_degree={'career_name': 'Psicologia', 'id': 'f2075aac-e37b-4aea-93ba-9fecaa7a2776'},
            user_projects=[],
            user_curriculum_vitae=None,
            user_skill=['Leer por montones', 'Hablar en publico', 'Cocinar'],
            user_country={'id': 48, 'name': 'Colombia', 'iso2': 'CO'},
            user_department={'id': 2877, 'name': 'Norte de Santander', 'iso2': 'NSA'},
            user_municipality={'id': 20772, 'name': 'Cúcuta'},
            user_status=Enums.ACTIVO)
        user_model.save()

    def create_object_follow_user(self):
        return {'user_id': 'c26a9080-dff1-4924-957a-399e7720c2d6',
                'fous_user_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                'fous_is_bidirectional': True,
                'inst_id_user': 'd42688d4-b831-4b95-a81f-74b00b59f255',
                'inst_id_fous': 'd42688d4-b831-4b95-a81f-74b00b59f255',
                'name_user': 'Lina Romero',
                'name_fous': self.name_fous,
                'inst_name_user': self.inst_name,
                'inst_name_fous': self.inst_name,
                'user_email': 'linamarcelaro@ufps.edu.co',
                'fous_email': self.fous_email,
                'user_degree': self.fous_degree,
                'fous_degree': self.user_degree,
                'user_photo': None,
                'fous_photo': None}

    def test_get_follow_user_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        follow_users = FollowUserModel.objects.all()
        serializer = FollowUserSerializer(follow_users, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_follow_user(self):
        test_follow_user = self.create_object_follow_user()

        response = self.client.post(path=self.URL, data=test_follow_user, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user_id', result)
        self.assertIn('fous_user_id', result)
        self.assertIn('fous_is_bidirectional', result)
        self.assertIn('inst_id_user', result)
        self.assertIn('inst_id_fous', result)
        self.assertIn('name_user', result)
        self.assertIn('name_fous', result)
        self.assertIn('inst_name_user', result)
        self.assertIn('inst_name_fous', result)
        self.assertIn('user_email', result)
        self.assertIn('fous_email', result)
        self.assertIn('user_degree', result)
        self.assertIn('fous_degree', result)
        self.assertIn('user_photo', result)
        self.assertIn('fous_photo', result)

        if 'id' in result:
            del result['id']

        self.assertEqual(result, test_follow_user)

    def test_get_by_id_follow_user(self):
        response = self.client.get(f'{self.URL}{self.fous_id}/', format='json')
        result = json.loads(response.content)['data']

        follow_user = FollowUserModel.objects.get(id=self.fous_id)
        serializer = FollowUserSerializer(follow_user)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_follow_user(self):
        tests_update = self.create_object_follow_user()

        response = self.client.put(path=f'{self.URL}{self.fous_id}/', data=tests_update, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        if 'id' in result['data']:
            del result['data']['id']

        self.assertEqual(result['data'], tests_update)

    def test_delete_follow_user(self):
        response = self.client.delete(f'{self.URL}{self.fous_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        follow_user_exists = FollowUserModel.objects.filter(id=self.fous_id)
        self.assertFalse(follow_user_exists)

    def test_follow(self):
        follow_json = {"user_id": "738b3f09-cfed-4925-acf4-57eea6ac4219",
                       "fous_user_id": "056fd787-dd67-4878-a6d5-a2b766d3e917",
                       "fous_is_bidirectional": False,
                       "inst_id_user": 'c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
                       "inst_id_fous": 'c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
                       "name_user": self.name_user,
                       "name_fous": self.name_fous,
                       "inst_name_user": self.inst_name,
                       "inst_name_fous": self.inst_name,
                       "user_email": self.user_email,
                       "fous_email": self.fous_email,
                       "user_degree": self.user_degree,
                       "fous_degree": self.user_degree,
                       'user_photo': None,
                       'fous_photo': None}

        response = self.client.post(path=f'{self.URL}follow/', data=follow_json, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], Messages.SUCCESSFUL_MESSAGE)

        result = json.loads(response.content)['data']

        if 'id' in result:
            del result['id']
            del result['fous_is_bidirectional']
            del follow_json['fous_is_bidirectional']

        self.assertEqual(result, follow_json)

    def test_follow_does_not_have_followers(self):
        follow_json = {"user_id": "638b3f09-cfed-4925-acf4-57eea6ac4219",
                       "fous_user_id": "156fd787-dd67-4878-a6d5-a2b766d3e917",
                       "fous_is_bidirectional": False,
                       "inst_id_user": '5a783136-bc81-4260-8b8f-628661d2e58c',
                       "inst_id_fous": '5a783136-bc81-4260-8b8f-628661d2e58c',
                       "name_user": self.name_user,
                       "name_fous": self.name_fous,
                       "inst_name_user": self.inst_name,
                       "inst_name_fous": self.inst_name,
                       "user_email": self.user_email,
                       "fous_email": self.fous_email,
                       "user_degree": self.user_degree,
                       "fous_degree": self.user_degree,
                       'user_photo': None,
                       'fous_photo': None}

        response = self.client.post(path=f'{self.URL}follow/', data=follow_json,
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        result = json.loads(response.content)['data']

        if 'id' in result:
            del result['id']
            del result['fous_is_bidirectional']
            del follow_json['fous_is_bidirectional']

        self.assertEqual(result, follow_json)

        self.assertEqual(response.data["message"], Messages.SUCCESSFUL_MESSAGE)

    def test_followed_users(self):
        response = self.client.get(
            path=f'{self.URL}followed_users/5a783136-bc81-4260-8b8f-628661d2e58c/738b3f09-cfed-4925-acf4-57eea6ac4219/',
            format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('followed_users', result)
        self.assertIn('followers_users', result)

    def test_suggested_other_users(self):
        response = self.client.get(
            path=f'{self.URL}suggested_users/c5ff952d-cfa0-4e22-9403-5530b6bbe91e/fa33a783-bd89-46e1-9306-6839dc141b05/',
            format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], Messages.SUCCESSFUL_MESSAGE)

    def test_suggested_followers_by_me(self):
        follow_user = FollowUserModel(
            user_id='738b3f09-cfed-4925-acf4-57eea6ac4219',
            fous_user_id='fa33a783-bd89-46e1-9306-6839dc141b65',
            fous_is_bidirectional=True,
            inst_id_user='c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
            inst_id_fous='c5ff952d-cfa0-4e22-9403-5530b6bbe91e',
            name_user=self.name_user,
            name_fous=self.name_fous,
            inst_name_user=self.inst_name,
            inst_name_fous=self.inst_name,
            user_email=self.user_email,
            fous_email=self.fous_email,
            user_degree=self.user_degree,
            fous_degree=self.user_degree,
            user_photo=None,
            fous_photo=None)

        follow_user.save()

        response = self.client.get(
            path=f'{self.URL}suggested_users/c5ff952d-cfa0-4e22-9403-5530b6bbe91e/738b3f09-cfed-4925-acf4-57eea6ac4219/',
            format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], Messages.SUCCESSFUL_MESSAGE)

    def test_is_followed(self):
        response = self.client.get(
            path=f'{self.URL}is_followed/5a783136-bc81-4260-8b8f-628661d2e58c/'
                 f'738b3f09-cfed-4925-acf4-57eea6ac4219/056fd787-dd67-4878-a6d5-a2b766d3e917/',
            format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], Messages.SUCCESSFUL_MESSAGE)

    def test_unfollow(self):
        unfollow_json = {"user_id": "738b3f09-cfed-4925-acf4-57eea6ac4219",
                         "fous_user_id": "056fd787-dd67-4878-a6d5-a2b766d3e917",
                         "fous_is_bidirectional": True,
                         "inst_id_user": '5a783136-bc81-4260-8b8f-628661d2e58c',
                         "inst_id_fous": '5a783136-bc81-4260-8b8f-628661d2e58c',
                         "name_user": self.name_user,
                         "name_fous": self.name_fous,
                         "inst_name_user": self.inst_name,
                         "inst_name_fous": self.inst_name,
                         "user_email": self.user_email,
                         "fous_email": self.fous_email,
                         "user_degree": self.user_degree,
                         "fous_degree": self.user_degree,
                         'user_photo': '198899fd-95a8-4ec9-a691-094bc7c44f8d',
                         'fous_photo': '10b4c211-a072-41d3-a5ff-7b8bb05e0247'}

        response = self.client.post(path=f'{self.URL}unfollow/738b3f09-cfed-4925-acf4-57eea6ac4219/',
                                    data=unfollow_json, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], CustomMessages.USER_STOPPED_FOLLOWING % self.name_fous)

    def test_unfollow_does_not_exist(self):
        unfollow_json = {"user_id": "738b3f09-cfed-4925-acf4-57eea6ac4210",
                         "fous_user_id": "056fd787-dd67-4878-a6d5-a2b766d3e917",
                         "fous_is_bidirectional": True,
                         "inst_id_user": '5a783136-bc81-4260-8b8f-628661d2e58c',
                         "inst_id_fous": '5a783136-bc81-4260-8b8f-628661d2e58c',
                         "name_user": self.name_user,
                         "name_fous": self.name_fous,
                         "inst_name_user": self.inst_name,
                         "inst_name_fous": self.inst_name,
                         "user_email": self.user_email,
                         "fous_email": self.fous_email,
                         "user_degree": self.user_degree,
                         "fous_degree": self.user_degree,
                         'user_photo': None,
                         'fous_photo': None}

        response = self.client.post(path=f'{self.URL}unfollow/738b3f09-cfed-4925-acf4-57eea6ac4210/',
                                    data=unfollow_json, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], [])

    def test_unfollow_by_fous_user_id(self):
        unfollow_json = {"user_id": "738b3f09-cfed-4925-acf4-57eea6ac4219",
                         "fous_user_id": "056fd787-dd67-4878-a6d5-a2b766d3e917",
                         "fous_is_bidirectional": True,
                         "inst_id_user": '5a783136-bc81-4260-8b8f-628661d2e58c',
                         "inst_id_fous": '5a783136-bc81-4260-8b8f-628661d2e58c',
                         "name_user": self.name_user,
                         "name_fous": self.name_fous,
                         "inst_name_user": self.inst_name,
                         "inst_name_fous": self.inst_name,
                         "user_email": self.user_email,
                         "fous_email": self.fous_email,
                         "user_degree": self.user_degree,
                         "fous_degree": self.user_degree,
                         'user_photo': None,
                         'fous_photo': None}

        response = self.client.post(path=f'{self.URL}unfollow/056fd787-dd67-4878-a6d5-a2b766d3e917/',
                                    data=unfollow_json, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], CustomMessages.USER_STOPPED_FOLLOWING % self.name_user)

    def test_unfollow_fous_is_bidirectional(self):
        unfollow_json = {"user_id": "738b3f09-cfed-4925-acf4-57eea6ac4219",
                         "fous_user_id": "056fd787-dd67-4878-a6d5-a2b766d3e917",
                         "fous_is_bidirectional": False,
                         "inst_id_user": '5a783136-bc81-4260-8b8f-628661d2e58c',
                         "inst_id_fous": '5a783136-bc81-4260-8b8f-628661d2e58c',
                         "name_user": self.name_user,
                         "name_fous": self.name_fous,
                         "inst_name_user": self.inst_name,
                         "inst_name_fous": self.inst_name,
                         "user_email": self.user_email,
                         "fous_email": self.fous_email,
                         "user_degree": self.user_degree,
                         "fous_degree": self.user_degree,
                         'user_photo': None,
                         'fous_photo': None}

        response = self.client.post(path=f'{self.URL}unfollow/738b3f09-cfed-4925-acf4-57eea6ac4219/',
                                    data=unfollow_json, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], CustomMessages.USER_STOPPED_FOLLOWING % self.name_fous)
