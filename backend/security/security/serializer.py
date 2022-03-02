import binascii
import datetime
import json
import os
from base64 import b64decode
from random import random

import jwt
from common_structure_microservices.entity_url import EntityUrlMap
from common_structure_microservices.exception import GenericMicroserviceError
from common_structure_microservices.messages import Messages
from common_structure_microservices.remote import RemoteModel
from common_structure_microservices.send_email import send_email
from common_structure_microservices.utilities import Enums, Constants
from dateutil.relativedelta import relativedelta
from django_user_agents.utils import get_user_agent
from jwt import ExpiredSignatureError
from rest_framework import serializers, status

from asn_security.execption import TokenWithUserNotFoundException
from asn_security.messages import CustomMessages
from confirm_account.models import ConfirmAccountModel
from security.models import SecurityModel


class SecuritySerializer(serializers.Serializer):
    SECRET = binascii.b2a_hex(os.urandom(20))

    class Meta:
        model = SecurityModel
        fields = ('id',
                  'refresh_token',
                  'user_email',
                  'user',
                  'secu_date',
                  'secu_provider')


class LoginSerializer(serializers.Serializer):
    user_email = serializers.EmailField(required=False, allow_null=True)
    password = serializers.CharField(required=False, allow_null=True)
    provider = serializers.ChoiceField(required=False, choices=Enums.LIST_PROVIDERS)
    user_google = serializers.JSONField(required=False, allow_null=True)

    def login(self, request):
        user_email = self.validated_data.get('user_email')
        password = self.validated_data.get('password')
        provider = self.validated_data.get('provider')
        user_google = self.validated_data.get('user_google', None)
        user_agent = get_user_agent(request)

        remote_model = RemoteModel(request=self.context['request'], url=EntityUrlMap.USER)
        user_raw = {}
        confirm_account = ConfirmAccountModel.objects.filter(user_email=user_email)
        if len(confirm_account) > 0 and confirm_account[0].account_status == Enums.FORCE_CHANGE_PASSWORD:
            raise GenericMicroserviceError(status=status.HTTP_400_BAD_REQUEST,
                                           detail=CustomMessages.NECESSARY_CONFIRM_ACCOUNT)

        if provider is Enums.REGULAR_PROVIDER:
            params = {'user_email': f'{user_email}',
                      'user_password': f'{password}'}
            user_raw = remote_model.custom(url_path='validate_user_regular/', method='POST', data=params,
                                           raise_exception=True)

        elif provider is Enums.GOOGLE_PROVIDER:
            if user_google is None:
                raise GenericMicroserviceError(status=status.HTTP_404_NOT_FOUND,
                                               detail=CustomMessages.INCOMPLETE_INFORMATION_USER)

            user = {'user_google': user_google}
            user_raw = remote_model.custom(url_path='validate_user_google/', method='POST', data=user,
                                           raise_exception=True)

        if not user_raw:
            raise GenericMicroserviceError(status=status.HTTP_404_NOT_FOUND,
                                           detail=CustomMessages.INCOMPLETE_INFORMATION_USER)

        user = json.loads(user_raw.content)['data']
        token_serailizer = TokenSerializer()
        refresh_token, access_token = token_serailizer.token_from_user(user)
        security_model = SecurityModel(id=access_token,
                                       refresh_token=refresh_token,
                                       user_email=user_email,
                                       user=json.loads(user_raw.content)['data'],
                                       user_agent=user_agent.ua_string,
                                       secu_date=datetime.datetime.now(),
                                       secu_provider=provider)
        security_model.save()

        message = CustomMessages.LOGGED_IN_SUCCESSFULLY
        data = {'access_token': access_token, 'user': json.loads(user_raw.content)['data']}
        return message, data


class ForgotPasswordSerializer(serializers.Serializer):
    user = serializers.EmailField(required=True)

    def forgot_password(self):
        user = self.validated_data.get('user')
        remote_model_user = RemoteModel(request=self.context['request'], url=EntityUrlMap.USER)
        code = int(random() * 1000000 + 1)
        data = {'user': f'{user}',
                'confirmation_code': f'{code}'}
        response = json.loads(remote_model_user.custom(url_path="forgot_password", method="PUT", data=data).content)

        if len(response) == 0:
            raise GenericMicroserviceError(status=status.HTTP_404_NOT_FOUND,
                                           detail=Messages.INSTANCE_DOES_NOT_EXIST % 'El usuario ingresado')

        context = {'code': code}

        send_email(file='forgot_password.html', send_to_list=[user], context=context,
                   subject=CustomMessages.FORGOT_PASSWORD_SUBJECT)


