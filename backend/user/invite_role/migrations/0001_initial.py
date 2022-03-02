# Generated by Django 3.0.5 on 2021-10-10 20:19

import uuid

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='InviteRoleModel',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('inst_id', models.UUIDField()),
                ('user_id', models.UUIDField()),
                ('role_id', models.UUIDField()),
                ('inro_status', models.TextField()),
                ('inro_type', models.TextField()),
                ('user_name', models.TextField()),
                ('role_name', models.TextField()),
                ('user_email', models.TextField()),
                ('comm_id', models.UUIDField()),
                ('cous_id', models.UUIDField()),
                ('comm_name', models.TextField()),
            ],
            options={
                'db_table': 'invite_role',
            },
        ),
    ]
