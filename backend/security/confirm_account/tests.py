import json

from django.contrib.auth.hashers import make_password
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from asn_security.messages import CustomMessages
from confirm_account.models import ConfirmAccountModel


class ConfirmAccountManagersTests(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8094/securities/api/confirm_account/'
    user_email = 'yindypaolapu@ufps.edu.co'

    def setUp(self):
        self.client = APIClient()
        confirm_account = ConfirmAccountModel(user_id='95185f7c-6d10-41ac-a67d-126d2f428e62',
                                              user_email='fercho17@ufps.edu.co',
                                              user_password='',
                                              temporal_password=make_password('0405;FP'),
                                              account_status='FORZAR_CAMBIO_CONTRASEÑA',
                                              created_date='2021-10-13T00:55:21.126Z')
        confirm_account.save()
        self.coac_id = confirm_account.id

    def test_create_confirm_account(self):
        test_account = {
            'user_id': '95185f7c-6d10-41ac-a67d-126d2f428e62',
            'user_email': 'yindypaolapu@ufps.edu.co',
            'user_password': 'Davinci.2021',
            'temporal_password': 'string',
            'account_status': 'FORZAR_CAMBIO_CONTRASEÑA',
            'created_date': '2021-10-13T00:55:21.126000Z'}

        response = self.client.post(path=f'{self.URL}', data=test_account, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', result)
        self.assertIn('user_id', result)
        self.assertIn('user_email', result)
        self.assertIn('account_status', result)
        self.assertIn('created_date', result)

        if 'id' in result:
            del result['id']
            del test_account['user_password']
            del test_account['temporal_password']

        self.assertEqual(result, test_account)

    def test_confirming_account(self):
        test_account = {
            'user_id': '95185f7c-6d10-41ac-a67d-126d2f428e62',
            'user_email': 'fercho17@ufps.edu.co',
            'user_password': 'String.2018',
            'temporal_password': '0405;FP',
            'account_status': 'CONFIRMADO',
            'created_date': '2021-10-13T00:58:50.626Z'}
        response = self.client.put(path=f'{self.URL}confirming_account/', data=test_account, format='json')
        result = json.loads(response.content)['message']

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result, CustomMessages.ACCOUNT_CONFIRMED_SUCCESSFULLY)

    def test_confirming_account_does_not_exist(self):
        test_account = {
            'user_id': 'f9dabf5b-954c-46b7-b20a-1df80f5b8310',
            'user_email': 'eytunoexistes@ufps.edu.co',
            'user_password': 'String.2018',
            'temporal_password': '0405;FP',
            'account_status': 'CONFIRMADO',
            'created_date': '2021-10-13T00:58:50.626Z'}
        response = self.client.put(path=f'{self.URL}confirming_account/', data=test_account, format='json')
        result = json.loads(response.content)['errors'][0]['detail']

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(result, CustomMessages.ACCOUNT_DOES_NOT_EXIST)

    def test_delete_confirm_account(self):
        response = self.client.delete(path=f'{self.URL}{self.coac_id}/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
