# Generated by Django 3.0.5 on 2021-06-07 22:02

from django.db import migrations, models
import djongo.models.fields
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PublicationUserModel',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('publ_id', models.UUIDField()),
                ('user_id', models.UUIDField()),
                ('puus_interest', models.BooleanField()),
                ('puus_shared', models.BooleanField()),
                ('puus_saved', models.BooleanField()),
                ('publ_user_id', models.UUIDField()),
                ('publ_user_name', models.TextField()),
                ('publ_user_photo', models.UUIDField()),
                ('cate_name', models.TextField()),
                ('comm_id', models.UUIDField()),
                ('comm_name', models.TextField()),
                ('publ_title', models.TextField()),
                ('publ_description', models.TextField()),
                ('publ_authors', djongo.models.fields.JSONField()),
                ('publ_comment', djongo.models.fields.JSONField()),
                ('publ_privacy', models.BooleanField()),
                ('publ_amount_interest', models.IntegerField()),
                ('publ_amount_shared', models.IntegerField()),
                ('publ_attachments', djongo.models.fields.JSONField()),
                ('publ_link_doi', models.TextField()),
                ('created_date', models.DateTimeField()),
            ],
            options={
                'db_table': 'publication_user',
            },
        ),
    ]