import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from asn_institution.messages import CustomMessages
from institution.models import InstitutionModel
from institution.serializer import InstitutionSerializer


class InstitutionTestCase(TestCase):
    client = APIClient()
    URL = "http://127.0.0.1:8091/institutions/api/institution/"
    inst_address = 'Esto es una institución de prueba'

    def setUp(self):
        self.client = APIClient()
        institution = InstitutionModel(
            inst_name='Institución de prueba',
            inst_photo='fa33a783-bd89-46e1-9306-6839dc141b05',
            inst_address=self.inst_address,
            inst_country='Colombia',
            inst_department='Norte de santander',
            inst_municipality='Cucúta',
            inst_head='Fernando y Paola',
            inst_website='https://www.joinufps.com.co',
            inst_phone='555555',
            inst_fax='0405')
        institution.save()
        self.inst_id = institution.id

    def test_get_institution_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        institutions = InstitutionModel.objects.all()
        serializer = InstitutionSerializer(institutions, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 1)

    def test_create_institution(self):
        test_institution = {'inst_name': 'Institución de prueba 90',
                            'inst_photo': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                            'inst_address': self.inst_address,
                            'inst_country': 'Estados unidos',
                            'inst_department': 'Hawái',
                            'inst_municipality': 'Honolulu',
                            'inst_head': 'Fernando, Paola y Hawái',
                            'inst_website': 'https://ww2.ufps.edu.co/',
                            'inst_phone': '555555',
                            'inst_fax': '0405', }

        response = self.client.post(path=self.URL, data=test_institution, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('inst_name', result)
        self.assertIn('inst_photo', result)
        self.assertIn('inst_address', result)
        self.assertIn('inst_country', result)
        self.assertIn('inst_department', result)
        self.assertIn('inst_municipality', result)
        self.assertIn('inst_head', result)
        self.assertIn('inst_website', result)
        self.assertIn('inst_phone', result)
        self.assertIn('inst_fax', result)

        if 'id' in result:
            del result['id']

        self.assertEqual(result, test_institution)

    def test_get_by_id_institution(self):
        response = self.client.get(f'{self.URL}{self.inst_id}/', format='json')
        result = json.loads(response.content)['data']

        institution = InstitutionModel.objects.get(id=self.inst_id)
        serializer = InstitutionSerializer(institution)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_institution(self):
        tests_update = {'id': str(self.inst_id),
                        'inst_name': 'Institución de prueba 2',
                        'inst_photo': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'inst_address': 'Esto es la actualización de la institución del setup',
                        'inst_country': 'Polinesia Francesa',
                        'inst_department': 'Papeete',
                        'inst_municipality': 'Maupiti',
                        'inst_head': 'Fernando y Paola en la Polinesia Francesa',
                        'inst_website': 'https://www.ufps1.edu.co/',
                        'inst_phone': '555555',
                        'inst_fax': '0405'}

        response = self.client.put(path=f'{self.URL}{self.inst_id}/', data=tests_update, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(result, tests_update)

    def test_update_patch_institution_with_error(self):
        tests_update = {'inst_name': 'Institución de prueba 2',
                        'inst_photo': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'inst_address': 'Esto es la actualización de la institución del setup',
                        'inst_country': 'Polinesia Francesa',
                        'inst_department': 'Papeete',
                        'inst_municipality': 'Maupiti',
                        'inst_head': 'Fernando y Paola en la Polinesia Francesa',
                        'inst_website': 'https://www.ufps1.edu.co/',
                        'inst_phone': '555555',
                        'inst_fax': '0405'}

        response = self.client.put(path=f'{self.URL}{self.inst_id}/', data=tests_update, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_institution(self):
        response = self.client.delete(f'{self.URL}{self.inst_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        institution_exists = InstitutionModel.objects.filter(id=self.inst_id)
        self.assertFalse(institution_exists)

    def test_delete_institution_that_has_users(self):
        institution = InstitutionModel(
            id='4fa85f64-5717-4562-b3fc-2c963f66afa7',
            inst_name='Institución de prueba de eliminación',
            inst_photo='fa33a783-bd89-46e1-9306-6839dc141b05',
            inst_address=self.inst_address,
            inst_country='Colombia',
            inst_department='Norte de santander',
            inst_municipality='Cucúta',
            inst_head='Fernando y Paola',
            inst_website='https://www.joinufps.com.co',
            inst_phone='555555',
            inst_fax='0405')
        institution.save()

        response = self.client.delete(f'{self.URL}4fa85f64-5717-4562-b3fc-2c963f66afa7/', format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        result = json.loads(response.content)
        self.assertEqual(result['errors'][0]['detail'], CustomMessages.INSTITUTION_CANNOT_BE_REMOVED)
