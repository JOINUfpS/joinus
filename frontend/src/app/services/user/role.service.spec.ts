import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {RoleService} from './role.service';
import {RoleModel} from '../../models/user/role.model';
import {RoleAdapter} from '../../adapters/implementation/user/role.adapter';
import {UserModel} from '../../models/user/user.model';
import {ProjectModel} from '../../models/user/project.model';


describe('RoleService', () => {
  let service: RoleService;
  let httpTestingController: HttpTestingController;
  let utilities: UtilitiesConfigString;
  let roleAdapter: RoleAdapter;
  const url = `${environment.userUrl}role/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoleService, UtilitiesConfigString, HttpClient]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RoleService);
    roleAdapter = TestBed.inject(RoleAdapter);
    utilities = TestBed.inject(UtilitiesConfigString);
    utilities.ls.set('user', new UserModel(
      '7be4a36b-4dfb-430b-a18e-32b9ebbc955b',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Universidad Francisco de Paula Santander',
      'Romarte que va amarte',
      'romarte07@ufps.edu.co',
      true,
      'Regular',
      [],
      null,
      'Esta es la intro del usuario pruebas',
      ['Peliculas'],
      '',
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

  it('should be list all roles', () => {
    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

    const expectedData = [
      {
        id: '2d12bacc-8f7a-4624-85e2-7dacda5927bf',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        role_name: 'Prueba de rol',
        role_list_module: [
          {
            id: '2d4aa9de-0a8e-4dd7-bc8f-b4616834d2fc',
            perm_list: ['Editar']
          }
        ],
        role_structure: [
          {
            id: '2d4aa9de-0a8e-4dd7-bc8f-b4616834d2fc',
            modu_name: 'Instituciones',
            modu_router: '/institucion',
            modu_icon: 'home',
            modu_status: 'Activo',
            modu_permissions: ['Editar'],
            modu_is_generic: false
          }
        ],
        role_static: false,
        role_status: 'ACTIVO'
      }
    ];

    const expectedDataAdapted = roleAdapter.adaptList(expectedData);

    service.listRoles().then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(roleAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?inst_id=${instId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be get role by id', () => {
    const roleId = '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1';

    const expectedData = {
      id: '2d12bacc-8f7a-4624-85e2-7dacda5927bf',
      inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      role_name: 'Prueba de rol',
      role_list_module: [
        {
          id: '2d4aa9de-0a8e-4dd7-bc8f-b4616834d2fc',
          perm_list: ['Editar']
        }
      ],
      role_structure: [
        {
          id: '2d4aa9de-0a8e-4dd7-bc8f-b4616834d2fc',
          modu_name: 'Instituciones',
          modu_router: '/institucion',
          modu_icon: 'home',
          modu_status: 'Activo',
          modu_permissions: ['Editar'],
          modu_is_generic: false
        }
      ],
      role_static: false,
      role_status: 'ACTIVO'
    };

    const expectedDataAdapted = roleAdapter.adaptObjectReceive(expectedData);

    service.getRole(roleId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(roleAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${roleId}/`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be save role', () => {

    const role = new RoleModel('2d12bacc-8f7a-4624-85e2-7dacda5927bf',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Prueba de rol',
      [],
      [{
        id: '2d4aa9de-0a8e-4dd7-bc8f-b4616834d2fc',
        moduName: 'Instituciones',
        moduRouter: '/institucion',
        moduIcon: 'home',
        moduStatus: 'Activo',
        moduPermissions: ['Editar'],
        moduIsGeneric: false
      }],
      false,
      'ACTIVO');

    const expectedDataAdapted = roleAdapter.adaptObjectReceive(role);

    service.saveRole(role).then(response => {
      expect(typeof response).toBe('boolean');
      expect(expectedDataAdapted).toEqual(roleAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be update role', () => {

    const role = new RoleModel('2d12bacc-8f7a-4624-85e2-7dacda5927bf',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Prueba de rol',
      [],
      [{
        id: '2d4aa9de-0a8e-4dd7-bc8f-b4616834d2fc',
        moduName: 'Instituciones',
        moduRouter: '/institucion',
        moduIcon: 'home',
        moduStatus: 'Activo',
        moduPermissions: ['Editar'],
        moduIsGeneric: false
      }],
      false,
      'ACTIVO');

    const expectedDataAdapted = roleAdapter.adaptObjectReceive(role);

    service.updateRole(role).then(response => {
      expect(typeof response).toBe('boolean');
      expect(expectedDataAdapted).toEqual(roleAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${role.id}/`);
    expect(req.request.method).toBe('PUT');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be delete role', () => {

    service.deleteRole('7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1').then(respuesta => {
      expect(typeof respuesta).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1/`);
    expect(req.request.method).toBe('DELETE');
    req.event(new HttpResponse<boolean>({body: true}));

  });

});
