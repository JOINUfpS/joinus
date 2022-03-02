import datetime
import os
import smtplib
import uuid
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

from common_structure_microservices.exception import GenericMicroserviceError
from common_structure_microservices.serializer import AuditorySerializer
from common_structure_microservices.utilities import Constants
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from munch import Munch
from rest_framework import serializers, status

from asn_institution import exceptions
from asn_institution.messages import CustomMessages
from asn_institution.settings import BASE_DIR
from opportunity.models import OpportunityModel


class OpportunitySerializer(AuditorySerializer):
    id = serializers.UUIDField(read_only=True, default=uuid.uuid4, allow_null=True)
    oppo_description = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    user_photo = serializers.UUIDField(required=False, allow_null=True)
    oppo_expiration_date = serializers.DateTimeField(required=False, format=Constants.FORMAT_DATE,
                                                     input_formats=(Constants.FORMAT_DATE,), allow_null=True)
    oppo_employer_email = serializers.EmailField(required=False, allow_null=True, allow_blank=True)
    oppo_simple_request = serializers.BooleanField(required=False, default=False)
    oppo_application_url = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    oppo_attachments = serializers.ListField(required=False, child=serializers.JSONField(), allow_null=True,
                                             default=[{}])
    oppo_postulates = serializers.ListField(required=False, allow_null=True, allow_empty=True, default=[],
                                            child=serializers.UUIDField())
    oppo_user_saved = serializers.ListField(required=False, child=serializers.UUIDField(), allow_null=True,
                                            allow_empty=True, default=[])
    oppo_country = serializers.JSONField(required=False)
    oppo_department = serializers.JSONField(required=False)
    oppo_municipality = serializers.JSONField(required=False)
    oppo_remuneration = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    created_date = serializers.DateTimeField(read_only=True, default=datetime.datetime.now,
                                             format=Constants.FORMAT_DATE, input_formats=(Constants.FORMAT_DATE,))

    class Meta:
        model = OpportunityModel
        fields = ('id',
                  'inst_id',
                  'user_id',
                  'user_name',
                  'user_photo',
                  'oppo_title',
                  'oppo_description',
                  'oppo_expiration_date',
                  'oppo_employer_email',
                  'oppo_simple_request',
                  'oppo_application_url',
                  'oppo_type_contract',
                  'oppo_postulates',
                  'oppo_attachments',
                  'oppo_user_saved',
                  'oppo_country',
                  'oppo_department',
                  'oppo_municipality',
                  'oppo_remuneration',
                  'created_date')

    def to_representation(self, instance):
        instance.oppo_remuneration = "{:,.0f}".format(float(instance.oppo_remuneration.replace(',', '')))
        return super().to_representation(instance)


class ApplyOpportunitySerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    user_id = serializers.UUIDField(required=True)
    user_name = serializers.CharField(required=True)
    opportunity = serializers.UUIDField(required=True)

    def apply_opportunity(self):
        opportunity = self.validated_data.get('opportunity', None)
        user_id = self.validated_data.get('user_id', None)
        user_name = self.validated_data.get('user_name', None)
        file = self.validated_data.get('file', None)
        try:
            opportunity_model = OpportunityModel.objects.get(id=opportunity)
            serializer = OpportunitySerializer(opportunity_model)
            oppo_postulates = serializer['oppo_postulates'].value
            if str(user_id) in oppo_postulates:
                return CustomMessages.ALREADY_APPLIED

            context = {
                'opportunity': Munch(serializer.data),
                'user_name': user_name,
                'apply_date': datetime.datetime.strftime(datetime.datetime.now(), '%b %d, %Y')
            }
            files = []
            file_curriculum_vitae = ['file', 'pdf']
            data = file.file.read()
            files.append(_get_data_image(file_curriculum_vitae, base_dir=BASE_DIR, data=data))
            send_email(file='opportunity_applicant.html', send_to_list=[serializer['oppo_employer_email'].value],
                       context=context, subject=CustomMessages.APPLICANT_OPPORTUNITY, user=user_name, files=files)

            oppo_postulates.append(user_id)
            kwargs = {'oppo_postulates': oppo_postulates}
            opportunity = OpportunitySerializer(opportunity_model, data=kwargs, partial=True)
            opportunity.is_valid(raise_exception=True)
            opportunity.save()

            return CustomMessages.RESUME_SENT
        except OpportunityModel.DoesNotExist:
            raise GenericMicroserviceError(status=status.HTTP_404_NOT_FOUND,
                                           detail=CustomMessages.OPPORTUNITY_NOT_FOUND)
        except Exception as e:
            raise GenericMicroserviceError(status=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)


class UserOpportunitySavedSerializer(serializers.Serializer):

    def user_opportunity_saved(self, inst_id, user_id):
        user_opportunities = []
        opportunity_model = OpportunityModel.objects.filter(inst_id=inst_id).exclude(user_id=user_id)
        opportunities = OpportunitySerializer(opportunity_model, many=True).data
        for opportunity in opportunities:
            if user_id in opportunity['oppo_user_saved']:
                user_opportunities.append(opportunity)

        return user_opportunities


class CascadeUpdateTaskUserOpportunity(serializers.Serializer):
    user_id = serializers.UUIDField(required=True)
    user_name = serializers.CharField(required=True)
    user_photo = serializers.UUIDField(required=True)

    def cascade_update_user_opportunity(self):
        user_id = self.validated_data.get('user_id')
        user_name = self.validated_data.get('user_name')
        user_photo = self.validated_data.get('user_photo')

        OpportunityModel.objects.filter(user_id=user_id).update(user_name=user_name,
                                                                user_photo=user_photo)


class CascadeDeleteTaskUserOpportunity(serializers.Serializer):

    def cascade_delete_user_opportunity(self, user_id):
        OpportunityModel.objects.filter(user_id=user_id).delete()


def send_email(file, send_to_list, subject, user, files=None, context=None):
    kwargs = {
        'subject': subject,
        'body': None
    }
    kwargs.update({'to': send_to_list})
    email = EmailMessage(**kwargs)
    if files is None:
        files = []

    html_content = render_to_string(file, context=context)
    html_attachment = _attach_content_email(subject, user, files, html_content)
    email.attach(html_attachment)

    try:
        email.send()
    except smtplib.SMTPException:
        raise exceptions.SendEmailError


def _attach_content_email(subject, user, files=None, html_content=None):
    html_part = MIMEMultipart(_subtype='related')
    html_part.attach(MIMEText(html_content, _subtype='html'))
    html_part['Subject'] = subject

    if files is None:
        files = []

    for file in files:
        part = MIMEBase("application", "octet-stream")
        part.set_payload(file['data'])
        encoders.encode_base64(part)
        part.add_header(
            "Content-Disposition",
            f"attachment; filename= Hoja de vida.pdf",
        )

        html_part.attach(part)

    return html_part


def _get_data_image(file, base_dir, data=None):
    if data is None:
        path_template = f"{Path('/opportunity/templates/pdf')}{os.sep}"
        path_file = base_dir + path_template + file[0] + '.' + file[1]
        data = open(path_file, 'rb').read()

    return {
        'name': file[0],
        'extension': file[1],
        'data': data
    }