class ConfirmForgotPasswordSerializer(serializers.Serializer):
    user = serializers.EmailField(required=True)
    new_password = serializers.CharField(required=True)
    confirmation_code = serializers.CharField(required=True)

    def confirm_forgot_password(self):
        user = self.validated_data.get('user')
        new_password = self.validated_data.get('new_password')
        confirmation_code = self.validated_data.get('confirmation_code')

        remote_model_user = RemoteModel(request=self.context['request'], url=EntityUrlMap.USER)

        data = {'user': f'{user}',
                'current_password': f'{confirmation_code}',
                'new_password': f'{new_password}'}
        response = json.loads(remote_model_user.custom(url_path="change_password", method="PUT", data=data).content)

        if len(response) == 0:
            raise GenericMicroserviceError(status=status.HTTP_404_NOT_FOUND,
                                           detail=Messages.INSTANCE_DOES_NOT_EXIST % 'El usuario ingresado')


class LogoutSerializer(serializers.Serializer):
    user = serializers.EmailField(required=True)

    def logout(self, request):
        user = self.validated_data.get('user')
        user_agent = get_user_agent(request)
        old_sessions = SecurityModel.objects.filter(user_email=user, user_agent=user_agent.ua_string)
        for old_session in old_sessions:
            old_session.delete()


class TokenSerializer(SecuritySerializer):
    access_token = serializers.CharField(required=True)

    def token_from_user(self, user_for_do_token):
        if 'user_role_structure' in user_for_do_token:
            user_for_do_token.pop('user_role_structure')

        user_refresh = user_for_do_token
        user_refresh.update({'exp': datetime.datetime.now() + relativedelta(years=1),
                             'token_type': Constants.REFRESH_TOKEN})
        refresh_token = jwt.encode(user_refresh, self.SECRET, algorithm="HS256")

        user_access = user_for_do_token
        user_access.update({'exp': datetime.datetime.now() + relativedelta(weeks=1),
                            'token_type': Constants.ACCESS_TOKEN})
        access_token = jwt.encode(user_access, self.SECRET, algorithm="HS256")

        return refresh_token, access_token

    def user_from_token(self):
        access_token = self.validated_data['access_token']
        model = SecurityModel
        try:
            jwt_options = {
                'verify_signature': False,
                'verify_exp': True,
                'verify_nbf': False,
                'verify_iat': True,
                'verify_aud': False
            }
            auth = model.objects.filter(id=access_token).get()
            jwt.decode(access_token, b64decode(self.SECRET), algorithms=["HS256"], options=jwt_options)

            data = {'key': auth.id,
                    "user": auth.user}

            return data, True

        except model.DoesNotExist:
            data = {"status_token": Constants.INVALID}
            return data, False
        except jwt.ExpiredSignatureError:
            data = {"status_token": Constants.EXPIRED}
            return data, False

    def refresh_token(self, request, user_email=None):
        access_token = self.validated_data.get('access_token')
        user_agent = get_user_agent(request)

        jwt_options = {
            'verify_signature': False,
            'verify_exp': True,
            'verify_nbf': False,
            'verify_iat': True,
            'verify_aud': False
        }

        try:
            access_token_decoded = jwt.decode(access_token, b64decode(self.SECRET), algorithms=["HS256"],
                                              options=jwt_options)
            expiration_date = datetime.datetime.fromtimestamp(access_token_decoded['exp'])
            if datetime.datetime.now() <= expiration_date:
                auth = SecurityModel.objects.filter(id=access_token,
                                                    user_email=access_token_decoded['user_email']).get()
                data = {"access_token": auth.id}

                return data

        except SecurityModel.DoesNotExist:
            raise TokenWithUserNotFoundException

        except ExpiredSignatureError:
            jwt_options.update({'verify_exp': False, 'verify_iat': False})
            access_token_decoded = jwt.decode(access_token, b64decode(self.SECRET), algorithms=["HS256"],
                                              options=jwt_options)
            try:
                models = SecurityModel.objects.filter(id=access_token, user_email=access_token_decoded['user_email'],
                                                      user_agent=user_agent.ua_string).get()
                expiration_date_refresh = datetime.datetime.fromtimestamp(access_token_decoded['exp'])
                if datetime.datetime.now() <= expiration_date_refresh:
                    user_access = models.user
                    user_access.update({'exp': datetime.datetime.now() + relativedelta(weeks=1),
                                        'token_type': Constants.ACCESS_TOKEN})
                    access_token = jwt.encode(user_access, self.SECRET, algorithm="HS256")

                    SecurityModel.objects.filter(user_email=user_email, user_agent=user_agent.ua_string).update(
                        user_name=access_token_decoded.get('user_name'),
                        user_email=access_token_decoded.get('user_email'))

                    data = {"access_token": access_token}

                else:
                    user = models.user
                    refresh_token, access_token = self.token_from_user(models.user)
                    security_model = SecurityModel(id=access_token,
                                                   refresh_token=refresh_token,
                                                   user_email=user['user_email'],
                                                   user=user,
                                                   user_agent=user_agent.ua_string,
                                                   secu_date=datetime.datetime.now(),
                                                   secu_provider=models.secu_provider)
                    models.delete()

                    security_model.save()

                    data = {"access_token": access_token}

                return data

            except SecurityModel.DoesNotExist:
                raise TokenWithUserNotFoundException
