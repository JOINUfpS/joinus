import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from category.models import CategoryModel
from category.serializer import CategorySerializer


class CategoryTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8095/utilities/api/category/'

    def setUp(self):
        self.client = APIClient()
        category = CategoryModel(
            inst_id='fa33a783-bd89-46e1-9306-6839dc141b05',
            cate_name='Categoria de prueba',
            cate_description='Esto es una categoria de prueba',
            cate_type='Comunidad',
            cate_status='Activo'
        )
        category.save()
        self.cate_id = category.id

    def test_get_category_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        categories = CategoryModel.objects.all()
        serializer = CategorySerializer(categories, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_category(self):
        test_category = {'inst_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                         'cate_name': 'Esto es una prueba de categorias',
                         'cate_description': 'Esta categoria fue creada desde las pruebas unitarias',
                         'cate_type': 'Comunidad',
                         'cate_status': 'Activo'}

        response = self.client.post(path=self.URL, data=test_category, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('inst_id', result)
        self.assertIn('cate_name', result)
        self.assertIn('cate_description', result)
        self.assertIn('cate_type', result)
        self.assertIn('cate_status', result)

        if 'id' in result:
            del result['id']

        self.assertEqual(result, test_category)

    def test_get_by_id_category(self):
        response = self.client.get(f'{self.URL}{self.cate_id}/', format='json')
        result = json.loads(response.content)['data']

        category = CategoryModel.objects.get(id=self.cate_id)
        serializer = CategorySerializer(category)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_category(self):
        tests_update = {'inst_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'cate_name': 'Categoria de prueba',
                        'cate_description': 'Esto es una actualización de la categoria del setup',
                        'cate_type': 'Comunidad',
                        'cate_status': 'Activo'}
        response = self.client.put(path=f'{self.URL}{self.cate_id}/', data=tests_update, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if 'id' in result:
            del result['id']

        self.assertEqual(result, tests_update)

    def test_delete_category(self):
        response = self.client.delete(f'{self.URL}{self.cate_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        category_exists = CategoryModel.objects.filter(id=self.cate_id)
        self.assertFalse(category_exists)
