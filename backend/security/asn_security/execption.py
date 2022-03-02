from rest_framework.exceptions import APIException


class ConfirmationTimeExpiredException(APIException):
    status_code = 400
    default_detail = 'El tiempo de confirmación de cuenta esta expirado.'
    default_code = 'confirmation_time_expired'


class TemporaryPasswordNotCorrectException(APIException):
    status_code = 400
    default_detail = 'La contraseña temporal no es correcta.'
    default_code = 'temporary_password_not_correct'


class TokenWithUserNotFoundException(APIException):
    status_code = 404
    default_detail = 'El token no pertenece a ningún usuario en sesión.'
    default_code = 'token_not_found_exception'
