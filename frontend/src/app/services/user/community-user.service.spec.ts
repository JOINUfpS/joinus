import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {CommunityUserService} from './community-user.service';
import {CommunityUserModel} from '../../models/user/community-user.model';
import {CommunityUserAdapter} from '../../adapters/implementation/user/community-user.adapter';


describe('CommunityUserService', () => {
  let service: CommunityUserService;
  let httpTestingController: HttpTestingController;
  let communityUserAdapter: CommunityUserAdapter;
  const url = `${environment.userUrl}community_user/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommunityUserService, UtilitiesConfigString, HttpClient]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CommunityUserService);
    communityUserAdapter = TestBed.inject(CommunityUserAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be get community user', () => {

    const commId = '1312beb0-fdb4-4e16-ba0a-b735f76c4252';
    const userId = 'cf5e1370-c389-4cbf-a42c-8977354e8fe3';

    const expectedData =
      {
        id: '6eec0eb3-1a95-421f-93c1-cb7a885bcea8',
        comm_id: '1312beb0-fdb4-4e16-ba0a-b735f76c4252',
        comm_owner_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        comm_photo: null,
        user_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        cous_pending_approval: false,
        cous_admin: true,
        comm_name: 'Joinufps',
        comm_category_name: 'Grupo de estudio',
        user_name: 'SEMILLERO SILUX UFPS',
        user_email: 'silux@ufps.edu.co',
        user_phone: '',
        user_photo: null,
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        inst_name: 'Universidad Francisco de Paula Santander'
      };

    const expectedDataAdapted = communityUserAdapter.adaptObjectReceive(expectedData);

    service.getCommunityUser(commId, userId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(communityUserAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}?comm_id=${commId}&user_id=${userId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be get users by community', () => {

    const commId = '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1';

    const expectedData = [
      {
        id: '6eec0eb3-1a95-421f-93c1-cb7a885bcea8',
        comm_id: '1312beb0-fdb4-4e16-ba0a-b735f76c4252',
        comm_owner_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        comm_photo: null,
        user_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        cous_pending_approval: false,
        cous_admin: true,
        comm_name: 'Joinufps',
        comm_category_name: 'Grupo de estudio',
        user_name: 'SEMILLERO SILUX UFPS',
        user_email: 'silux@ufps.edu.co',
        user_phone: '',
        user_photo: null,
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        inst_name: 'Universidad Francisco de Paula Santander'
      }
    ];

    const expectedDataAdapted = communityUserAdapter.adaptList(expectedData);

    service.getUsersByCommunity(commId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(communityUserAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?comm_id=${commId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be create community user', () => {

    const communityUser = new CommunityUserModel('6eec0eb3-1a95-421f-93c1-cb7a885bcea8',
      '1312beb0-fdb4-4e16-ba0a-b735f76c4252',
      'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      true,
      false,
      'Joinufps',
      'SEMILLERO SILUX UFPS',
      'silux@ufps.edu.co',
      '32546879',
      '',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Universidad Francisco de Paula Santander');

    const communityUserAdapted = communityUserAdapter.adaptObjectSend(communityUser);

    service.saveCommunityUser(communityUser).then(response => {
      expect(typeof response).toBe('boolean');
      expect(communityUserAdapted).toEqual(communityUserAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be delete community user per user', () => {

    const communityId = '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1';
    const userId = '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1';

    service.deleteCommunityUserPerUser(communityId, userId).then(respuesta => {
      expect(typeof respuesta).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}information/${communityId}/${userId}/`);
    expect(req.request.method).toBe('DELETE');
    req.event(new HttpResponse<boolean>({body: true}));

  });

  it('should be get member and no members', () => {
    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const commId = '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1';

    const expectedData = [{
      members: [{
        id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        inst_name: 'Universidad Francisco de Paula Santander',
        user_name: 'SEMILLERO SILUX UFPS',
        user_email: 'silux@ufps.edu.co',
        user_provider: 'Google',
        user_role: [{
          roleId: 'b9d3160b-611c-4fe1-a617-81255a2a05af',
          roleName: 'Administrador de la red'
        }],
        user_role_structure: [
          {
            id: 'c6d28c75-b79b-4154-b943-3979eb753d68',
            modu_name: 'Comunidades',
            modu_router: '/usuarios/comunidades',
            modu_icon: 'community',
            modu_status: 'Activo',
            modu_permissions: [
              'Ver',
              'Crear',
              'Editar',
              'Borrar'
            ],
            modu_is_generic: true
          }
        ],
        role_active: 'b9d3160b-611c-4fe1-a617-81255a2a05af',
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
        user_department: {},
        user_municipality: {
          id: 20772,
          name: 'Cúcuta'
        },
        user_status: 'Activo',
        is_member: true
      }],
      no_members: [{
        id: '70c22228-8956-4378-8e7d-9de59cc14bfd',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        inst_name: 'Universidad Francisco de Paula Santander',
        user_name: 'CRISEL JAZMIN AYALA LLANES',
        user_email: 'criseljazminal@ufps.edu.co',
        user_provider: 'Google',
        user_role: [],
        user_role_structure: [],
        role_active: null,
        user_admin: false,
        user_intro: '',
        user_interest: [],
        user_phone: '',
        user_photo: '29c6785a-ae00-4ce0-b28c-b8defbd63051',
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
        user_status: 'Activo',
        is_member: false
      }]
    }];

    const expectedDataAdapted = communityUserAdapter.adaptList(expectedData);

    service.getMembersAndNoMembers(instId, commId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(communityUserAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}members_and_no_members/${instId}/${commId}/`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be partial update community user', () => {
    const cousId = '90e18070-ce97-40b8-a2db-efdc89afa8fa';

    const communityUser = new CommunityUserModel('6eec0eb3-1a95-421f-93c1-cb7a885bcea8',
      '1312beb0-fdb4-4e16-ba0a-b735f76c4252',
      'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      false,
      true,
      'Joinufps',
      'SEMILLERO SILUX UFPS',
      'silux@ufps.edu.co',
      '32478954',
      '',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Universidad Francisco de Paula Santander');

    const communityUserAdapted = communityUserAdapter.adaptObjectSend(communityUser);

    service.patchCommunityUser(communityUser, cousId).then(response => {
      expect(typeof response).toBe('boolean');
      expect(communityUserAdapted).toEqual(communityUserAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${cousId}/`);
    expect(req.request.method).toBe('PATCH');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('should be approve union community user', () => {

    const cousId = '6eec0eb3-1a95-421f-93c1-cb7a885bcea8';
    const body = {
      id: '6eec0eb3-1a95-421f-93c1-cb7a885bcea8',
      comm_id: '1312beb0-fdb4-4e16-ba0a-b735f76c4252',
      comm_owner_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      comm_photo: null,
      user_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      cous_pending_approval: false,
      cous_admin: true,
      comm_name: 'Joinufps',
      comm_category_name: 'Grupo de estudio',
      user_name: 'SEMILLERO SILUX UFPS',
      user_email: 'silux@ufps.edu.co',
      user_phone: '',
      user_photo: null,
      inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      inst_name: 'Universidad Francisco de Paula Santander'
    };

    const communityAdapted = communityUserAdapter.adaptObjectSend(body);

    service.approveUnion(body, cousId).then(response => {
      expect(typeof response).toBe('boolean');
      expect(communityAdapted).toEqual(communityUserAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}approve_union/${cousId}/`);
    expect(req.request.method).toBe('PATCH');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be delete community user', () => {

    const communityId = '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1';

    service.deleteCommunityUser(communityId).then(respuesta => {
      expect(typeof respuesta).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}${communityId}/`);
    expect(req.request.method).toBe('DELETE');
    req.event(new HttpResponse<boolean>({body: true}));

  });

});
