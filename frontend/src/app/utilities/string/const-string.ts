export class ConstString {
  static readonly PATTERN_NO_EMPTY_STRING = /^(\s+\S+\s*)*(?!\s).*$/;
  static readonly PATTERN_URL = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/](\S)/;
  static readonly PATTERN_ONLY_TEXT_REGISTER = /^[a-záéíóúñA-ZÁÉÍÓÚÑ ]*$/;
  static readonly PATTERN_ONLY_TEXT = /[^A-ZÁÉÍÓÚÑ a-záéíóúñ]+/g;
  static readonly PATTERN_ONLY_NUMBER = /^(0|[1-9][\d]*)$/;
  static readonly PATTERN_NUMBER_AND_TEXT = /[^A-ZÁÉÍÓÚÑ a-záéíóúñ0-9]+/g;
  static readonly PATTERN_EMAIL = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  static readonly PATTERN_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\^$*.\[\]{}?\-“=!@#%&\/,><’:;|_~`])\S{8,99}$/;
  static readonly PATTERN_DOMAIN_UFPS = /^[-\w.%+]{1,64}@ufps.edu.co$/i;
  static readonly PATTERN_SALARY = /^[+]?([\d]+(?:[.][\d]*)?|\.[\d]+)$/;
  static readonly MESSAGE_FILE_1MB = 'Este archivo no se ha podido subir. El tamaño maximo permitido es 1 Megabyte';
  static readonly TYPE_STRING = 'string';
  static readonly TYPE_OBJECT = 'object';
  static readonly SEE_MORE = 'Ver más...';
  static readonly SEE_LEST = 'Ver menos';
  static readonly PASSWORD_CHANGED = 'Tu contraseña ha sido cambiada, seras dirigido al inicio de sesión...';
  static readonly WAIT_FOUR_SECONDS = 4000;
  static readonly USER_NOT_FOUND = 'El usuario ingresado no existe';
  static readonly USER_NOT_EXIST = 'El usuario no existe';
  static readonly MESSAGE_USER_NOT_FOUND = 'No se encontró un usuario para los datos ingresados.';
  static readonly ERROR_FIELD = 'Existe algún error con los valores de uno o varios campos.';
  static readonly ERROR_REQUEST = 'Error al procesar la solicitud.';
  readonly OBJECT_NOT_FOUND = 'Objeto no encontrado';
  readonly TIPS_PASSWORD = 'La contraseña deben tener 8 caracteres mínimo y estar compuesta por números, letras minúsculas, mayúsculas, y al menos un caracter especial.';
  readonly ACCEPT = 'Aceptar';
  readonly DECLINE = 'Rechazar';
  readonly INVITE = 'Invitar';
  readonly EDIT = 'Editar';
  readonly EDIT_PHOTO_COMMUNITY = 'Editar foto';
  readonly APPROVE = 'Aprobar';
  readonly APROVING = 'Aprobando';
  readonly DENY = 'Denegar';
  readonly DENYING = 'Denegando';
  readonly CANCEL_REQUEST = 'Cancelar solicitud';
  readonly EXPIRED_TOKEN = 'Token expirado.';
  readonly UNAUTHORIZED_USER = 'Usuario no autorizado.';
  readonly INVALID_TOKEN = 'Token inválido.';

}

