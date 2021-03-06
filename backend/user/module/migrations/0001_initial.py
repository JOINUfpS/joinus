# Generated by Django 3.0.5 on 2021-10-10 20:19

import uuid

import djongo.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ModuleModel',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('modu_name', models.TextField()),
                ('modu_router', models.TextField()),
                ('modu_icon', models.TextField()),
                ('modu_status', models.TextField()),
                ('modu_permissions', djongo.models.fields.JSONField()),
                ('modu_is_generic', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'module',
            },
        ),
    ]
