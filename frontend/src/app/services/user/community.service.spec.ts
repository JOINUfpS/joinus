import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CommunityService} from './community.service';
import {CommunityModel} from '../../models/user/community.model';
import {CommunityAdapter} from '../../adapters/implementation/user/community.adapter';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';


describe('CommunityService', () => {
  let service: CommunityService;
  let httpTestingController: HttpTestingController;
  let communityAdapter: CommunityAdapter;
  let utilities: UtilitiesConfigString;
  const url = `${environment.userUrl}community/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommunityService, HttpClient, UtilitiesConfigString]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CommunityService);
    communityAdapter = TestBed.inject(CommunityAdapter);
    utilities = TestBed.inject(UtilitiesConfigString);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be get community by id', () => {
    const id = '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1';
    const expectedData = {
      id: '1312beb0-fdb4-4e16-ba0a-b735f76c4252',
      inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      comm_photo_id: null,
      comm_owner_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      comm_name: 'Joinufps',
      comm_description: 'Publicar todo lo relacionado a la plataforma, dudas, preguntas y reporte de errores encontrados.',
      comm_category: 'b2fc6670-1758-4e8b-a2cb-2a68cc6bc739',
      comm_category_name: 'Grupo de estudio',
      comm_privacy: true,
      comm_amount_member: 2
    };

    const expectedDataAdapted = communityAdapter.adaptObjectReceive(expectedData);

    service.getCommunityById(id).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(communityAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${id}/`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be create community', () => {

    const community = new CommunityModel('1312beb0-fdb4-4e16-ba0a-b735f76c4252',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      null,
      'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      'Joinufps',
      'Publicar todo lo relacionado a la plataforma, dudas, preguntas y reporte de errores encontrados.',
      'b2fc6670-1758-4e8b-a2cb-2a68cc6bc739',
      'Grupo de estudio',
      true,
      2);

    const communityAdapted = communityAdapter.adaptObjectSend(community);

    service.saveCommunity(community).then(response => {
      expect(typeof response).toBe('boolean');
      expect(communityAdapted).toEqual(communityAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be update community', () => {

    const community = new CommunityModel('1312beb0-fdb4-4e16-ba0a-b735f76c4252',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      null,
      'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      'Joinufps',
      'Publicar todo lo relacionado a la plataforma, dudas, preguntas y reporte de errores encontrados.',
      'b2fc6670-1758-4e8b-a2cb-2a68cc6bc739',
      'Grupo de estudio',
      true,
      2);

    const communityAdapted = communityAdapter.adaptObjectSend(community);

    service.updateCommunity(community).then(response => {
      expect(typeof response).toBe('boolean');
      expect(communityAdapted).toEqual(communityAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${community.id}/`);
    expect(req.request.method).toBe('PUT');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be delete community', () => {

    service.deleteCommunity('7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1').then(respuesta => {
      expect(typeof respuesta).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1/`);
    expect(req.request.method).toBe('DELETE');
    req.event(new HttpResponse<boolean>({body: true}));

  });

  it('should be list all community of communities', () => {

    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const userId = '459b4946-37db-44e5-9605-cd8a47f35de2';
    const expectedData = [
      {
        communities_managed: [{
          id: '1312beb0-fdb4-4e16-ba0a-b735f76c4252',
          inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          comm_photo_id: null,
          comm_owner_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
          comm_name: 'Joinufps',
          comm_description: 'Publicar todo lo relacionado a la plataforma, dudas, preguntas y reporte de errores encontrados.',
          comm_category: 'b2fc6670-1758-4e8b-a2cb-2a68cc6bc739',
          comm_category_name: 'Grupo de estudio',
          comm_privacy: true,
          comm_amount_member: 2
        }],
        communities_member: [],
        communities_pending_approval: [],
        other_communities: [{
          id: '1312beb0-fdb4-4e16-ba0a-b735f76c4252',
          inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          comm_photo_id: null,
          comm_owner_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
          comm_name: 'Musical',
          comm_description: 'Es un espacio pensado para compartir experiencias con la música',
          comm_category: 'b2fc6670-1758-4e8b-a2cb-2a68cc6bc739',
          comm_category_name: 'Grupo de estudio',
          comm_privacy: true,
          comm_amount_member: 2
        }]
      }
    ];

    const expectedDataAdapted = communityAdapter.adaptList(expectedData);

    service.getAllCategoriesOfCommunities(instId, userId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(communityAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}communities_categories/${instId}/${userId}/`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be list all community by term', () => {

    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const term = 'música';
    const expectedData = [
      {
        id: '1312beb0-fdb4-4e16-ba0a-b735f76c4252',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        comm_photo_id: null,
        comm_owner_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        comm_name: 'Musical',
        comm_description: 'Es un espacio pensado para compartir experiencias con la música',
        comm_category: 'b2fc6670-1758-4e8b-a2cb-2a68cc6bc739',
        comm_category_name: 'Grupo de estudio',
        comm_privacy: true,
        comm_amount_member: 2
      }
    ];

    const expectedDataAdapted = communityAdapter.adaptList(expectedData);

    service.searchCommunitiesByTerm(instId, term).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(communityAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?inst_id=${instId}&search=${term}&ordering=comm_name`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be list with pagination', () => {

    const expectedData = [
      {
        id: '1312beb0-fdb4-4e16-ba0a-b735f76c4252',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        comm_photo_id: null,
        comm_owner_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        comm_name: 'Joinufps',
        comm_description: 'Publicar todo lo relacionado a la plataforma, dudas, preguntas y reporte de errores encontrados.',
        comm_category: 'b2fc6670-1758-4e8b-a2cb-2a68cc6bc739',
        comm_category_name: 'Grupo de estudio',
        comm_privacy: true,
        comm_amount_member: 2
      }
    ];

    const paginator = {
      count: 21,
      next: `${url}?limit=20&offset=20`,
      previous: null
    };

    const expectedDataAdapted = communityAdapter.adaptList(expectedData);

    service.getCommunityWithPaginator(paginator).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(communityAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?limit=20&offset=20`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be partial update community', () => {

    const community = new CommunityModel('1312beb0-fdb4-4e16-ba0a-b735f76c4252',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      null,
      'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      'Joinufps',
      'Publicar todo lo relacionado a la plataforma, dudas, preguntas y reporte de errores encontrados.',
      'b2fc6670-1758-4e8b-a2cb-2a68cc6bc739',
      'Grupo de estudio',
      true,
      2);

    const communityAdapted = communityAdapter.adaptObjectSend(community);

    service.patchCommunity(community, community.id).then(response => {
      expect(typeof response).toBe('boolean');
      expect(communityAdapted).toEqual(communityAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${community.id}/`);
    expect(req.request.method).toBe('PATCH');
    req.event(new HttpResponse<boolean>({body: true}));
  });

});
