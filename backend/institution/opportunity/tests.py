import json
from datetime import datetime

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from asn_institution.messages import CustomMessages
from opportunity.models import OpportunityModel
from opportunity.serializer import OpportunitySerializer


class OpportunityTestCase(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8091/institutions/api/opportunity/'
    user_name = 'Paola Pájaro'
    employer_email = 'yindypaolapu@ufps.edu.co'
    application_url = 'http://localhost:4200/'
    type_contract = 'Media Jornada'
    oppo_country = {'id': 48,
                    'name': 'Colombia',
                    'iso2': 'CO'}
    oppo_department = {'id': 2877,
                       'name': 'Norte de Santander',
                       'iso2': 'NSA'}
    oppo_municipality = {'id': 20772,
                         'name': 'Cúcuta'}
    file_path = 'C:/Users/HP/Desktop/Comprobante de pago en linea.pdf'
    name_file = 'new_pdf.pdf'
    type_content = 'multipart/form-data'

    def setUp(self):
        self.client = APIClient()
        opportunity = OpportunityModel(
            inst_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            user_id='fa33a783-bd89-46e1-9306-6839dc141b05',
            user_name=self.user_name,
            user_photo='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            oppo_title='Oportunidad desde las pruebas unitarias e integración',
            oppo_description='Esta oportunidad es creada desde las pruebas unitarias e integración',
            oppo_expiration_date=datetime.now(),
            oppo_employer_email=self.employer_email,
            oppo_simple_request=False,
            oppo_application_url=self.application_url,
            oppo_type_contract=self.type_contract,
            oppo_postulates=['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
            oppo_attachments=[],
            oppo_user_saved=['fa33a783-bd89-46e1-9306-6839dc141b08'],
            oppo_country=self.oppo_country,
            oppo_department=self.oppo_department,
            oppo_municipality=self.oppo_municipality,
            oppo_remuneration='5000000',
            created_date=datetime.now(),
        )
        opportunity.save()
        self.oppo_id = opportunity.id

        opportunity_with_user_id = OpportunityModel(
            inst_id='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            user_id='fa33a783-bd89-46e1-9306-6839dc141b06',
            user_name=self.user_name,
            user_photo='3fa85f64-5717-4562-b3fc-2c963f66afa6',
            oppo_title='Oportunidad desde las pruebas unitarias e integración',
            oppo_description='Esta oportunidad es creada desde las pruebas unitarias e integración',
            oppo_expiration_date=datetime.now(),
            oppo_employer_email=self.employer_email,
            oppo_simple_request=False,
            oppo_application_url=self.application_url,
            oppo_type_contract=self.type_contract,
            oppo_postulates=['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
            oppo_attachments=[],
            oppo_user_saved=['fa33a783-bd89-46e1-9306-6839dc141b05'],
            oppo_country=self.oppo_country,
            oppo_department=self.oppo_department,
            oppo_municipality=self.oppo_municipality,
            oppo_remuneration='5000000',
            created_date=datetime.now(),
        )
        opportunity_with_user_id.save()

    def test_get_opportunity_list(self):
        response = self.client.get(path=self.URL, format='json')
        result = json.loads(response.content)
        opportunities = OpportunityModel.objects.all()
        serializer = OpportunitySerializer(opportunities, many=True)

        self.assertEqual(result['data'], serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['paginator']['count'], 2)

    def test_create_opportunity(self):
        test_opportunity = {'inst_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                            'user_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                            'user_name': self.user_name,
                            'user_photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                            'oppo_title': 'Oportunidad desde las pruebas unitarias e integración 2',
                            'oppo_description': 'Esta oportunidad es creada desde las pruebas unitarias e'
                                                + ' integración',
                            'oppo_expiration_date': '15-01-2021',
                            'oppo_employer_email': self.employer_email,
                            'oppo_simple_request': False,
                            'oppo_application_url': self.application_url,
                            'oppo_type_contract': self.type_contract,
                            'oppo_postulates': [],
                            'oppo_attachments': [],
                            'oppo_user_saved': ['fa33a783-bd89-46e1-9306-6839dc141b05'],
                            'oppo_country': self.oppo_country,
                            'oppo_department': self.oppo_department,
                            'oppo_municipality': self.oppo_municipality,
                            'oppo_remuneration': '5,000,000',
                            'created_date': '01-02-2021'}

        response = self.client.post(path=self.URL, data=test_opportunity, format='json')
        result = json.loads(response.content)['data']

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('inst_id', result)
        self.assertIn('user_id', result)
        self.assertIn('user_name', result)
        self.assertIn('user_photo', result)
        self.assertIn('oppo_title', result)
        self.assertIn('oppo_description', result)
        self.assertIn('oppo_expiration_date', result)
        self.assertIn('oppo_employer_email', result)
        self.assertIn('oppo_simple_request', result)
        self.assertIn('oppo_application_url', result)
        self.assertIn('oppo_type_contract', result)
        self.assertIn('oppo_postulates', result)
        self.assertIn('oppo_attachments', result)
        self.assertIn('oppo_user_saved', result)
        self.assertIn('oppo_country', result)
        self.assertIn('oppo_department', result)
        self.assertIn('oppo_municipality', result)
        self.assertIn('oppo_remuneration', result)
        self.assertIn('created_date', result)

        if 'id' in result:
            del result['id']
            del result['created_date']
            del test_opportunity['created_date']

        self.assertEqual(result, test_opportunity)

    def test_get_by_id_opportunity(self):
        response = self.client.get(f'{self.URL}{self.oppo_id}/', format='json')
        result = json.loads(response.content)['data']

        opportunity = OpportunityModel.objects.get(id=self.oppo_id)
        serializer = OpportunitySerializer(opportunity)

        self.assertEqual(result, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_patch_opportunity(self):
        tests_update = {'inst_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                        'user_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'user_name': self.user_name,
                        'user_photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                        'oppo_title': 'Oportunidad desde las pruebas unitarias e integración 2',
                        'oppo_description': 'Esta oportunidad es creada desde las pruebas de uniintegración',
                        'oppo_expiration_date': '15-01-2021',
                        'oppo_employer_email': self.employer_email,
                        'oppo_simple_request': False,
                        'oppo_application_url': self.application_url,
                        'oppo_type_contract': self.type_contract,
                        'oppo_postulates': [],
                        'oppo_attachments': [],
                        'oppo_user_saved': ['fa33a783-bd89-46e1-9306-6839dc141b05'],
                        'oppo_country': self.oppo_country,
                        'oppo_department': self.oppo_department,
                        'oppo_municipality': self.oppo_municipality,
                        'oppo_remuneration': '5,000,000',
                        'created_date': '01-02-2021'}

        response = self.client.put(path=f'{self.URL}{self.oppo_id}/', data=tests_update, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if 'id' in result:
            del result['id']
            del result['created_date']
            del tests_update['created_date']

        self.assertEqual(result, tests_update)

    def test_delete_opportunity(self):
        response = self.client.delete(f'{self.URL}{self.oppo_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        opportunity_exists = OpportunityModel.objects.filter(id=self.oppo_id)
        self.assertFalse(opportunity_exists)

    def test_apply_opportunity(self):
        with open(self.file_path, 'rb') as file:
            uploaded_file = SimpleUploadedFile(self.name_file, file.read(), content_type=self.type_content)

        image_send = {'file': uploaded_file,
                      'user_id': 'bae9820f-ef39-4224-9a6a-f3431b2ad1c2',
                      'user_name': self.user_name,
                      'opportunity': self.oppo_id}

        response = self.client.post(path=f'{self.URL}apply_opportunity/', data=image_send, format='multipart')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['message'], CustomMessages.RESUME_SENT)

    def test_apply_opportunity_does_not_exist(self):
        with open(self.file_path, 'rb') as file:
            uploaded_file = SimpleUploadedFile(self.name_file, file.read(), content_type=self.type_content)

        image_send = {'file': uploaded_file,
                      'user_id': 'bae9820f-ef39-4224-9a6a-f3431b2ad1c2',
                      'user_name': self.user_name,
                      'opportunity': 'bae9820f-ef39-4224-9a6a-f3431b2ad1c2'}

        response = self.client.post(path=f'{self.URL}apply_opportunity/', data=image_send, format='multipart')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(result['errors'][0]['detail'], CustomMessages.OPPORTUNITY_NOT_FOUND)

    def test_apply_opportunity_already_applied(self):
        with open(self.file_path, 'rb') as file:
            uploaded_file = SimpleUploadedFile(self.name_file, file.read(), content_type=self.type_content)

        image_send = {'file': uploaded_file,
                      'user_id': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                      'user_name': self.user_name,
                      'opportunity': self.oppo_id}

        response = self.client.post(path=f'{self.URL}apply_opportunity/', data=image_send, format='multipart')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['message'], CustomMessages.ALREADY_APPLIED)

    def test_user_opportunity_saved(self):
        response = self.client.get(
            path=f'{self.URL}user_opportunity_saved/'
                 f'3fa85f64-5717-4562-b3fc-2c963f66afa6/fa33a783-bd89-46e1-9306-6839dc141b05/',
            format='json')
        result = json.loads(response.content)['data'][0]

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('inst_id', result)
        self.assertIn('user_id', result)
        self.assertIn('user_name', result)
        self.assertIn('user_photo', result)
        self.assertIn('oppo_title', result)
        self.assertIn('oppo_description', result)
        self.assertIn('oppo_expiration_date', result)
        self.assertIn('oppo_employer_email', result)
        self.assertIn('oppo_simple_request', result)
        self.assertIn('oppo_application_url', result)
        self.assertIn('oppo_type_contract', result)
        self.assertIn('oppo_postulates', result)
        self.assertIn('oppo_attachments', result)
        self.assertIn('oppo_user_saved', result)
        self.assertIn('oppo_country', result)
        self.assertIn('oppo_department', result)
        self.assertIn('oppo_municipality', result)
        self.assertIn('oppo_remuneration', result)
        self.assertIn('created_date', result)

    def test_user_opportunity_saved_does_not_exist(self):
        response = self.client.get(
            path=f'{self.URL}user_opportunity_saved/'
                 f'4fa85f64-5717-4562-b3fc-2c963f66afa7/fa33a783-bd89-46e1-9306-6839dc141b06/', format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result, [])

    def test_cascade_update_user_opportunity(self):
        tests_update = {'user_id': 'fa33a783-bd89-46e1-9306-6839dc141b05',
                        'user_name': self.user_name,
                        'user_photo': '3fa85f64-5717-4562-b3fc-2c963f66afa6'}
        response = self.client.put(path=f'{self.URL}cascade_update_user/', data=tests_update, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cascade_delete_user_opportunity(self):
        response = self.client.delete(path=f'{self.URL}cascade_delete_user/fa33a783-bd89-46e1-9306-6839dc141b06/',
                                      format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
