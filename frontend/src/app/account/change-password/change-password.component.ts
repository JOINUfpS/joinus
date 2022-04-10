import {Component} from '@angular/core';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../../services/user/user.service';
import {UserAdapter} from '../../adapters/implementation/user/user.adapter';
import {MessagerService} from '../../messenger/messager.service';
import {EnumLevelMessage} from '../../messenger/enum-level-message.enum';
import {ConstString} from '../../utilities/string/const-string';
import {Router} from '@angular/router';
import {SecurityService} from '../../services/security/security.service';
import {SecurityAdapter} from '../../adapters/implementation/security/security.adapter';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {

  public display = false;
  public formGroup: FormGroup;
  public iconCurrentPassword = 'bi bi-eye-slash-fill';
  public iconNewPassword = 'bi bi-eye-slash-fill';
  public iconConfirmPassword = 'bi bi-eye-slash-fill';
  public classErrorConfirmPassword = 'ui-inputtext';

  constructor(public utilitiesString: UtilitiesConfigString,
              public constString: ConstString,
              private userServices: UsersService,
              private userAdapter: UserAdapter,
              private messagerService: MessagerService,
              private router: Router,
              private securityService: SecurityService,
              private securityAdapter: SecurityAdapter
  ) {
    this.buildForm();
  }

  buildForm(): void {
    this.formGroup = new FormGroup({
      currentPassword: new FormControl({value: null}, [Validators.required,
        Validators.pattern(ConstString.PATTERN_PASSWORD)]),
      newPassword: new FormControl({value: null}, [Validators.required,
        Validators.pattern(ConstString.PATTERN_PASSWORD)]),
      confirmPassword: new FormControl({value: null}, [Validators.required,
        Validators.pattern(ConstString.PATTERN_PASSWORD)])
    });
  }

  show(): void {
    this.setData();
    this.display = true;
  }

  setData(): void {
    this.formGroup.get('currentPassword').setValue(null);
    this.formGroup.get('newPassword').setValue(null);
    this.formGroup.get('confirmPassword').setValue(null);
  }

  showPassword(divId, num): void {
    switch (num) {
      case 0:
        this.iconCurrentPassword = this.utilitiesString.showPassword(divId);
        break;
      case 1:
        this.iconNewPassword = this.utilitiesString.showPassword(divId);
        break;
      case 2:
        this.iconConfirmPassword = this.utilitiesString.showPassword(divId);
        break;
    }
  }

  save(): void {
    const changePasswordBody = this.formGroup.value;
    if (changePasswordBody.newPassword !== changePasswordBody.confirmPassword) {
      this.classErrorConfirmPassword = 'ui-inputtext class-error';
      this.formGroup.get('confirmPassword').setErrors({NoPasswordMatch: true});
    } else {
      this.userServices.changePassword(this.userAdapter.adaptChangePassword(changePasswordBody))
        .then(res => {
          if (res.status) {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, res.message);
            const user = this.utilitiesString.ls.get('user');
            this.securityService.logout(this.securityAdapter.adaptLogout(user.userEmail)).then(response => {
              if (response.status) {
                this.utilitiesString.ls.removeAll();
                this.router.navigate(['iniciar-sesion']);
              }
            });
            this.display = false;
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
