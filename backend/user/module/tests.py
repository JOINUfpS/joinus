import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from module.models import ModuleModel
from module.serializer import ModuleSerializer


class ModuleTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8092/users/api/module/'

    def setUp(self):
        self.client = APIClient()
        module = ModuleModel(modu_name='Pruebas uniarias e integración',
                             modu_router='/tesis-asn/pruebas/',
                             modu_icon='prueba',
                             modu_status='Activo',
                             modu_permissions=["VER",
                                               "CREAR",
                                               "EDITAR",
                                               "BORRAR"],
                             modu_is_generic=False)
        module.save()
        self.modu_id = module.id

    def test_get_module_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        modules = ModuleModel.objects.all()
        serializer = ModuleSerializer(modules, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_module(self):
        test_module = {"modu_name": "Comunidades",
                       "modu_router": "/usuarios/comunidades",
                       "modu_icon": "community",
                       "modu_status": "Activo",
                       "modu_permissions": ["VER",
                                            "CREAR",
                                            "EDITAR",
                                            "BORRAR"],
                       "modu_is_generic": False}

        response = self.client.post(path=self.URL, data=test_module, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('modu_name', result)
        self.assertIn('modu_router', result)
        self.assertIn('modu_icon', result)
        self.assertIn('modu_status', result)
        self.assertIn('modu_permissions', result)
        self.assertIn('modu_is_generic', result)

        if 'id' in result:
            del result['id']

        self.assertEqual(result, test_module)

    def test_get_by_id_module(self):
        response = self.client.get(f'{self.URL}{self.modu_id}/', format='json')
        result = json.loads(response.content)['data']

        module = ModuleModel.objects.get(id=self.modu_id)
        serializer = ModuleSerializer(module)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_id_serializer(self):
        module_serializer = ModuleSerializer()
        result = module_serializer.get_modules(modu_id=self.modu_id)
        self.assertIsNotNone(result)

    def test_get_by_none_id_serializer(self):
        module_serializer = ModuleSerializer()
        result = module_serializer.get_modules()
        self.assertIsNotNone(result)

    def test_get_by_id_serializer_does_not_exist(self):
        module_serializer = ModuleSerializer()
        result = module_serializer.get_modules(modu_id='9b9a9128-2c55-4f89-b2ca-9dea104f09ae')
        self.assertLessEqual(result, [])

    def test_update_patch_module(self):
        tests_update = {"modu_name": "Comunidad",
                        "modu_router": "/usuarios/comunidades",
                        "modu_icon": "community",
                        "modu_status": "Activo",
                        "modu_permissions": ["VER",
                                             "CREAR",
                                             "EDITAR"],
                        "modu_is_generic": False}

        response = self.client.put(path=f'{self.URL}{self.modu_id}/', data=tests_update, format='json')
        result = json.loads(response.content)['data']
        
        if 'id' in result:
            del result['id']

        self.assertEqual(result, tests_update)

    def test_delete_module(self):
        response = self.client.delete(f'{self.URL}{self.modu_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        module_exists = ModuleModel.objects.filter(id=self.modu_id)
        self.assertFalse(module_exists)
