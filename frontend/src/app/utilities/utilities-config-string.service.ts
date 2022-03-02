/**
 * This service contains methods and variables to process text data
 */

import {Injectable} from '@angular/core';
import * as SecureLS from 'secure-ls';
import {environment} from '../../environments/environment';
import {ConstString} from './string/const-string';

@Injectable()
export class UtilitiesConfigString {

  public msgConfirmDelete = '¿Está seguro de que desea eliminar ';
  public msgConfirmLeave = '¿Está seguro de que desea abandonar ';
  public msgToastSuccessfullAuthorization = 'La invitación a ';
  public msgToastError = 'Ha ocurrido un error en el proceso';
  public msgEmptyTable = 'No se encontraron registros';
  public modal = true;
  public blockScroll = true;
  public dismissableMask = true;
  ls = new SecureLS({encodingType: 'aes', isCompression: false});
  public formatCurrency = '';
  public symbolCurrency = '';
  public activeTooltip = false;
  public maxLengthShow = 61;
  public maxLengthUserName = 8;

  public language = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre',
      'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    today: 'Hoy',
    clear: 'Limpiar',
    dateFormat: 'yy-mm-dd',
    weekHeader: 'Wk'
  };

  showPassword(name): string {
    const x = document.getElementById(name);
    if (x.getAttribute('type') === 'password') {
      x.setAttribute('type', 'text');
      return 'bi bi-eye-fill';
    } else {
      x.setAttribute('type', 'password');
      return 'bi bi-eye-slash-fill';
    }
  }

  convertOnlyTextNumber(event): void {
    event.target.value = event.target.value.replace(ConstString.PATTERN_NUMBER_AND_TEXT, '');
  }

  convertOnlyNumber(event): void {
    event.target.value = event.target.value.replace(ConstString.PATTERN_ONLY_NUMBER, '');
  }

  convertOnlyText(event): void {
    event.target.value = event.target.value.replace(ConstString.PATTERN_ONLY_TEXT, '');
  }

  convertOnlyCent(event): void {
    if (event.target.value > 100) {
      event.target.value = event.target.value.substring(0, 2);
    }
    event.target.value = event.target.value.replace(ConstString.PATTERN_ONLY_NUMBER, '');
  }

  getLabelSelected(event): string {
    return event.selectedOption.label;
  }

  convertOnlyTextEmail(event, form): any {
    event.target.value = event.target.value.replace(ConstString.PATTERN_EMAIL, '').trimLeft();

    if (form.value) {
      form.setValue(event.target.value, {emitEvent: false});
    } else {
      return event.target.value;
    }
  }

  getImage(image, typeImage = null): string {
    if (image === null || image === '') {
      if (typeImage === 'perfil') {
        return './assets/img/default/992f149f-b056-484b-bc0b-573eca93f90f.jpg';
      } else {
        return './assets/img/default/3fa85f64-5717-4562-b3fc-2c963f66afa6.jpg';
      }
    } else {
      return `${environment.file}${image}/`;
    }
  }

  catchValidationErrors(errorsList: any): Map<string, string> {
    const errors = new Map();
    if (errorsList.error instanceof Object) {
      const backErrors = errorsList.error.errors;
      backErrors.map(err => {
        errors.set(Object.keys(err)[0], err[Object.keys(err)[0]][0]);
      });
    }
    return errors;
  }

  calcWidth(parent): void {
    this.activeTooltip = false;
    if (parent > 0) {
      this.activeTooltip = parent.target.clientWidth >= parent.target.firstChild.offsetWidth;
    }
  }

  seeTooltipText(event, length): void {
    this.activeTooltip = event && length < this.maxLengthShow;
  }

  seeTooltipTextUserNavbar(event, length): void {
    this.activeTooltip = event && length < this.maxLengthUserName;
  }

  convertToTitle(str): string {
    const textLower = str.toLowerCase().split(' ');
    const arrayCapitalize: string[] = [];
    textLower.forEach(word => {
      arrayCapitalize.push(word.charAt(0).toUpperCase() + word.substring(1));
    });
    return arrayCapitalize.join(' ');
  }

}
