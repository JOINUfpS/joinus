import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from university_career.models import UniversityCareerModel
from university_career.serializer import UniversityCareerSerializer


class UniversityCareerTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8095/utilities/api/university_career/'

    def setUp(self):
        self.client = APIClient()
        university_career = UniversityCareerModel(
            id='fa33a783-bd89-46e1-9306-6839dc141b05',
            career_name='Psicología')
        university_career.save()
        self.unca = university_career.id

    def test_get_university_career_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        university_careers = UniversityCareerModel.objects.all()
        serializer = UniversityCareerSerializer(university_careers, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_university_career(self):
        test_university_career = {'career_name': 'Aviación'}

        response = self.client.post(path=self.URL, data=test_university_career, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', result)
        self.assertIn('career_name', result)

        if 'id' in result:
            del result['id']

        self.assertEqual(result, test_university_career)

    def test_get_by_id_university_career(self):
        response = self.client.get(f'{self.URL}{self.unca}/', format='json')
        result = json.loads(response.content)['data']

        university_career = UniversityCareerModel.objects.get(id=self.unca)
        serializer = UniversityCareerSerializer(university_career)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_university_career(self):
        tests_update = {'id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'career_name': 'Medicina'}

        response = self.client.put(path=f'{self.URL}{self.unca}/', data=tests_update, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(result, tests_update)

    def test_delete_university_career(self):
        response = self.client.delete(f'{self.URL}{self.unca}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        university_career_exists = UniversityCareerModel.objects.filter(id=self.unca)
        self.assertFalse(university_career_exists)
