from rest_framework.exceptions import APIException


class SendEmailError(APIException):
    status_code = 500
    default_detail = 'Ocurrió un error al enviar el correo.'
    default_code = 'send_email_error'


class SendNotifyError(APIException):
    status_code = 500
    default_detail = 'Ocurrió un error al notificar'
    default_code = 'send_notification'
