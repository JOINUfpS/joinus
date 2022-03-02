#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

from asn_institution.settings import EUREKA_SERVER, APP_NAME, APPLICATION_PORT, configuration


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'asn_institution.settings')

    import django
    from py_eureka_client import eureka_client

    django.setup()

    # Override default port for `runserver` command
    from django.core.management.commands.runserver import Command as runserver
    runserver.default_port = f'{APPLICATION_PORT}'

    from django.core.management import execute_from_command_line
    if configuration.PROFILE != 'loc':
        eureka_client.init_registry_client(eureka_server=EUREKA_SERVER,
                                           app_name=APP_NAME,
                                           instance_port=APPLICATION_PORT)

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
