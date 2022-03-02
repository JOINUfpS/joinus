import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RegisterComponent} from './register.component';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {UsersService} from '../../services/user/user.service';
import {UserAdapter} from '../../adapters/implementation/user/user.adapter';
import {MessagerService} from '../../messenger/messager.service';
import {UtilitiesList} from '../../utilities/utilities-list';
import {UniversityCareerService} from '../../services/utility/university-career.service';
import {UniversityCareerAdapter} from '../../adapters/implementation/utility/universityCareer.adapter';
import {ProjectAdapter} from '../../adapters/implementation/user/project.adapter';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../utilities/string/const-string';
import {MessageService} from 'primeng/api';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ RegisterComponent ],
      providers: [UtilitiesConfigString,
        UsersService,
        UserAdapter,
        ProjectAdapter,
        DatePipe,
        ConstString,
        MessagerService,
        MessageService,
        UtilitiesList,
        UniversityCareerService,
        UniversityCareerAdapter]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form to register', () => {
    component.ngOnInit();
    const registerForm = component.formGroup;
    const registerFormValues = {
      userName: null,
      userEmail: null,
      userPhone: null,
      userDegree: null,
      userGender: null
    };

    expect(registerForm.value).toEqual(registerFormValues);
  });

  it('should be change error class UserEmail', () => {
    component.ngOnInit();
    component.classErrorUserEmail = 'ui-inputtext class-error';
    component.changeErrorClassUserEmail();
    expect(( component as any).classErrorUserEmail).toEqual('ui-inputtext');
  });

});
