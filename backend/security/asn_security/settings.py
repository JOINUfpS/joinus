"""
Django settings for asn_security project.

Generated by 'django-admin startproject' using Django 3.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os

from common_structure_microservices.profiles import Profiles

configuration = Profiles()
configuration.get_specific_env()
general_config = configuration.get_general_env()
params = configuration.CONFIG

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'vy!=%@r9-c_6m9j2q^mj(l7%1^d74@nv5!gzq+@pn5oop5@twp'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = params.get('DEBUG', True)

ALLOWED_HOSTS = ['*']

CORS_ORIGIN_ALLOW_ALL = True

BASE_URL = general_config.get('BASE_URL', '/api/')
CONTEXT_PATH = general_config.get('BASE_PATH', 'securities/')
API_GATEWAY = general_config.get('API_GATEWAY', 'asn_gateway/')

APP_NAME = general_config.get('APP_NAME', 'asn_security')
APPLICATION_PORT = general_config.get('APPLICATION_PORT', 8094)

EUREKA_SERVER = general_config.get('eureka_server', 'http://localhost:8090/eureka/')
SWAGGER_URL = params.get('SWAGGER_URL', None)

SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'DRF Token': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    },
    'USE_SESSION_AUTH': False
}

# Application definition
INSTALLED_APPS = [
    'djongo',
    'djoser',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'drf_yasg',
    'corsheaders',
    'django_user_agents',
    'security',
    'confirm_account'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django_user_agents.middleware.UserAgentMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'asn_security.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR + '/security/templates/'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'asn_security.wsgi.application'

REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'common_structure_microservices.exception_handler.custom_exception_handler',
}

if params.get('DEFAULT_PERMISSION_CLASSES', '') != '':
    REST_FRAMEWORK.update(
        {'DEFAULT_PERMISSION_CLASSES': [params.get('DEFAULT_PERMISSION_CLASSES')]}
    )

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        "CLIENT": {
            'name': 'asn_security',
            'host': params.get('HOST_DATABASE', 'mongodb+srv://user:04052018@tesisasn.0rbje.mongodb.net/'
                                                'asn_security?retryWrites=true&w=majority'),
            'username': params.get('USER', 'user'),
            'password': params.get('PASSWORD', '04052018'),
            'authMechanism': 'SCRAM-SHA-1',
        },
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
    },
}

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'es-es'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = params.get('STATIC_URL', '/static/')

email_config = configuration.get_email_env()
if email_config != {}:
    EMAIL_BACKEND = email_config.get('EMAIL_BACKEND', 'django.core.mail.backends.smtp.EmailBackend')
    EMAIL_HOST = email_config.get('EMAIL_HOST', 'smtp.gmail.com')
    EMAIL_PORT = email_config.get('EMAIL_PORT', 587)
    EMAIL_HOST_USER = email_config.get('EMAIL_HOST_USER', 'yindypaolapu@ufps.edu.co')
    EMAIL_HOST_PASSWORD = email_config.get('EMAIL_HOST_PASSWORD', 'stjmfqbitluwjigs')
    EMAIL_USE_TLS = email_config.get('EMAIL_USE_TLS', True)
    EMAIL_USE_SSL = email_config.get('EMAIL_USE_SSL', False)
    DEFAULT_FROM_EMAIL = email_config.get('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER)
