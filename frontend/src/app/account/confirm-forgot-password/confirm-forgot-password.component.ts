import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MessagerService} from '../../messenger/messager.service';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {Router} from '@angular/router';
import {SecurityService} from '../../services/security/security.service';
import {SecurityAdapter} from '../../adapters/implementation/security/security.adapter';
import {EnumLevelMessage} from '../../messenger/enum-level-message.enum';
import {ConstString} from '../../utilities/string/const-string';

@Component({
  selector: 'app-confirm-forgot-password',
  templateUrl: './confirm-forgot-password.component.html'
})
export class ConfirmForgotPasswordComponent implements OnInit {

  public formGroup: FormGroup;
  public iconNewPassword = 'bi bi-eye-slash-fill';
  public iconConfirmPassword = 'bi bi-eye-slash-fill';
  public classErrorConfirmPassword = 'ui-inputtext';

  constructor(
    public utilitiesString: UtilitiesConfigString,
    public constString: ConstString,
    private router: Router,
    private securityServices: SecurityService,
    private securityAdapter: SecurityAdapter,
    private messagerService: MessagerService) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.setData();
  }

  buildForm(): void {
    this.formGroup = new FormGroup({
      userEmail: new FormControl({value: null}, [
        Validators.pattern(ConstString.PATTERN_DOMAIN_UFPS), Validators.required]),
      confirmationCode: new FormControl({value: null}, [Validators.required, Validators.minLength(6),
        Validators.pattern(ConstString.PATTERN_ONLY_NUMBER)]),
      newPassword: new FormControl({value: null}, [Validators.required,
        Validators.pattern(ConstString.PATTERN_PASSWORD)]),
      confirmPassword: new FormControl({value: null}, [Validators.required,
        Validators.pattern(ConstString.PATTERN_PASSWORD)])
    });
  }

  setData(): void {
    this.formGroup.get('userEmail').setValue(null);
    this.formGroup.get('confirmationCode').setValue(null);
    this.formGroup.get('newPassword').setValue(null);
    this.formGroup.get('confirmPassword').setValue(null);
  }

  showPassword(divId, num): void {
    switch (num) {
      case 0:
        this.iconNewPassword = this.utilitiesString.showPassword(divId);
        break;
      case 1:
        this.iconConfirmPassword = this.utilitiesString.showPassword(divId);
        break;
    }
  }

  confirmForgotPassword(): void {
    const confirmation = this.formGroup.value;
    if (confirmation.newPassword !== confirmation.confirmPassword) {
      this.classErrorConfirmPassword = 'ui-inputtext class-error';
      this.formGroup.get('confirmPassword').setErrors({NoPassswordMatch: true});
    } else {
      this.securityServices.confirmForgotPassword(this.securityAdapter.adaptConfirmForgotPassword(confirmation))
        .then(async res => {
          if (res.status) {
            this.messagerService.showToastLarge(EnumLevelMessage.SUCCESS, ConstString.PASSWORD_CHANGED);
            await new Promise(promise => setTimeout(promise, ConstString.WAIT_FOUR_SECONDS));
            await this.router.navigate(['iniciar-sesion']);
          } else {
            this.setData();
            this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
          }
        });
    }
  }

  changeErrorClassConfirmPassword(): void {
    this.classErrorConfirmPassword = 'ui-inputtext';
  }

  showToastLarge(message: string): void {
    this.messagerService.showToastLarge(EnumLevelMessage.INFO, message);
  }

  showToast(message: string): void {
    this.messagerService.showToast(EnumLevelMessage.INFO, message);
  }
}
