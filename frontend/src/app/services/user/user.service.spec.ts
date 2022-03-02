import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {UsersService} from './user.service';
import {Status} from '../../utilities/status';
import {UserModel} from '../../models/user/user.model';
import {UserAdapter} from '../../adapters/implementation/user/user.adapter';
import {ProjectAdapter} from '../../adapters/implementation/user/project.adapter';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../utilities/string/const-string';


describe('UsersService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;
  let userAdapter: UserAdapter;
  let projectAdapter: ProjectAdapter;
  let datePipe: DatePipe;
  let constString: ConstString;
  const url = `${environment.userUrl}user/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService, UtilitiesConfigString, HttpClient, ProjectAdapter, DatePipe, ConstString]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UsersService);
    userAdapter = TestBed.inject(UserAdapter);
    projectAdapter = TestBed.inject(ProjectAdapter);
    datePipe = TestBed.inject(DatePipe);
    constString = TestBed.inject(ConstString);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be list users', () => {
    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

    const expectedData = [
      {
        id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        inst_name: 'Universidad Francisco de Paula Santander',
        user_name: 'Fernando Romero',
        user_email: 'juanfernandoro@ufps.edu.co',
        user_provider: 'regular',
        user_role: [{}],
        user_role_structure: {},
        role_active: null,
        user_admin: false,
        user_intro: 'Hola!, Mi meta es tener libertad financiera.',
        user_interest: [],
        user_phone: '3003719983',
        user_photo: '047360c3-8991-4cb2-b756-06320be46a8e',
        user_gender: 'Hombre',
        user_degree: {
          id: '747cb17c-2a51-4f66-8df1-0dcb7b6f201c',
          career_name: 'Derecho'
        },
        user_projects: [],
        user_curriculum_vitae: '93fb4994-e45b-462f-9e88-93e0758481dd',
        user_skill: [
          'finanzas personales',
          'gestion de tiempo'
        ],
        user_country: {
          id: 48,
          name: 'Colombia',
          iso2: 'CO'
        },
        user_department: {
          id: 2877,
          name: 'Norte de Santander',
          iso2: 'NSA'
        },
        user_municipality: {
          id: 20772,
          name: 'Cúcuta'
        },
        user_status: 'Activo'
      },
      {
        id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        inst_name: 'Universidad Francisco de Paula Santander',
        user_name: 'SEMILLERO SILUX UFPS',
        user_email: 'silux@ufps.edu.co',
        user_provider: 'Google',
        user_role: [],
        user_role_structure: [],
        role_active: null,
        user_admin: false,
        user_intro: '',
        user_interest: [],
        user_phone: '',
        user_photo: null,
        user_gender: '',
        user_degree: {
          id: '747cb17c-2a51-4f66-8df1-0dcb7b6f201c',
          career_name: 'Derecho'
        },
        user_projects: [],
        user_curriculum_vitae: null,
        user_skill: [],
        user_country: {
          id: 48,
          name: 'Colombia',
          iso2: 'CO'
        },
        user_department: {
          id: 2877,
          name: 'Norte de Santander',
          iso2: 'NSA'
        },
        user_municipality: {
          id: 20772,
          name: 'Cúcuta'
        },
        user_status: 'Activo'
      }
    ];

    const expectedDataAdapted = userAdapter.adaptList(expectedData);

    service.listUsers().then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(userAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?inst_id=${instId}&user_status=${Status.ACTIVO}`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be get user information', () => {
    const userId = '4a74c6bf-59a2-4270-8bb3-96f194363a46';

    const expectedData = {
      id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
      inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      inst_name: 'Universidad Francisco de Paula Santander',
      user_name: 'Fernando Romero',
      user_email: 'juanfernandoro@ufps.edu.co',
      user_provider: 'regular',
      user_role: [{}],
      user_role_structure: {},
      roleA_ative: null,
      user_admin: false,
      user_intro: 'Hola!, Mi meta es tener libertad financiera.',
      user_interest: [],
      user_phone: '3003719983',
      user_photo: '047360c3-8991-4cb2-b756-06320be46a8e',
      user_gender: 'Hombre',
      user_degree: {
        id: '747cb17c-2a51-4f66-8df1-0dcb7b6f201c',
        career_name: 'Derecho'
      },
      user_projects: [],
      user_curriculum_vitae: '93fb4994-e45b-462f-9e88-93e0758481dd',
      user_skill: [
        'finanzas personales',
        'gestion de tiempo'
      ],
      user_country: {
        id: 48,
        name: 'Colombia',
        iso2: 'CO'
      },
      user_department: {
        id: 2877,
        name: 'Norte de Santander',
        iso2: 'NSA'
      },
      user_municipality: {
        id: 20772,
        name: 'Cúcuta'
      },
      user_status: 'Activo'
    };

    const userAdapted = userAdapter.adaptObjectReceive(expectedData);

    service.getInfoUser(userId).then(response => {
      expect(response).toEqual(expectedData);
      expect(userAdapted).toEqual(userAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${userId}/`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be get user by name', () => {

    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const userName = 'SEMILLERO%20SILUX%20UFPS';

    const expectedData = {
      id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      inst_name: 'Universidad Francisco de Paula Santander',
      user_name: 'SEMILLERO SILUX UFPS',
      user_email: 'silux@ufps.edu.co',
      user_provider: 'Google',
      user_role: [],
      user_role_structure: [],
      roleA_ative: null,
      user_admin: false,
      user_intro: '',
      user_interest: [],
      user_phone: '',
      user_photo: null,
      user_gender: '',
      user_degree: {},
      user_projects: [],
      user_curriculum_vitae: null,
      user_skill: [],
      user_country: {
        id: 48,
        name: 'Colombia',
        iso2: 'CO'
      },
      user_department: {
        id: 2877,
        name: 'Norte de Santander',
        iso2: 'NSA'
      },
      user_municipality: {
        id: 20772,
        name: 'Cúcuta'
      },
      user_status: 'Activo'
    };

    let responseData;

    const userAdapted = userAdapter.adaptObjectReceive(expectedData);

    service.getUserByName(instId, userName).then(response => {
      responseData = response;
      expect(userAdapted).toEqual(userAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}?inst_id=${instId}&user_status=${Status.ACTIVO}&search=${userName}&ordering=user_name`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be user list with pagination', () => {
    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

    const expectedData = [{
      id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
      inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      inst_name: 'Universidad Francisco de Paula Santander',
      user_name: 'Fernando Romero',
      user_email: 'juanfernandoro@ufps.edu.co',
      user_provider: 'regular',
      user_role: [{}],
      user_role_structure: {},
      roleA_ative: null,
      user_admin: false,
      user_intro: 'Hola!, Mi meta es tener libertad financiera.',
      user_interest: [],
      user_phone: '3003719983',
      user_photo: '047360c3-8991-4cb2-b756-06320be46a8e',
      user_gender: 'Hombre',
      user_degree: {
        id: '747cb17c-2a51-4f66-8df1-0dcb7b6f201c',
        career_name: 'Derecho'
      },
      user_projects: [],
      user_curriculum_vitae: '93fb4994-e45b-462f-9e88-93e0758481dd',
      user_skill: [
        'finanzas personales',
        'gestion de tiempo'
      ],
      user_country: {
        id: 48,
        name: 'Colombia',
        iso2: 'CO'
      },
      user_department: {
        id: 2877,
        name: 'Norte de Santander',
        iso2: 'NSA'
      },
      user_municipality: {
        id: 20772,
        name: 'Cúcuta'
      },
      user_status: 'Activo'
    }];

    const paginator = {
      count: 21,
      next: `${url}?inst_id=${instId}&user_status=${Status.ACTIVO}/limit=20&offset=20`,
      previous: null
    };

    const expectedDataAdapted = userAdapter.adaptList(expectedData);

    service.getUserWithPaginator(paginator).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(userAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(paginator.next);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be create user', () => {

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

    const expectedDataAdapted = userAdapter.adaptObjectSend(user);

    service.saveUser(user).then(response => {
      expect(typeof response).toBe('boolean');
      expect(expectedDataAdapted).toEqual(userAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be update user', () => {

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

    const expectedDataAdapted = userAdapter.adaptObjectSend(user);

    service.updateUser(user).then(response => {
      expect(typeof response).toBe('boolean');
      expect(expectedDataAdapted).toEqual(userAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${user.id}/`);
    expect(req.request.method).toBe('PUT');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be change password', () => {

    const user = {
      user: 'yindypaolapu@ufps.edu.co',
      current_password: 'Davinci.2021',
      new_password: 'Joinus.2022'
    };

    const changePasswordAdapted = userAdapter.adaptChangePassword(user);

    service.changePassword(changePasswordAdapted).then(response => {
      expect(typeof response).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}change_password/`);
    expect(req.request.method).toBe('PUT');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be partial update user', () => {
    const idUser = 'cf5e1370-c389-4cbf-a42c-8977354e8fe3';

    const itemUser = {
      id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      user_name: 'Yindy Paola Pájaro Urquijo',
      user_email: 'yindypaolapu@ufps.ed.co',
      user_degree: {
        id: '747cb17c-2a51-4f66-8df1-0dcb7b6f201c',
        career_name: 'Derecho'
      },
      userInterest: []
    };

    const partialInformation = userAdapter.adaptDataUpdatedUser(itemUser);

    service.partialUserUpdate(partialInformation, idUser).then(response => {
      expect(typeof response).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}${idUser}/`);
    expect(req.request.method).toBe('PATCH');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be delete user', () => {

    service.deleteUser('7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1').then(respuesta => {
      expect(typeof respuesta).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1/`);
    expect(req.request.method).toBe('DELETE');
    req.event(new HttpResponse<boolean>({body: true}));

  });

});
