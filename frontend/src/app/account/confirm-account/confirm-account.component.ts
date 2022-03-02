import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmAccountService} from '../../services/security/confirm-account.service';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {Router} from '@angular/router';
import {ConfirmationAccountAdapter} from '../../adapters/implementation/security/confirmation-account.adapter';
import {MessagerService} from '../../messenger/messager.service';
import {EnumLevelMessage} from '../../messenger/enum-level-message.enum';
import {ConstString} from '../../utilities/string/const-string';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html'
})
export class ConfirmAccountComponent implements OnInit {

  public formGroup: FormGroup;
  public iconTemporalPassword = 'bi bi-eye-slash-fill';
  public iconNewPassword = 'bi bi-eye-slash-fill';
  public iconConfirmPassword = 'bi bi-eye-slash-fill';
  buttonConfirmateAccountActioned: boolean;

  constructor(
    public confirmationAccountService: ConfirmAccountService,
    public constString: ConstString,
    private messagerService: MessagerService,
    public utilitiesString: UtilitiesConfigString,
    public confirmationAccount: ConfirmationAccountAdapter,
    private router: Router) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.setData();
  }

  buildForm(): void {
    this.formGroup = new FormGroup({
      userEmail: new FormControl({value: null}, [
        Validators.pattern(ConstString.PATTERN_DOMAIN_UFPS), Validators.required]),
      temporalPassword: new FormControl({value: null}, [Validators.required,
        Validators.pattern(ConstString.PATTERN_PASSWORD)]),
      newPassword: new FormControl({value: null}, [Validators.required,
        Validators.pattern(ConstString.PATTERN_PASSWORD)]),
      confirmPassword: new FormControl({value: null}, [Validators.required])
    });
  }

  setData(): void {
    this.formGroup.get('userEmail').setValue(null);
    this.formGroup.get('temporalPassword').setValue(null);
    this.formGroup.get('newPassword').setValue(null);
    this.formGroup.get('confirmPassword').setValue(null);
  }

  confirmAccount(): void {
    this.buttonConfirmateAccountActioned = true;
    const confirmInformation = this.formGroup.value;
    if (confirmInformation.newPassword !== confirmInformation.confirmPassword) {
      this.formGroup.get('confirmPassword').setErrors({NoPassswordMatch: true});
      this.buttonConfirmateAccountActioned = false;
    } else {
      this.confirmationAccountService.confirmAccount(this.confirmationAccount.adaptObjectSend(confirmInformation))
        .then(async res => {
          if (res.status) {
            this.messagerService.showToastLarge(EnumLevelMessage.SUCCESS, 'Tu cuenta ha sido creada, seras dirigido al inicio de sesión...');
            await new Promise(promise => setTimeout(promise, ConstString.WAIT_FOUR_SECONDS));
            await this.router.navigate(['iniciar-sesion']);
          } else {
            this.setData();
            this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
          }
        }).finally(() => {
        this.buttonConfirmateAccountActioned = false;
      });
    }
  }

  showPassword(divId, num): void {
    switch (num) {
      case 0:
        this.iconTemporalPassword = this.utilitiesString.showPassword(divId);
        break;
      case 1:
        this.iconNewPassword = this.utilitiesString.showPassword(divId);
        break;
      case 2:
        this.iconConfirmPassword = this.utilitiesString.showPassword(divId);
        break;
    }
  }

  showToastLarge(message: string): void {
    this.messagerService.showToastLarge(EnumLevelMessage.INFO, message);
  }
}
