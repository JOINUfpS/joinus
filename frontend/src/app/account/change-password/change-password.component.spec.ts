import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangePasswordComponent} from './change-password.component';
import {MessagerService} from '../../messenger/messager.service';
import {ProjectAdapter} from '../../adapters/implementation/user/project.adapter';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../utilities/string/const-string';
import {MessageService} from 'primeng/api';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {UsersService} from '../../services/user/user.service';
import {UserAdapter} from '../../adapters/implementation/user/user.adapter';
import {DialogModule} from 'primeng/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let utilities: UtilitiesConfigString;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [DialogModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule],
      providers: [UtilitiesConfigString,
        UsersService,
        UserAdapter,
        ProjectAdapter,
        DatePipe,
        ConstString,
        MessagerService,
        MessageService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(ChangePasswordComponent);
        component = fixture.componentInstance;
        utilities = TestBed.inject(UtilitiesConfigString);
        fixture.detectChanges();
        router = TestBed.get(Router);
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the change password form', () => {
    component.buildForm();
    const changePasswordForm = component.formGroup;
    const changePasswordFormValues = {
      currentPassword: Object({value: null}),
      newPassword: Object({value: null}),
      confirmPassword: Object({value: null})
    };
    expect(changePasswordForm.value).toEqual(changePasswordFormValues);
  });

  it('should show dialog', () => {
    component.show();
    expect(component.display).toEqual(true);
  });

  it('should be change error class UserEmail', () => {
    component.classErrorConfirmPassword = 'ui-inputtext class-error';
    component.changeErrorClassConfirmPassword();
    expect(( component as any).classErrorConfirmPassword).toEqual('ui-inputtext');
  });

});
