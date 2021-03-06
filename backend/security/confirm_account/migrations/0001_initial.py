# Generated by Django 3.0.5 on 2021-04-16 23:56

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ConfirmAccountModel',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('user_email', models.TextField(unique=True)),
                ('temporal_password', models.TextField()),
                ('account_status', models.TextField()),
                ('created_date', models.DateTimeField()),
            ],
            options={
                'db_table': 'confirm_account',
            },
        ),
    ]
