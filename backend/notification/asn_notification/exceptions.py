from rest_framework.exceptions import APIException


class SendNotifyError(APIException):
    status_code = 500
    default_detail = 'Ocurrió un error al crear notificación'
    default_code = 'send_notify_error'
