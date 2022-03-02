import json
import random
import string

from common_structure_microservices.messages import Messages
from common_structure_microservices.utilities import Enums, Constants
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from asn_security.execption import TokenWithUserNotFoundException
from asn_security.messages import CustomMessages


class SecurityManagersTests(TestCase):
    client = APIClient()
    URL = 'http://127.0.0.1:8094/securities/api/security/'
    access_token = None
    email = ''.join(random.choices(string.digits + string.ascii_lowercase, k=15)) + '@ufps.edu.co'
    password = 'Davinci.2021'
    user_email = 'yindypaolapu@ufps.edu.co'

    def setUp(self):
        self.client = APIClient()
        self.test_login()

    def test_login(self):
        test_login = {'user_email': self.user_email,
                      'password': self.password,
                      'provider': Enums.REGULAR_PROVIDER}

        response = self.client.post(path=f'{self.URL}login/', data=test_login, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', result)
        self.assertIn('user', result)

        self.access_token = result['access_token']

    def test_login_by_google_provider(self):
        test_login = {'user_email': self.user_email,
                      'password': self.password,
                      'provider': Enums.GOOGLE_PROVIDER,
                      'user_google': {'email': 'silux@ufps.edu.co'}}

        response = self.client.post(path=f'{self.URL}login/', data=test_login, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', result)
        self.assertIn('user', result)

    def test_confirm_forgot_password(self):
        forgot_password = {
            'user': 'noexistes@ufps.edu.co',
            'new_password': self.password,
            'confirmation_code': '467163'
        }
        response = self.client.post(path=f'{self.URL}confirm-forgot-password/', data=forgot_password, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(result['errors'][0]['detail'], 'El usuario es inválido.')

    def test_forgot_password(self):
        test_user = {'user': 'eytutampocoexistes@ufps.edu.co'}

        response = self.client.post(path=f'{self.URL}forgot_password/', data=test_user, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(result['errors'][0]['detail'], Messages.INSTANCE_DOES_NOT_EXIST % 'El usuario')

    def test_refresh_access_token(self):
        test_token = {'access_token': self.access_token}

        response = self.client.post(path=f'{self.URL}refresh_token/', data=test_token, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', result)
        self.assertEqual(test_token, result)

    def test_refresh_access_token_does_not_exist(self):
        test_token = {'access_token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAyNjEzN2E3LTU2M2EtNDU4Yi04NzU1LTg0YjBiMTFkMWJlNiIsImluc3RfaWQiOiIzZmE4NWY2NC01NzE3LTQ1NjItYjNmYy0yYzk2M2Y2NmFmYTYiLCJpbnN0X25hbWUiOiJVbml2ZXJzaWRhZCBGcmFuY2lzY28gZGUgUGF1bGEgU2FudGFuZGVyIiwidXNlcl9uYW1lIjoiIyIsInVzZXJfZW1haWwiOiJob21lcm9zaW1wc29uQHVmcHMuZWR1LmNvIiwidXNlcl9wcm92aWRlciI6IlJlZ3VsYXIiLCJ1c2VyX3JvbGUiOltdLCJyb2xlX2FjdGl2ZSI6bnVsbCwidXNlcl9hZG1pbiI6ZmFsc2UsInVzZXJfaW50cm8iOiIiLCJ1c2VyX2ludGVyZXN0IjpbXSwidXNlcl9waG9uZSI6bnVsbCwidXNlcl9waG90byI6bnVsbCwidXNlcl9nZW5kZXIiOiJNdWplciIsInVzZXJfZGVncmVlIjp7ImlkIjoiZjdjMGE1MTYtYmFlZS00ZTNlLWI0ZDItNWRiNmIzZjhhYmU5IiwiY2FyZWVyX25hbWUiOiJBblx1MDBlMWxpc2lzIGRlIERhdG9zIHBhcmEgbGEgSW52ZXN0aWdhY2lcdTAwZjNuIENpZW50XHUwMGVkZmljYSJ9LCJ1c2VyX3Byb2plY3RzIjpbXSwidXNlcl9jdXJyaWN1bHVtX3ZpdGFlIjpudWxsLCJ1c2VyX3NraWxsIjpbXSwidXNlcl9jb3VudHJ5Ijp7ImlkIjo0OCwibmFtZSI6IkNvbG9tYmlhIiwiaXNvMiI6IkNPIn0sInVzZXJfZGVwYXJ0bWVudCI6eyJpZCI6Mjg3NywibmFtZSI6Ik5vcnRlIGRlIFNhbnRhbmRlciIsImlzbzIiOiJOU0EifSwidXNlcl9tdW5pY2lwYWxpdHkiOnsiaWQiOjIwNzcyLCJuYW1lIjoiQ1x1MDBmYWN1dGEifSwidXNlcl9zdGF0dXMiOiJJbmFjdGl2byIsImV4cCI6MTYzODUyMDAxMywidG9rZW5fdHlwZSI6IkFDQ0VTU19UT0tFTiJ9.01fq0YGmLlb4U6hthmZQj7-gx3cIGmUeKMeiiSbfvgk'}

        response = self.client.post(path=f'{self.URL}refresh_token/', data=test_token, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn(result['errors'][0]['detail'], TokenWithUserNotFoundException.default_detail)

    def test_user_from_token(self):
        test_token = {'access_token': self.access_token}

        response = self.client.post(path=f'{self.URL}user-from-token/', data=test_token, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('key', result)
        self.assertIn('user', result)

    def test_user_from_token_does_not_exist(self):
        test_token = {'access_token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjFjZWViMDFlLTE0NDYtNDFmZC05YWJj'
                                      'LTI5NmEyMDVjZTk4ZSIsImluc3RfaWQiOiIzZmE4NWY2NC01NzE3LTQ1NjItYjNmYy0yYzk2M2Y2N'
                                      'Ijp7ImlkIjo0OCwibmFtZSI6IkNvbG9tYmlhIiwiaXNvMiI6IkNPIn0sInVzZXJfZGVwYXJ0bWVud'
                                      'CI6eyJpZCI6Mjg3NywibmFtZSI6Ik5vcnRlIGRlIFNhbnRhbmRlciIsImlzbzIiOiJOU0EifSwidX'
                                      'Nlcl9tdW5pY2lwYWxpdHkiOnsiaWQiOjIwNzcyLCJuYW1lIjoiQ1x1MDBmYWN1dGEifSwidXNlcl9'
                                      'zdGF0dXMiOiJBY3Rpdm8iLCJleHAiOjE2MzMwNTU3ODksInRva2VuX3R5cGUiOiJBQ0NFU1NfVE9L'
                                      'RU4ifQ.3-W2UfUSIWKZ09Nl2azDbtwwTOxpV6_BXWE_1NkTWFo'}

        response = self.client.post(path=f'{self.URL}user-from-token/', data=test_token, format='json')
        result = json.loads(response.content)['data']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(result['status_token'], Constants.INVALID)

    def test_logout(self):
        test_user = {'user': self.user_email}
        response = self.client.post(path=f'{self.URL}logout/', data=test_user, format='json')
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(result['message'], CustomMessages.LOG_OUT_SUCCESSFULLY)
