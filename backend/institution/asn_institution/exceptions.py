from rest_framework.exceptions import APIException


class SendEmailError(APIException):
    status_code = 500
    default_detail = 'Ocurrió un error al enviar el correo.'
    default_code = 'send_email_error'


class FileIsNotValidError(APIException):
    status_code = 400
    default_detail = 'No has ingresado un archivo valido'
    default_code = 'file_not_valid_error'
