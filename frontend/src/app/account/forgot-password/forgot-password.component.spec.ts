import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ForgotPasswordComponent} from './forgot-password.component';
import {MessagerService} from '../../messenger/messager.service';
import {ProjectAdapter} from '../../adapters/implementation/user/project.adapter';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../utilities/string/const-string';
import {MessageService} from 'primeng/api';
import {SecurityService} from '../../services/security/security.service';
import {SecurityAdapter} from '../../adapters/implementation/security/security.adapter';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ForgotPasswordComponent ],
      providers: [SecurityService,
        SecurityAdapter,
        ProjectAdapter,
        DatePipe,
        ConstString,
        MessagerService,
        MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the forgot password form', () => {
    component.buildForm();
    const forgotPasswordForm = component.formGroup;
    const forgotPasswordFormValues = {
      userEmail: Object({value: null})
    };
    expect(forgotPasswordForm.value).toEqual(forgotPasswordFormValues);
  });

});
