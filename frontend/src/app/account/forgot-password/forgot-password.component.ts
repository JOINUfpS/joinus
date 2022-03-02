import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SecurityService} from '../../services/security/security.service';
import {MessagerService} from '../../messenger/messager.service';
import {SecurityAdapter} from '../../adapters/implementation/security/security.adapter';
import {EnumLevelMessage} from '../../messenger/enum-level-message.enum';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {

  formGroup: FormGroup;
  isSent: boolean;
  buttonRecoveryPasswordHeldDown: boolean;
  @Output() communicatorWithFather = new EventEmitter<void>();

  constructor(private securityService: SecurityService,
              private securityAdater: SecurityAdapter,
              private messagerService: MessagerService) {
    this.buttonRecoveryPasswordHeldDown = false;
    this.isSent = false;
    this.buildForm();
    this.setData();
  }

  public buildForm(): void {
    this.formGroup = new FormGroup({
      userEmail: new FormControl({value: null}, [
        Validators.pattern(/^[-\w.%+]{1,64}@ufps.edu.co$/i), Validators.required])
    });
  }

  private setData(): void {
    this.formGroup.get('userEmail').setValue(null);
  }

  recoverPassword(): void {
    this.buttonRecoveryPasswordHeldDown = true;
    this.messagerService.showToast(EnumLevelMessage.WARNING, 'Se te esta enviando un correo para recuperar la contraseña...');
    const user = this.formGroup.value;
    this.securityService.forgotPassword(this.securityAdater.adaptForgotPassword(user))
      .then(res => {
        if (res.status) {
          this.isSent = true;
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, res.message);
        }
      })
      .finally(() => {
        this.buttonRecoveryPasswordHeldDown = false;
      });
  }

  showLogin(): void {
    this.communicatorWithFather.emit();
  }
}
