import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {UsersService} from '../../services/user/user.service';
import {UserAdapter} from '../../adapters/implementation/user/user.adapter';
import {MessagerService} from '../../messenger/messager.service';
import {EnumLevelMessage} from '../../messenger/enum-level-message.enum';
import {UtilitiesList} from '../../utilities/utilities-list';
import {UniversityCareerService} from '../../services/utility/university-career.service';
import {UniversityCareerModel} from '../../models/utility/university-career.model';
import {UniversityCareerAdapter} from '../../adapters/implementation/utility/universityCareer.adapter';
import {ConstString} from '../../utilities/string/const-string';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  public formGroup: FormGroup;
  public errors = new Map();
  public userCreated = false;
  public userGender: string;
  public listUniversityCareers: Array<UniversityCareerModel>;
  public buttonCreateUserActioned = false;
  public classErrorUserEmail = 'ui-inputtext';

  constructor(public utilitiesString: UtilitiesConfigString,
              private userService: UsersService,
              private userAdapter: UserAdapter,
              private messagerService: MessagerService,
              private utilitiesList: UtilitiesList,
              private universityCareerService: UniversityCareerService,
              private universityCareerAdapter: UniversityCareerAdapter) {
  }

  ngOnInit(): void {
    this.getUniversityCareer();
    this.buildForm();
    this.setData();
  }

  private getUniversityCareer(): void {
    this.universityCareerService.getAllUniversityCareer().then(
      res => {
        if (res.status) {
          this.listUniversityCareers = this.universityCareerAdapter.adaptList(res.data);
        }
      }
    );
  }

  buildForm(): void {
    this.formGroup = new FormGroup({
      userName: new FormControl({value: null, disable: false}, [Validators.required,
        Validators.minLength(2), Validators.maxLength(100), Validators.pattern(ConstString.PATTERN_ONLY_TEXT_REGISTER)]),
      userEmail: new FormControl({value: null, disable: false}, [
        Validators.pattern(/^[-\w.%+]{1,64}@ufps.edu.co$/i), Validators.minLength(2),
        Validators.maxLength(100), Validators.required]),
      userPhone: new FormControl({value: null, disable: false},
        [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(ConstString.PATTERN_ONLY_NUMBER)]),
      userDegree: new FormControl({value: null, disable: false}, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      userGender: new FormControl({value: null, disable: false}, [Validators.required])
    });
  }

  setData(): void {
    this.formGroup.get('userName').setValue(null);
    this.formGroup.get('userEmail').setValue(null);
    this.formGroup.get('userPhone').setValue(null);
    this.formGroup.get('userDegree').setValue(null);
    this.formGroup.get('userGender').setValue(null);
  }

  createUser(): void {
    this.buttonCreateUserActioned = true;
    const user = this.formGroup.value;
    this.messagerService.showToastLarge(EnumLevelMessage.WARNING, 'Se esta creando tu cuenta...');
    this.userService.saveUser(this.userAdapter.adaptObjectSend(user))
      .then(res => {
        if (res.status) {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Cuenta creada exitosamente!');
          this.userCreated = true;
        } else {
          this.setData();
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      }).catch(err => {
      this.errors = this.utilitiesString.catchValidationErrors(err);
      this.classErrorUserEmail = this.errors.has('user_email') ? 'ui-inputtext class-error' : '';
    }).finally(() => {
      this.buttonCreateUserActioned = false;
    });
  }

  changeErrorClassUserEmail(): void {
    this.classErrorUserEmail = 'ui-inputtext';
  }
}
