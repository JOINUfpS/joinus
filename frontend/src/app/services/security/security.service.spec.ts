import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {SecurityService} from './security.service';
import {SecurityAdapter} from '../../adapters/implementation/security/security.adapter';
import {UserModel} from '../../models/user/user.model';
import {ProjectAdapter} from '../../adapters/implementation/user/project.adapter';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../utilities/string/const-string';


describe('SecurityService', () => {
  let service: SecurityService;
  let httpTestingController: HttpTestingController;
  let securityAdapter: SecurityAdapter;
  let userProjectAdapter: ProjectAdapter;
  let datePipe: DatePipe;
  let constString: ConstString;
  const url = `${environment.securityUrl}security/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SecurityService, HttpClient, ProjectAdapter, DatePipe, ConstString]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SecurityService);
    securityAdapter = TestBed.inject(SecurityAdapter);
    userProjectAdapter = TestBed.inject(ProjectAdapter);
    datePipe = TestBed.inject(DatePipe);
    constString = TestBed.inject(ConstString);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should be login', () => {

    const login = {
      user_email: 'juanfernandoro@ufps.edu.co',
      password: 'Joinus.2021',
      provider: 'Regular',
      user_google: {}
    };

    const user = new UserModel('4a74c6bf-59a2-4270-8bb3-96f194363a46',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Universidad Francisco de Paula Santander',
      'Fernando Romero',
      'juanfernandoro@ufps.edu.co',
      true,
      'Regular',
      [],
      null,
      'Hola!, Mi meta es tener libertad financiera.',
      [],
      '3003719983',
      '047360c3-8991-4cb2-b756-06320be46a8e',
      'Hombre',
      {
        id: '747cb17c-2a51-4f66-8df1-0dcb7b6f201c',
        careerName: 'Derecho'
      },
      [],
      '93fb4994-e45b-462f-9e88-93e0758481dd',
      ['finanzas personales', 'gestion de tiempo'],
      {
        id: 48,
        name: 'Colombia',
        iso2: 'CO'
      },
      {
        id: 2877,
        name: 'Norte de Santander',
        iso2: 'NSA'
      },
      {
        id: 20772,
        name: 'Cúcuta'
      },
      'Activo');

    const loginAdapted = securityAdapter.adaptObjectSend(login);

    service.login(loginAdapted).then(response => {
      expect(typeof response).toBe('boolean');
      expect(user).toEqual(securityAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}login/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be forgot password', () => {

    const user = {user: 'user@example.com'};

    const forgotPasswordAdapter = securityAdapter.adaptForgotPassword(user);

    service.forgotPassword(forgotPasswordAdapter).then(response => {
      expect(typeof response).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}forgot_password/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be confirm forgot password', () => {

    const user = {
      user: 'user@example.com',
      new_password: 'Joinus.2022',
      confirmation_code: '14523'
    };

    const confirmForgotPasswordAdapter = securityAdapter.adaptConfirmForgotPassword(user);

    service.confirmForgotPassword(confirmForgotPasswordAdapter).then(response => {
      expect(typeof response).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}confirm-forgot-password/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be logout', () => {

    const user = 'user@example.com';

    const logout = securityAdapter.adaptLogout(user);

    service.logout(logout).then(response => {
      expect(typeof response).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}logout/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be refresh token', () => {

    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjFjZWViMDFlLTE0NDYtNDFmZC05YWJj' +
      'LTI5NmEyMDVjZTk4ZSIsImluc3RfaWQiOiIzZmE4NWY2NC01NzE3LTQ1NjItYjNmYy0yYzk2M2Y2N' +
      'Ijp7ImlkIjo0OCwibmFtZSI6IkNvbG9tYmlhIiwiaXNvMiI6IkNPIn0sInVzZXJfZGVwYXJ0bWVud' +
      'CI6eyJpZCI6Mjg3NywibmFtZSI6Ik5vcnRlIGRlIFNhbnRhbmRlciIsImlzbzIiOiJOU0EifSwidX' +
      'Nlcl9tdW5pY2lwYWxpdHkiOnsiaWQiOjIwNzcyLCJuYW1lIjoiQ1x1MDBmYWN1dGEifSwidXNlcl9' +
      'zdGF0dXMiOiJBY3Rpdm8iLCJleHAiOjE2MzMwNTU3ODksInRva2VuX3R5cGUiOiJBQ0NFU1NfVE9L' +
      'RU4ifQ.3-W2UfUSIWKZ09Nl2azDbtwwTOxpV6_BXWE_1NkTWFo';

    const tokenAdapted = securityAdapter.adaptRefreshToken(token);

    service.refreshToken(tokenAdapted).toPromise();

    const req = httpTestingController.expectOne(`${url}refresh-token/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

});
