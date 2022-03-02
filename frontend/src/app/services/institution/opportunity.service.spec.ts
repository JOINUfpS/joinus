import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {OpportunityService} from './opportunity.service';
import {OpportunityModel} from '../../models/institutions/opportunity.model';
import {UserModel} from '../../models/user/user.model';
import {ProjectModel} from '../../models/user/project.model';
import {OpportunityAdapter} from '../../adapters/implementation/institutions/opportunity.adapter';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../utilities/string/const-string';


describe('OpportunityService', () => {
  let service: OpportunityService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let utilities: UtilitiesConfigString;
  let opportunityAdapter: OpportunityAdapter;
  let datePipe: DatePipe;
  let constString: ConstString;
  const url = `${environment.institutionUrl}opportunity/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OpportunityService, UtilitiesConfigString, HttpClient, DatePipe, ConstString]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(OpportunityService);
    opportunityAdapter = TestBed.inject(OpportunityAdapter);
    datePipe = TestBed.inject(DatePipe);
    constString = TestBed.inject(ConstString);
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

  it('should be list all opportunities', () => {
    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

    const expectedData = [
      {
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        user_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        user_name: 'string',
        user_photo: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        oppo_title: 'string',
        oppo_description: 'string',
        oppo_expiration_date: '2021-11-27T22:51:11.958Z',
        oppo_employer_email: 'user@example.com',
        oppo_simple_request: false,
        oppo_application_url: 'string',
        oppo_type_contract: 'string',
        oppo_postulates: [
          '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        ],
        oppo_attachments: [
          {}
        ],
        oppo_user_saved: [
          '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        ],
        oppo_country: {},
        oppo_department: {},
        oppo_municipality: {},
        oppo_salary: 'string',
        oppo_sector: 'string'
      }
    ];

    const expectedDataAdapted = opportunityAdapter.adaptList(expectedData);

    service.listOpportunities().then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(opportunityAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?inst_id=${instId}&ordering=-created_date`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be search opportunities by term', () => {
    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const term = 'Android';
    const expectedData = [
      {
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        user_id: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
        user_name: 'string',
        user_photo: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        oppo_title: 'Desarrollo semi senior Android',
        oppo_description: 'string',
        oppo_expiration_date: '2021-11-27T22:51:11.958Z',
        oppo_employer_email: 'yindypaolapu@ufps.edu.co',
        oppo_simple_request: false,
        oppo_application_url: 'string',
        oppo_type_contract: 'string',
        oppo_postulates: [
          '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        ],
        oppo_attachments: [
          {}
        ],
        oppo_user_saved: [
          '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        ],
        oppo_country: {},
        oppo_department: {},
        oppo_municipality: {},
        oppo_salary: 'string',
        oppo_sector: 'string'
      }
    ];

    const expectedDataAdapted = opportunityAdapter.adaptList(expectedData);

    service.searchOpportunitiesByTerm(instId, term).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(opportunityAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?inst_id=${instId}&search=${term}&ordering=-created_date`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be list opportunities with pagination', () => {
    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const expectedData = [
      {
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        user_id: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
        user_name: 'string',
        user_photo: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        oppo_title: 'Desarrollo semi senior Android',
        oppo_description: 'string',
        oppo_expiration_date: '2021-11-27T22:51:11.958Z',
        oppo_employer_email: 'yindypaolapu@ufps.edu.co',
        oppo_simple_request: false,
        oppo_application_url: 'string',
        oppo_type_contract: 'string',
        oppo_postulates: [
          '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        ],
        oppo_attachments: [
          {}
        ],
        oppo_user_saved: [
          '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        ],
        oppo_country: {},
        oppo_department: {},
        oppo_municipality: {},
        oppo_salary: 'string',
        oppo_sector: 'string'
      },
      {
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        user_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        user_name: 'string',
        user_photo: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        oppo_title: 'string',
        oppo_description: 'string',
        oppo_expiration_date: '2021-11-27T22:51:11.958Z',
        oppo_employer_email: 'user@example.com',
        oppo_simple_request: false,
        oppo_application_url: 'string',
        oppo_type_contract: 'string',
        oppo_postulates: [
          '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        ],
        oppo_attachments: [
          {}
        ],
        oppo_user_saved: [
          '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        ],
        oppo_country: {},
        oppo_department: {},
        oppo_municipality: {},
        oppo_salary: 'string',
        oppo_sector: 'string'
      }
    ];

    const paginator = {
      count: 21,
      next: `${url}?inst_id=${instId}/limit=20&offset=20`,
      previous: null
    };

    const expectedDataAdapted = opportunityAdapter.adaptList(expectedData);

    service.listOpportunitiesWithPagination(paginator).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(opportunityAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(paginator.next);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be get all my opportunities', () => {
    const userId = '4fa85f64-5717-4562-b3fc-2c963f66afa8';
    const expectedData = [
      {
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        user_id: '4fa85f64-5717-4562-b3fc-2c963f66afa8',
        user_name: 'Ana Garcia',
        user_photo: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        oppo_title: 'Desarrollador python',
        oppo_description: 'string',
        oppo_expiration_date: '2021-11-27T22:51:11.958Z',
        oppo_employer_email: 'anagarciau@ufps.edu.co',
        oppo_simple_request: true,
        oppo_application_url: null,
        oppo_type_contract: 'Jornada Completa',
        oppo_postulates: [
          '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        ],
        oppo_attachments: [
          {}
        ],
        oppo_user_saved: [
          '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        ],
        oppo_country: {},
        oppo_department: {},
        oppo_municipality: {},
        oppo_salary: '1000000',
        oppo_sector: 'TIC'
      }
    ];

    const expectedDataAdapted = opportunityAdapter.adaptList(expectedData);

    service.myOpportunities(userId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(opportunityAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?user_id=${userId}&ordering=-created_date`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be get all my opportunities saved', () => {
    const userId = '2082f384-0a6a-42c9-9eca-08b6ca9ac03b';
    const expectedData = [
      {
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        user_id: '4fa85f64-5717-4562-b3fc-2c963f66afa6',
        user_ame: 'Juan David Omega',
        user_photo: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        oppo_title: 'string',
        oppo_description: 'string',
        oppo_expiration_date: '2021-11-27T22:51:11.958Z',
        oppo_employer_email: 'user@example.com',
        oppo_simple_request: false,
        oppo_application_url: 'string',
        oppo_type_contract: 'string',
        oppo_postulates: [
          '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        ],
        oppo_attachments: [
          {}
        ],
        oppo_user_saved: [
          '2082f384-0a6a-42c9-9eca-08b6ca9ac03b'
        ],
        oppo_country: {
          id: 48,
          name: 'Colombia',
          iso2: 'CO'
        },
        oppo_department: {
          id: 2877,
          name: 'Norte de Santander',
          iso2: 'NSA'
        },
        oppo_municipality: {
          id: 20772,
          name: 'Cúcuta'
        },
        oppo_salary: 'string',
        oppo_sector: 'string'
      }
    ];

    const expectedDataAdapted = opportunityAdapter.adaptList(expectedData);

    service.myOpportunities(userId).then(response => {
      expect(expectedDataAdapted).toEqual(opportunityAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?user_id=${userId}&ordering=-created_date`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be create opportunity', () => {

    const opportunity = new OpportunityModel('90e18070-ce97-40b8-a2db-efdc89afa8fa',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'string',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'string',
      'string',
      new Date(),
      'user@example.com',
      false,
      'string',
      {
        id: 'b8cca0cd-147e-47f1-96b6-ead94f421369',
        instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        cateName: 'Conferencia',
        cateDescription: 'El usuario puede subir videos, imagenes o documentos de la conferencia que pretende publicar',
        cateType: 'Documento',
        cateStatus: 'Activo'
      },
      [{
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        fileExtension: '.jpg',
        filePath: '',
        fileSize: '',
        fileType: ''
      }],
      ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      {},
      {},
      {},
      'string',
      new Date());

    const opportunityCreate = opportunityAdapter.adaptObjectSend(opportunity);

    service.saveOpportunity(opportunity).then(response => {
      expect(typeof response).toBe('boolean');
      expect(opportunityCreate).toEqual(opportunityAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be update opportunity', () => {

    const opportunity = new OpportunityModel('90e18070-ce97-40b8-a2db-efdc89afa8fa',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Fernando Romero',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Oferta de trabajo product owner',
      'string',
      new Date(),
      'juanfernandoro@ufps.edu.co',
      false,
      'string',
      {
        id: 'b8cca0cd-147e-47f1-96b6-ead94f421369',
        instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        cateName: 'Conferencia',
        cateDescription: 'El usuario puede subir videos, imagenes o documentos de la conferencia que pretende publicar',
        cateType: 'Documento',
        cateStatus: 'Activo'
      },
      [{
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        fileExtension: '.jpg',
        filePath: '',
        fileSize: '',
        fileType: ''
      }],
      ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      {},
      {},
      {},
      '5000000',
      new Date());

    const opportunityUpdate = opportunityAdapter.adaptObjectSend(opportunity);

    service.updateOpportunity(opportunity).then(response => {
      expect(typeof response).toBe('boolean');
      expect(opportunityUpdate).toEqual(opportunityAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${opportunity.id}/`);
    expect(req.request.method).toBe('PUT');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be delete opportunity', () => {

    service.deleteOpportunity('7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1').then(respuesta => {
      expect(typeof respuesta).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1/`);
    expect(req.request.method).toBe('DELETE');
    req.event(new HttpResponse<boolean>({body: true}));

  });

  it('Should be apply opportunity', () => {

    const opportunityApply = opportunityAdapter
      .applyOpportunityAdapter({}, 'yindypaolapu@ufps.edu.co', '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1');

    service.applyOpportunity(opportunityApply).then(response => {
      expect(typeof response).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}apply_opportunity/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

});
