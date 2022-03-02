import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {UserAdapter} from '../../adapters/implementation/user/user.adapter';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {SecurityService} from '../../services/security/security.service';
import {SecurityAdapter} from '../../adapters/implementation/security/security.adapter';
import {loginProviderTypes} from '../../utilities/types';
import {ModulesAdapter} from '../../adapters/implementation/user/modules.adapter';
import {MessagerService} from '../../messenger/messager.service';
import {EnumLevelMessage} from '../../messenger/enum-level-message.enum';
import {ConstString} from '../../utilities/string/const-string';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  public displayForgotPassword: boolean;
  public formGroup: FormGroup;
  public classIcon = 'bi bi-eye-slash-fill';
  public errors = new Map();
  public buttonLoginActioned = false;

  constructor(public constString: ConstString,
              private router: Router,
              private socialAuthService: SocialAuthService,
              private securityService: SecurityService,
              private securityAdapter: SecurityAdapter,
              private modulesAdapter: ModulesAdapter,
              private messagerService: MessagerService,
              private utilitiesConfigString: UtilitiesConfigString,
              private userAdapter: UserAdapter) {
    this.displayForgotPassword = false;
    this.buildForm();
    this.setData();
  }

  buildForm(): void {
    this.formGroup = new FormGroup({
      userEmail: new FormControl({value: null}, [
        Validators.pattern(ConstString.PATTERN_DOMAIN_UFPS), Validators.required,
        Validators.minLength(14)]),
      userPassword: new FormControl({value: null}, [Validators.required])
    });
  }

  setData(): void {
    this.formGroup.get('userEmail').setValue(null);
    this.formGroup.get('userPassword').setValue(null);
  }

  async login(): Promise<void> {
    if (this.formGroup.valid && !this.buttonLoginActioned) {
      this.buttonLoginActioned = true;
      const user = this.formGroup.value;
      user.provider = loginProviderTypes.REGULAR_PROVIDER;
      this.doLoginWithBackend(user);
    }
  }

  async loginWithGoogle(): Promise<any> {
    await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    const socialUser = new Promise((resolve) => {
      this.socialAuthService.authState.subscribe(res => {
        resolve(res);
      });
    });
    await socialUser.then(response => {
      if (response != null) {
        const user = {
          provider: loginProviderTypes.GOOGLE_PROVIDER,
          userGoogle: response
        };
        this.doLoginWithBackend(user);
      }
    });
  }

  doLoginWithBackend(user): void {
    this.securityService.login(this.securityAdapter.adaptObjectSend(user)).then(res => {
      if (res.status) {
        this.utilitiesConfigString.ls.set('token', res.data.access_token);
        this.utilitiesConfigString.ls.set('user', this.userAdapter.adaptObjectReceive(res.data.user));
        if (res.data.user.role_active !== null) {
          this.utilitiesConfigString.ls.set('permissions', this.modulesAdapter.adaptList(res.data.user.user_role_structure));
        }
        this.router.navigate(['']);
      }
    }).catch(err => {
      this.errors = this.utilitiesConfigString.catchValidationErrors(err);
    }).finally(() => {
      this.buttonLoginActioned = false;
    });
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  showPassword(divId): void {
    this.classIcon = this.utilitiesConfigString.showPassword(divId);
  }

  register(): void {
    this.router.navigate(['registrarse']);
  }

  showToastLarge(message: string): void {
    this.messagerService.showToastLarge(EnumLevelMessage.INFO, message);
  }
}
