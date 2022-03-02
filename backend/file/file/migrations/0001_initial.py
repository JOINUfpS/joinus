# Generated by Django 3.0.5 on 2021-03-01 12:15

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FileModel',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('inst_id', models.UUIDField()),
                ('file_extension', models.TextField()),
                ('file_path', models.TextField()),
                ('file_size', models.TextField()),
            ],
            options={
                'db_table': 'file',
            },
        ),
    ]
