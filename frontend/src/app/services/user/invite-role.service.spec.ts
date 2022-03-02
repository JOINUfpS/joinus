import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {InviteRoleService} from './invite-role.service';
import {InviteRoleModel} from '../../models/user/invite-role.model';
import {UserModel} from '../../models/user/user.model';
import {ProjectModel} from '../../models/user/project.model';
import {InviteRoleAdapter} from '../../adapters/implementation/user/invite-role.adapter';


describe('InviteRoleService', () => {
  let service: InviteRoleService;
  let httpTestingController: HttpTestingController;
  let utilities: UtilitiesConfigString;
  let inviteRoleAdapter: InviteRoleAdapter;
  const url = `${environment.userUrl}invite_role/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InviteRoleService, UtilitiesConfigString, HttpClient]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(InviteRoleService);
    utilities = TestBed.inject(UtilitiesConfigString);
    inviteRoleAdapter = TestBed.inject(InviteRoleAdapter);
    utilities.ls.set('user', new UserModel(
      '7be4a36b-4dfb-430b-a18e-32b9ebbc955b',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Universidad Francisco de Paula Santander',
      'Juan Fernando Romero',
      'romarte07@ufps.edu.co',
      true,
      'Regular',
      [],
      null,
      'Esta es la intro del usuario pruebas',
      ['Películas', 'Real Madrid'],
      '3003718546',
      null,
      'Hombre',
      {
        id: 'f7c0a516-baee-4e3e-b4d2-5db6b3f8abe9',
        careerName: 'Análisis de Datos para la Investigación Científica'
      },
      [new ProjectModel('f7c0a516-baee-4e3e-b4d2-5db6b3f8abe9',
        'Análisis de Datos para la Investigación Científica',
        '',
        new Date(),
        new Date(),
        '')],
      '',
      [],
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
      'Inactivo'));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be list all invitations', () => {
    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const inroType = 'Estándar';

    const expectedData = [{
      id: '07a3f0a6-2a04-46c0-818a-6999cba8f629',
      inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      user_id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      role_id: null,
      inro_status: 'Pendiente',
      inro_type: 'Estándar',
      user_name: 'Yindy Paola Pájaro Urquijo',
      role_name: null,
      user_email: 'yindypaolapu@ufps.edu.co',
      comm_id: null,
      cous_id: null,
      comm_name: ''
    }];

    const expectedDataAdapted = inviteRoleAdapter.adaptObjectReceive(expectedData);

    service.listInviteRole(inroType).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(inviteRoleAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}?inst_id=${instId}&inro_type=${inroType}`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be list invite role with pagination', () => {

    const expectedData = [{
      id: '07a3f0a6-2a04-46c0-818a-6999cba8f629',
      inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      user_id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      role_id: null,
      inro_status: 'Pendiente',
      inro_type: 'Estándar',
      user_name: 'Yindy Paola Pájaro Urquijo',
      role_name: null,
      user_email: 'yindypaolapu@ufps.edu.co',
      comm_id: null,
      cous_id: null,
      comm_name: ''
    }];

    const paginator = {
      count: 21,
      next: `${url}?limit=20&offset=20`,
      previous: null
    };

    const expectedDataAdapted = inviteRoleAdapter.adaptList(expectedData);

    service.listInviteRolesWithPagination(paginator).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(inviteRoleAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?limit=20&offset=20`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be create invite role', () => {

    const inviteRole = new InviteRoleModel('07a3f0a6-2a04-46c0-818a-6999cba8f629',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      null,
      'Pendiente',
      'Estándar',
      'Yindy Paola Pájaro Urquijo',
      null,
      'yindypaolapu@ufps.edu.co',
      null,
      null,
      '');

    const inviteRoleAdapted = inviteRoleAdapter.adaptObjectSend(inviteRole);

    service.saveInviteRole(inviteRole).then(response => {
      expect(typeof response).toBe('boolean');
      expect(inviteRoleAdapted).toEqual(inviteRoleAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be authorize role', () => {

    const inviteRole = new InviteRoleModel('07a3f0a6-2a04-46c0-818a-6999cba8f629',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      null,
      'Pendiente',
      'Estándar',
      'Yindy Paola Pájaro Urquijo',
      null,
      'yindypaolapu@ufps.edu.co',
      null,
      null,
      '');

    const inviteRoleAdapted = inviteRoleAdapter.adaptObjectSend(inviteRole);

    service.authorizeRole(inviteRole).then(response => {
      expect(typeof response).toBe('boolean');
      expect(inviteRoleAdapted).toEqual(inviteRoleAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}authorize_role/${inviteRole.id}/`);
    expect(req.request.method).toBe('PATCH');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be invite take role', () => {

    const inviteRole = new InviteRoleModel(
      '247d34e0-b1a4-48bf-ab20-d344457b5ae6',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      'b9d3160b-611c-4fe1-a617-81255a2a05af',
      'Autorizada',
      'Estándar',
      'SEMILLERO SILUX UFPS',
      'Administrador de la red',
      'silux@ufps.edu.co',
      null,
      null,
      '');

    const inviteRoleAdapted = inviteRoleAdapter.adaptObjectSend(inviteRole);

    service.inviteTakeRole(inviteRole).then(response => {
      expect(typeof response).toBe('boolean');
      expect(inviteRoleAdapted).toEqual(inviteRoleAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}invite_take_role/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be request role', () => {

    const inviteRole = new InviteRoleModel(
      '8294cf2a-f870-4598-810f-f0e5bc7efbea',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      '2db5485c-02cf-4ef2-bd93-4668cd430499',
      'b9d3160b-611c-4fe1-a617-81255a2a05af',
      'Autorizada',
      'Estándar',
      'Angie',
      'Administrador de la red',
      'angiemadeleynegb@ufps.edu.co',
      null,
      null,
      '');

    service.requestRole(inviteRole).then(response => {
      expect(typeof response).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}request_role/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be update invite role', () => {

    const inviteRole = new InviteRoleModel('07a3f0a6-2a04-46c0-818a-6999cba8f629',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      null,
      'Pendiente',
      'Estándar',
      'Yindy Paola Pájaro Urquijo',
      null,
      'yindypaolapu@ufps.edu.co',
      null,
      null,
      '');

    const inviteRoleAdapted = inviteRoleAdapter.adaptObjectSend(inviteRole);

    service.updateInviteRole(inviteRole).then(response => {
      expect(typeof response).toBe('boolean');
      expect(inviteRoleAdapted).toEqual(inviteRoleAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${inviteRole.id}/`);
    expect(req.request.method).toBe('PUT');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be delete invite role', () => {

    service.deleteInviteRole('7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1').then(respuesta => {
      expect(typeof respuesta).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1/`);
    expect(req.request.method).toBe('DELETE');
    req.event(new HttpResponse<boolean>({body: true}));

  });

});
