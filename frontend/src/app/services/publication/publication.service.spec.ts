import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {PublicationService} from './publication.service';
import {PublicationModel} from '../../models/publication/publication.model';
import {UserModel} from '../../models/user/user.model';
import {ProjectModel} from '../../models/user/project.model';
import {PublicationAdapter} from '../../adapters/implementation/publication/publication.adapter';
import {FollowUserModel} from '../../models/user/follow.user.model';
import {ProjectAdapter} from '../../adapters/implementation/user/project.adapter';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../utilities/string/const-string';


describe('PublicationService', () => {
  let service: PublicationService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let utilities: UtilitiesConfigString;
  let publicationAdapter: PublicationAdapter;
  let projectAdapter: ProjectAdapter;
  let datePipe: DatePipe;
  let constString: ConstString;
  const url = `${environment.publicationUrl}publication/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PublicationService, UtilitiesConfigString, HttpClient, ProjectAdapter, DatePipe, ConstString]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PublicationService);
    utilities = TestBed.inject(UtilitiesConfigString);
    publicationAdapter = TestBed.inject(PublicationAdapter);
    projectAdapter = TestBed.inject(ProjectAdapter);
    datePipe = TestBed.inject(DatePipe);
    constString = TestBed.inject(ConstString);
    utilities.ls.set('user', new UserModel(
      '7be4a36b-4dfb-430b-a18e-32b9ebbc955b',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Universidad Francisco de Paula Santander',
      'Fernando Romero',
      'romarte07@ufps.edu.co',
      true,
      'Regular',
      [],
      null,
      'Soy una persona resiliente con muchas capacidades de aprendizaje continuo',
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

  it('should be list all publication', () => {
    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const expectedData = [
      {
        id: '336d249e-1d75-4e09-9199-1e33e93ff370',
        user_id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        user_name: 'Yindy Paola Pájaro Urquijo',
        user_photo: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        comm_id: null,
        comm_name: '',
        cate_id: null,
        cate_name: '',
        publ_title: 'Aplicación movil para la administración de las granjas porcinas',
        publ_description: '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
        publ_standard: true,
        publ_authors: [{
          id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
          author_name: 'Yindy Paola Pájaro Urquijo',
          author_photo: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2'
        },
          {
            id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
            author_name: 'Fernando Romero',
            author_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
          }
        ],
        publ_privacy: false,
        publ_date: '16-06-2020 05:00 AM',
        publ_comment: [
          {
            id: '7ccfbb15-880d-4b01-896e-af7989ff3402',
            comm_user_id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
            comm_user_name: 'Fernando Romero',
            comm_user_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc',
            comm_content: 'Esta versión móvil de la aplicación Softpig tiene como objetivo principal ser una herramienta TIC más sencilla de manipular para el usuario, ofreciendole mayor seguridad y cercanía a esta; accediendo a ella desde un dispositivo que puede guardar en su bolsillo, y eliminando así el requisito de espacio para recursos físicos como portátiles o computadora de escritorio.',
            comm_date: '18-10-2021 03:55 PM'
          },
          {
            id: '55ee7b56-2f43-45f5-9fc7-f16c654e6cc1',
            comm_user_id: '3d92fb5a-2ff9-4bd0-b42d-3c22e57a4cf1',
            comm_user_name: 'MILTON JESUS VERA CONTRERAS',
            comm_user_photo: 'c3bca429-78cc-4235-a323-6ad4db411fa5',
            comm_content: 'Es un proyecto muy interesante, con este pordrian llegar a implementar lector de codigo de barras, que este integrado con los dispositivos que se le colocan en las orejas a los porcinos ',
            comm_date: '27-10-2021 08:58 PM'
          }
        ],
        publ_interested_list: [
          '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
          'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
          '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          '2db5485c-02cf-4ef2-bd93-4668cd430499'
        ],
        user_interested: false,
        publ_amount_shared: 4,
        publ_amount_download: 0,
        publ_attachments: [
          {
            id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
            fileType: 'image/png',
            name: 'Sin título.png'
          }
        ],
        publ_full_text: false,
        publ_link_doi: '',
        publ_permission_view_full_text: [],
        publ_project_id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        publ_project: {
          id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
          title: 'Softpig',
          abstract: 'Plataforma para administrar ganado porcino',
          start_date: '04/2018',
          end_date: '06/2020',
          link: null
        },
        created_date: '28-10-2021 09:13 PM'
      }
    ];

    const expectedDataAdapted = publicationAdapter.adaptList(expectedData);

    service.listPublications().then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(publicationAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?inst_id=${instId}&publ_privacy=false&ordering=-created_date`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be list get publication', () => {
    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const expectedData = [
      {
        id: '336d249e-1d75-4e09-9199-1e33e93ff370',
        user_id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        user_name: 'Yindy Paola Pájaro Urquijo',
        user_photo: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        comm_id: null,
        comm_name: '',
        cate_id: null,
        cate_name: '',
        publ_title: 'Aplicación movil para la administración de las granjas porcinas',
        publ_description: '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
        publ_standard: true,
        publ_authors: [{
          id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          author_name: 'Fernando Romero',
          author_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
        }
        ],
        publ_privacy: false,
        publ_date: '16-06-2020 05:00 AM',
        publ_comment: [
          {
            id: '7ccfbb15-880d-4b01-896e-af7989ff3402',
            comm_user_id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
            comm_user_name: 'Fernando Romero',
            comm_user_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc',
            comm_content: 'Esta versión móvil de la aplicación Softpig tiene como objetivo principal ser una herramienta TIC más sencilla de manipular para el usuario, ofreciendole mayor seguridad y cercanía a esta; accediendo a ella desde un dispositivo que puede guardar en su bolsillo, y eliminando así el requisito de espacio para recursos físicos como portátiles o computadora de escritorio.',
            comm_date: '18-10-2021 03:55 PM'
          },
          {
            id: '55ee7b56-2f43-45f5-9fc7-f16c654e6cc1',
            comm_user_id: '3d92fb5a-2ff9-4bd0-b42d-3c22e57a4cf1',
            comm_user_name: 'MILTON JESUS VERA CONTRERAS',
            comm_user_photo: 'c3bca429-78cc-4235-a323-6ad4db411fa5',
            comm_content: 'Es un proyecto muy interesante, con este pordrian llegar a implementar lector de codigo de barras, que este integrado con los dispositivos que se le colocan en las orejas a los porcinos ',
            comm_date: '27-10-2021 08:58 PM'
          }
        ],
        publ_interested_list: ['8d9f8558-a7e0-4b15-a47c-874f33c6e2a9'],
        user_interested: false,
        publ_amount_shared: 4,
        publ_amount_download: 0,
        publ_attachments: [
          {
            id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
            fileType: 'image/png',
            name: 'Sin título.png'
          }
        ],
        publ_full_text: false,
        publ_link_doi: '',
        publ_permission_view_full_text: [],
        publ_project_id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        publ_project: {
          id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
          title: 'Softpig',
          abstract: 'Plataforma para administrar ganado porcino',
          start_date: '04/2018',
          end_date: '06/2020',
          link: null
        },
        created_date: '28-10-2021 09:13 PM'
      }
    ];

    const expectedDataAdapted = publicationAdapter.adaptList(expectedData);

    service.listPublications().then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(publicationAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?inst_id=${instId}&publ_privacy=false&ordering=-created_date`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be get my publications', () => {
    const userId = '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9';
    const expectedData = [
      {
        id: '336d249e-1d75-4e09-9199-1e33e93ff370',
        user_id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        user_name: 'Yindy Paola Pájaro Urquijo',
        user_photo: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        comm_id: null,
        comm_name: '',
        cate_id: null,
        cate_name: '',
        publ_title: 'Aplicación movil para la administración de las granjas porcinas',
        publ_description: '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
        publ_standard: true,
        publ_authors: [{
          id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          author_name: 'Fernando Romero',
          author_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
        }
        ],
        publ_privacy: false,
        publ_date: '16-06-2020 05:00 AM',
        publ_comment: [
          {
            id: '7ccfbb15-880d-4b01-896e-af7989ff3402',
            comm_user_id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
            comm_user_name: 'Fernando Romero',
            comm_user_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc',
            comm_content: 'Esta versión móvil de la aplicación Softpig tiene como objetivo principal ser una herramienta TIC más sencilla de manipular para el usuario, ofreciendole mayor seguridad y cercanía a esta; accediendo a ella desde un dispositivo que puede guardar en su bolsillo, y eliminando así el requisito de espacio para recursos físicos como portátiles o computadora de escritorio.',
            comm_date: '18-10-2021 03:55 PM'
          },
          {
            id: '55ee7b56-2f43-45f5-9fc7-f16c654e6cc1',
            comm_user_id: '3d92fb5a-2ff9-4bd0-b42d-3c22e57a4cf1',
            comm_user_name: 'MILTON JESUS VERA CONTRERAS',
            comm_user_photo: 'c3bca429-78cc-4235-a323-6ad4db411fa5',
            comm_content: 'Es un proyecto muy interesante, con este pordrian llegar a implementar lector de codigo de barras, que este integrado con los dispositivos que se le colocan en las orejas a los porcinos ',
            comm_date: '27-10-2021 08:58 PM'
          }
        ],
        publ_interested_list: ['8d9f8558-a7e0-4b15-a47c-874f33c6e2a9'],
        user_interested: false,
        publ_amount_shared: 4,
        publ_amount_download: 0,
        publ_attachments: [
          {
            id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
            fileType: 'image/png',
            name: 'Sin título.png'
          }
        ],
        publ_full_text: false,
        publ_link_doi: '',
        publ_permission_view_full_text: [],
        publ_project_id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        publ_project: {
          id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
          title: 'Softpig',
          abstract: 'Plataforma para administrar ganado porcino',
          start_date: '04/2018',
          end_date: '06/2020',
          link: null
        },
        created_date: '28-10-2021 09:13 PM'
      }
    ];

    const expectedDataAdapted = publicationAdapter.adaptList(expectedData);

    service.getMyPublications(userId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(publicationAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?user_id=${userId}&ordering=-created_date`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be search publication by term', () => {
    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const term = 'Aplicación movil';
    const expectedData = [
      {
        id: '336d249e-1d75-4e09-9199-1e33e93ff370',
        user_id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        user_name: 'Yindy Paola Pájaro Urquijo',
        user_photo: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        comm_id: null,
        comm_name: '',
        cate_id: null,
        cate_name: '',
        publ_title: 'Aplicación movil para la administración de las granjas porcinas',
        publ_description: '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
        publ_standard: true,
        publ_authors: [{
          id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          author_name: 'Fernando Romero',
          author_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
        }
        ],
        publ_privacy: false,
        publ_date: '16-06-2020 05:00 AM',
        publ_comment: [],
        publ_interested_list: ['8d9f8558-a7e0-4b15-a47c-874f33c6e2a9'],
        user_interested: false,
        publ_amount_shared: 4,
        publ_amount_download: 0,
        publ_attachments: [
          {
            id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
            fileType: 'image/png',
            name: 'Sin título.png'
          }
        ],
        publ_full_text: false,
        publ_link_doi: '',
        publ_permission_view_full_text: [],
        publ_project_id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        publ_project: {
          id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
          title: 'Softpig',
          abstract: 'Plataforma para administrar ganado porcino',
          start_date: '04/2018',
          end_date: '06/2020',
          link: null
        },
        created_date: '28-10-2021 09:13 PM'
      }
    ];

    const expectedDataAdapted = publicationAdapter.adaptList(expectedData);

    service.searchPublicationsByTerm(instId, term).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(publicationAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?search=${term}&publ_privacy=false&publ_standard=true&inst_id=${instId}&ordering=-created_date`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be search question by term', () => {
    const instId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const term = 'granjas porcinas';
    const expectedData = [
      {
        id: '336d249e-1d75-4e09-9199-1e33e93ff370',
        user_id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        user_name: 'Yindy Paola Pájaro Urquijo',
        user_photo: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        comm_id: null,
        comm_name: '',
        cate_id: null,
        cate_name: '',
        publ_title: 'Aplicación movil para la administración de las granjas porcinas',
        publ_description: '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
        publ_standard: false,
        publ_authors: [],
        publ_privacy: false,
        publ_date: '16-06-2020 05:00 AM',
        publ_comment: [],
        publ_interested_list: [
          '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
          'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
          '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          '2db5485c-02cf-4ef2-bd93-4668cd430499'
        ],
        user_interested: false,
        publ_amount_shared: 4,
        publ_amount_download: 0,
        publ_attachments: [
          {
            id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
            fileType: 'image/png',
            name: 'Sin título.png'
          }
        ],
        publ_full_text: false,
        publ_link_doi: '',
        publ_permission_view_full_text: [],
        publ_project_id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        publ_project: {
          id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
          title: 'Softpig',
          abstract: 'Plataforma para administrar ganado porcino',
          start_date: '04/2018',
          end_date: '06/2020',
          link: null
        },
        created_date: '28-10-2021 09:13 PM'
      }
    ];

    const expectedDataAdapted = publicationAdapter.adaptList(expectedData);

    service.searchQuestionByTerm(instId, term).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(publicationAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?publ_privacy=false&publ_standard=false&inst_id=${instId}&search=${term}&ordering=-created_date`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be list all publications by community', () => {
    const commId = '9cf4a9af-efe9-487d-9f3b-3a93ea1093fc';
    const expectedData = [
      {
        id: '336d249e-1d75-4e09-9199-1e33e93ff370',
        user_id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        user_name: 'Yindy Paola Pájaro Urquijo',
        user_photo: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        comm_id: '9cf4a9af-efe9-487d-9f3b-3a93ea1093fc',
        comm_name: 'Community test',
        cate_id: null,
        cate_name: '',
        publ_title: 'Aplicación movil para la administración de las granjas porcinas',
        publ_description: '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
        publ_standard: true,
        publ_authors: [],
        publ_privacy: false,
        publ_date: '16-06-2020 05:00 AM',
        publ_comment: [
          {
            id: '7ccfbb15-880d-4b01-896e-af7989ff3402',
            comm_user_id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
            comm_user_name: 'Fernando Romero',
            comm_user_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc',
            comm_content: 'Esta versión móvil de la aplicación Softpig tiene como objetivo principal ser una herramienta TIC más sencilla de manipular para el usuario, ofreciendole mayor seguridad y cercanía a esta; accediendo a ella desde un dispositivo que puede guardar en su bolsillo, y eliminando así el requisito de espacio para recursos físicos como portátiles o computadora de escritorio.',
            comm_date: '18-10-2021 03:55 PM'
          },
          {
            id: '55ee7b56-2f43-45f5-9fc7-f16c654e6cc1',
            comm_user_id: '3d92fb5a-2ff9-4bd0-b42d-3c22e57a4cf1',
            comm_user_name: 'MILTON JESUS VERA CONTRERAS',
            comm_user_photo: 'c3bca429-78cc-4235-a323-6ad4db411fa5',
            comm_content: 'Es un proyecto muy interesante, con este pordrian llegar a implementar lector de codigo de barras, que este integrado con los dispositivos que se le colocan en las orejas a los porcinos ',
            comm_date: '27-10-2021 08:58 PM'
          }
        ],
        publ_interested_list: [
          '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
          'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
          '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          '2db5485c-02cf-4ef2-bd93-4668cd430499'
        ],
        user_interested: false,
        publ_amount_shared: 4,
        publ_amount_download: 0,
        publ_attachments: [
          {
            id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
            fileType: 'image/png',
            name: 'Sin título.png'
          }
        ],
        publ_full_text: false,
        publ_link_doi: '',
        publ_permission_view_full_text: [],
        publ_project_id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        publ_project: {
          id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
          title: 'Softpig',
          abstract: 'Plataforma para administrar ganado porcino',
          start_date: '04/2018',
          end_date: '06/2020',
          link: null
        },
        created_date: '28-10-2021 09:13 PM'
      }
    ];

    const expectedDataAdapted = publicationAdapter.adaptList(expectedData);

    service.listPublicationsByCommunity(commId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(publicationAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?comm_id=${commId}&ordering=-created_date`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be list publications with pagination', () => {

    const expectedData = [
      {
        id: '336d249e-1d75-4e09-9199-1e33e93ff370',
        user_id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        user_name: 'Yindy Paola Pájaro Urquijo',
        user_photo: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        comm_id: null,
        comm_name: '',
        cate_id: null,
        cate_name: '',
        publ_title: 'Aplicación movil para la administración de las granjas porcinas',
        publ_description: '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
        publ_standard: true,
        publ_authors: [{
          id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
          authorName: 'Yindy Paola Pájaro Urquijo',
          authorPhoto: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2'
        },
          {
            id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
            authorName: 'Fernando Romero',
            authorPhoto: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
          }
        ],
        publ_privacy: false,
        publ_date: '16-06-2020 05:00 AM',
        publ_comment: [],
        publ_interested_list: [],
        user_interested: false,
        publ_amount_shared: 4,
        publ_amount_download: 0,
        publ_attachments: [
          {
            id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
            fileType: 'image/png',
            name: 'Sin título.png'
          }
        ],
        publ_full_text: false,
        publ_link_doi: '',
        publ_permission_view_full_text: [],
        publ_project_id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        publ_project: {},
        created_date: '28-10-2021 09:13 PM'
      }
    ];

    const paginator = {
      count: 21,
      next: `${url}?limit=20&offset=20`,
      previous: null
    };

    const expectedDataAdapted = publicationAdapter.adaptList(expectedData);

    service.listPublicationsWithPagination(paginator).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(publicationAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(paginator.next);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be create publications', () => {

    const publication = new PublicationModel('90e18070-ce97-40b8-a2db-efdc89afa8fa',
      '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
      'Yindy Paola Pájaro Urquijo',
      null,
      '',
      null,
      '',
      'Aplicación movil para la administración de las granjas porcinas',
      '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
      true,
      [
        {
          id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
          authorName: 'Yindy Paola Pájaro Urquijo',
          authorPhoto: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2'
        },
        {
          id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          authorName: 'Fernando Romero',
          authorPhoto: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
        }],
      false,
      new Date(),
      [
        {
          id: '7ccfbb15-880d-4b01-896e-af7989ff3402',
          comm_user_id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          comm_user_name: 'Fernando Romero',
          comm_user_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc',
          comm_content: 'Esta versión móvil de la aplicación Softpig tiene como objetivo principal ser una herramienta TIC más sencilla de manipular para el usuario, ofreciendole mayor seguridad y cercanía a esta; accediendo a ella desde un dispositivo que puede guardar en su bolsillo, y eliminando así el requisito de espacio para recursos físicos como portátiles o computadora de escritorio.',
          comm_date: '18-10-2021 03:55 PM'
        },
        {
          id: '55ee7b56-2f43-45f5-9fc7-f16c654e6cc1',
          comm_user_id: '3d92fb5a-2ff9-4bd0-b42d-3c22e57a4cf1',
          comm_user_name: 'MILTON JESUS VERA CONTRERAS',
          comm_user_photo: 'c3bca429-78cc-4235-a323-6ad4db411fa5',
          comm_content: 'Es un proyecto muy interesante, con este pordrian llegar a implementar lector de codigo de barras, que este integrado con los dispositivos que se le colocan en las orejas a los porcinos ',
          comm_date: '27-10-2021 08:58 PM'
        }],
      4,
      [
        {
          id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
          instId: null,
          fileExtension: 'png',
          filePath: '',
          fileSize: '',
          fileType: 'image/png'
        }],
      ['8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        '4a74c6bf-59a2-4270-8bb3-96f194363a46',
        '2db5485c-02cf-4ef2-bd93-4668cd430499'],
      4,
      false,
      [],
      '',
      'dc847485-9121-43a2-a8a5-28c57cce6609',
      {
        id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        title: 'Softpig',
        abstract: 'Plataforma para administrar ganado porcino',
        startDate: new Date(),
        endDate: new Date(),
        link: null
      },
      new Date());

    const publicationCreate = publicationAdapter.adaptObjectSend(publication);

    service.savePublication(publication).then(response => {
      expect(typeof response).toBe('boolean');
      expect(publicationCreate).toEqual(publicationAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be send full request', () => {

    const publicationInfo = publicationAdapter.sendFullText('yindypaolapu@ufps.edu.co',
      '90e18070-ce97-40b8-a2db-efdc89afa8fa');

    service.sendFullRequest(publicationInfo).then(response => {
      expect(typeof response).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}send_full_text/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be share publication', () => {

    const shareOption = 'Chat';
    const publId = '90e18070-ce97-40b8-a2db-efdc89afa8fa';
    const usershare = new UserModel('4a74c6bf-59a2-4270-8bb3-96f194363a46',
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
    const usersharing = new FollowUserModel('18d0cccd-98c3-43fd-85c4-589cb2afeee4',
      '70c22228-8956-4378-8e7d-9de59cc14bfd',
      'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      false,
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'CRISEL JAZMIN AYALA LLANES',
      'SEMILLERO SILUX UFPS',
      'Universidad Francisco de Paula Santander',
      'Universidad Francisco de Paula Santander',
      'criseljazminal@ufps.edu.co',
      'silux@ufps.edu.co',
      {
        id: 'e2075aac-e37b-4aea-93ba-9fecaa7a2778',
        careerName: 'Ingeniería de Sistemas'
      },
      {
        id: 'e2075aac-e37b-4aea-93ba-9fecaa7a2778',
        careerName: 'Ingeniería de Sistemas'
      },
      '29c6785a-ae00-4ce0-b28c-b8defbd63051',
      null);

    const publicationSharing = publicationAdapter.sharePublication(shareOption, publId, usershare, usersharing);

    service.sharePublication(publicationSharing).then(response => {
      expect(typeof response).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}share/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be interest publication', () => {

    const expectedData = {
      id: '336d249e-1d75-4e09-9199-1e33e93ff370',
      userId: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      userName: 'Yindy Paola Pájaro Urquijo',
      userPhoto: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
      instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      commId: null,
      commName: '',
      cateId: null,
      cateName: '',
      publTitle: 'Aplicación movil para la administración de las granjas porcinas',
      publDescription: '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
      publStandard: true,
      publAuthors: [{
        id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        author_name: 'Yindy Paola Pájaro Urquijo',
        author_photo: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2'
      },
        {
          id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          author_name: 'Fernando Romero',
          author_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
        }
      ],
      publ_privacy: false,
      publ_date: '16-06-2020 05:00 AM',
      publ_comment: [],
      publ_interested_list: [],
      user_interested: false,
      publ_amount_shared: 4,
      publ_amount_download: 0,
      publ_attachments: [
        {
          id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
          fileType: 'image/png',
          name: 'Sin título.png'
        }
      ],
      publ_full_text: false,
      publ_link_doi: '',
      publ_permission_view_full_text: [],
      publ_project_id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
      publ_project: {},
      created_date: '28-10-2021 09:13 PM'
    };

    const infoPublication = publicationAdapter.interestPublication('336d249e-1d75-4e09-9199-1e33e93ff370');

    service.interestPublication(infoPublication).then(response => {
      expect(typeof response).toBe('boolean');
      expect(expectedData).toEqual(response);
    });

    const req = httpTestingController.expectOne(`${url}interest/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be publications related', () => {

    const publicationId = '336d249e-1d75-4e09-9199-1e33e93ff370';
    const projectId = 'dc847485-9121-43a2-a8a5-28c57cce6609';
    const showPrivates = true;

    const expectedData = [
      {
        id: '336d249e-1d75-4e09-9199-1e33e93ff370',
        user_id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        user_name: 'Yindy Paola Pájaro Urquijo',
        user_photo: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
        inst_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        comm_id: null,
        comm_name: '',
        cate_id: null,
        cate_name: '',
        publ_title: 'Aplicación movil para la administración de las granjas porcinas',
        publ_description: '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
        publ_standard: true,
        publ_authors: [{
          id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
          author_name: 'Yindy Paola Pájaro Urquijo',
          author_photo: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2'
        },
          {
            id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
            author_name: 'Fernando Romero',
            author_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
          }
        ],
        publ_privacy: false,
        publ_date: '16-06-2020 05:00 AM',
        publ_comment: [
          {
            id: '55ee7b56-2f43-45f5-9fc7-f16c654e6cc1',
            comm_user_id: '3d92fb5a-2ff9-4bd0-b42d-3c22e57a4cf1',
            comm_user_name: 'MILTON JESUS VERA CONTRERAS',
            comm_user_photo: 'c3bca429-78cc-4235-a323-6ad4db411fa5',
            comm_content: 'Es un proyecto muy interesante, con este pordrian llegar a implementar lector de codigo de barras, que este integrado con los dispositivos que se le colocan en las orejas a los porcinos ',
            comm_date: '27-10-2021 08:58 PM'
          }
        ],
        publ_interested_list: ['2db5485c-02cf-4ef2-bd93-4668cd430499'],
        user_interested: false,
        publ_amount_shared: 4,
        publ_amount_download: 0,
        publ_attachments: [
          {
            id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
            file_type: 'image/png',
            name: 'Sin título.png'
          }
        ],
        publ_full_text: false,
        publ_link_doi: '',
        publ_permission_view_full_text: [],
        publ_project_id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        publ_project: {
          id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
          title: 'Softpig',
          abstract: 'Plataforma para administrar ganado porcino',
          start_date: '04/2018',
          end_date: '06/2020',
          link: null
        },
        created_date: '28-10-2021 09:13 PM'
      }
    ];

    const expectedDataAdapted = publicationAdapter.adaptList(expectedData);

    service.getPublicationsRelated(publicationId, projectId, showPrivates).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(publicationAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}public_related/${publicationId}/${projectId}/${showPrivates}/`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be update publications', () => {

    const publication = new PublicationModel('90e18070-ce97-40b8-a2db-efdc89afa8fa',
      '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      null,
      'Yindy Paola Pájaro Urquijo',
      'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
      '',
      null,
      '',
      'Aplicación movil para la administración de las granjas porcinas',
      '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
      true,
      [
        {
          id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
          authorName: 'Yindy Paola Pájaro Urquijo',
          authorPhoto: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2'
        },
        {
          id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          authorName: 'Fernando Romero',
          authorPhoto: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
        }],
      false,
      new Date(),
      [
        {
          id: '7ccfbb15-880d-4b01-896e-af7989ff3402',
          comm_user_id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          comm_user_name: 'Fernando Romero',
          comm_user_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc',
          comm_content: 'Esta versión móvil de la aplicación Softpig tiene como objetivo principal ser una herramienta TIC más sencilla de manipular para el usuario, ofreciendole mayor seguridad y cercanía a esta; accediendo a ella desde un dispositivo que puede guardar en su bolsillo, y eliminando así el requisito de espacio para recursos físicos como portátiles o computadora de escritorio.',
          comm_date: '18-10-2021 03:55 PM'
        },
        {
          id: '55ee7b56-2f43-45f5-9fc7-f16c654e6cc1',
          comm_user_id: '3d92fb5a-2ff9-4bd0-b42d-3c22e57a4cf1',
          comm_user_name: 'MILTON JESUS VERA CONTRERAS',
          comm_user_photo: 'c3bca429-78cc-4235-a323-6ad4db411fa5',
          comm_content: 'Es un proyecto muy interesante, con este pordrian llegar a implementar lector de codigo de barras, que este integrado con los dispositivos que se le colocan en las orejas a los porcinos ',
          comm_date: '27-10-2021 08:58 PM'
        }],
      4,
      [
        {
          id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
          instId: null,
          fileExtension: 'png',
          filePath: '',
          fileSize: '',
          fileType: 'image/png'
        }],
      ['8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        '4a74c6bf-59a2-4270-8bb3-96f194363a46',
        '2db5485c-02cf-4ef2-bd93-4668cd430499'],
      4,
      false,
      [],
      '',
      'dc847485-9121-43a2-a8a5-28c57cce6609',
      {
        id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        title: 'Softpig',
        abstract: 'Plataforma para administrar ganado porcino',
        startDate: new Date(),
        endDate: new Date(),
        link: null
      },
      new Date());

    const publicationUpdate = publicationAdapter.adaptObjectSend(publication);

    service.updatePublication(publication).then(response => {
      expect(typeof response).toBe('boolean');
      expect(publicationUpdate).toEqual(publicationAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${publication.id}/`);
    expect(req.request.method).toBe('PUT');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be partial update publication', () => {

    const publication = new PublicationModel('90e18070-ce97-40b8-a2db-efdc89afa8fa',
      '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
      'Yindy Paola Pájaro Urquijo',
      null,
      '',
      null,
      '',
      'Aplicación movil para la administración de las granjas porcinas',
      '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
      false,
      [
        {
          id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          authorName: 'Fernando Romero',
          authorPhoto: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
        }],
      true,
      new Date(),
      [
        {
          id: '7ccfbb15-880d-4b01-896e-af7989ff3402',
          comm_user_id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          comm_user_name: 'Fernando Romero',
          comm_user_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc',
          comm_content: 'Esta versión móvil de la aplicación Softpig tiene como objetivo principal ser una herramienta TIC más sencilla de manipular para el usuario, ofreciendole mayor seguridad y cercanía a esta; accediendo a ella desde un dispositivo que puede guardar en su bolsillo, y eliminando así el requisito de espacio para recursos físicos como portátiles o computadora de escritorio.',
          comm_date: '18-10-2021 03:55 PM'
        },
        {
          id: '55ee7b56-2f43-45f5-9fc7-f16c654e6cc1',
          comm_user_id: '3d92fb5a-2ff9-4bd0-b42d-3c22e57a4cf1',
          comm_user_name: 'MILTON JESUS VERA CONTRERAS',
          comm_user_photo: 'c3bca429-78cc-4235-a323-6ad4db411fa5',
          comm_content: 'Es un proyecto muy interesante, con este pordrian llegar a implementar lector de codigo de barras, que este integrado con los dispositivos que se le colocan en las orejas a los porcinos ',
          comm_date: '27-10-2021 08:58 PM'
        }],
      4,
      [],
      ['8d9f8558-a7e0-4b15-a47c-874f33c6e2a9'],
      4,
      false,
      [],
      '',
      'dc847485-9121-43a2-a8a5-28c57cce6609',
      {
        id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        title: 'Softpig',
        abstract: 'Plataforma para administrar ganado porcino',
        startDate: new Date(),
        endDate: new Date(),
        link: null
      },
      new Date());

    const publicationUpdate = publicationAdapter.adaptObjectSend(publication);

    service.partialUpdatePublication(publication).then(response => {
      expect(typeof response).toBe('boolean');
      expect(publicationUpdate).toEqual(publicationAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${publication.id}/`);
    expect(req.request.method).toBe('PATCH');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be patch publication add or edit comment', () => {

    const comment = {
      id: '55ee7b56-2f43-45f5-9fc7-f16c654e6cc1',
      comm_user_id: '3d92fb5a-2ff9-4bd0-b42d-3c22e57a4cf1',
      comm_user_name: 'MILTON JESUS VERA CONTRERAS',
      comm_user_photo: 'c3bca429-78cc-4235-a323-6ad4db411fa5',
      comm_content: 'Es un proyecto muy interesante, con este pordrian llegar a implementar lector de codigo de barras, que este integrado con los dispositivos que se le colocan en las orejas a los porcinos ',
      comm_date: '27-10-2021 08:58 PM'
    };

    const publication = new PublicationModel('90e18070-ce97-40b8-a2db-efdc89afa8fa',
      '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
      'Yindy Paola Pájaro Urquijo',
      null,
      '',
      null,
      '',
      'Aplicación movil para la administración de las granjas porcinas',
      '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
      true,
      [
        {
          id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
          authorName: 'Yindy Paola Pájaro Urquijo',
          authorPhoto: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2'
        },
        {
          id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          authorName: 'Fernando Romero',
          authorPhoto: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
        }],
      false,
      new Date(),
      [
        {
          id: '7ccfbb15-880d-4b01-896e-af7989ff3402',
          comm_user_id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          comm_user_name: 'Fernando Romero',
          comm_user_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc',
          comm_content: 'Esta versión móvil de la aplicación Softpig tiene como objetivo principal ser una herramienta TIC más sencilla de manipular para el usuario, ofreciendole mayor seguridad y cercanía a esta; accediendo a ella desde un dispositivo que puede guardar en su bolsillo, y eliminando así el requisito de espacio para recursos físicos como portátiles o computadora de escritorio.',
          comm_date: '18-10-2021 03:55 PM'
        }],
      4,
      [
        {
          id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
          instId: null,
          fileExtension: 'png',
          filePath: '',
          fileSize: '',
          fileType: 'image/png'
        }],
      ['8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        '4a74c6bf-59a2-4270-8bb3-96f194363a46',
        '2db5485c-02cf-4ef2-bd93-4668cd430499'],
      4,
      false,
      [],
      '',
      'dc847485-9121-43a2-a8a5-28c57cce6609',
      {
        id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        title: 'Softpig',
        abstract: 'Plataforma para administrar ganado porcino',
        startDate: new Date(),
        endDate: new Date(),
        link: null
      },
      new Date());

    const commentAdapter = publicationAdapter.addOrEditCommentAdapter(comment);

    service.patchPublication(commentAdapter, publication.id).then(response => {
      expect(typeof response).toBe('boolean');
      expect(publication).toEqual(publicationAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${publication.id}/`);
    expect(req.request.method).toBe('PATCH');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be patch publication increase publication amount download', () => {

    const publication = new PublicationModel('90e18070-ce97-40b8-a2db-efdc89afa8fa',
      '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
      'Yindy Paola Pájaro Urquijo',
      null,
      '',
      null,
      '',
      'Aplicación movil para la administración de las granjas porcinas',
      '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
      true,
      [
        {
          id: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
          authorName: 'Yindy Paola Pájaro Urquijo',
          authorPhoto: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2'
        },
        {
          id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          authorName: 'Fernando Romero',
          authorPhoto: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc'
        }],
      false,
      new Date(),
      [
        {
          id: '7ccfbb15-880d-4b01-896e-af7989ff3402',
          comm_user_id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
          comm_user_name: 'Fernando Romero',
          comm_user_photo: 'f563e8af-0ed4-4650-b107-58cbf5b8a2dc',
          comm_content: 'Esta versión móvil de la aplicación Softpig tiene como objetivo principal ser una herramienta TIC más sencilla de manipular para el usuario, ofreciendole mayor seguridad y cercanía a esta; accediendo a ella desde un dispositivo que puede guardar en su bolsillo, y eliminando así el requisito de espacio para recursos físicos como portátiles o computadora de escritorio.',
          comm_date: '18-10-2021 03:55 PM'
        }],
      4,
      [
        {
          id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
          instId: null,
          fileExtension: 'png',
          filePath: '',
          fileSize: '',
          fileType: 'image/png'
        }],
      ['8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        '4a74c6bf-59a2-4270-8bb3-96f194363a46',
        '2db5485c-02cf-4ef2-bd93-4668cd430499'],
      4,
      false,
      [],
      '',
      'dc847485-9121-43a2-a8a5-28c57cce6609',
      {
        id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        title: 'Softpig',
        abstract: 'Plataforma para administrar ganado porcino',
        startDate: new Date(),
        endDate: new Date(),
        link: null
      },
      new Date());

    const increaseDownloadAdapter = publicationAdapter.increasePublicationAmountDownload(4);

    service.patchPublication(increaseDownloadAdapter, publication.id).then(response => {
      expect(typeof response).toBe('boolean');
      expect(publication).toEqual(publicationAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${publication.id}/`);
    expect(req.request.method).toBe('PATCH');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be delete publication', () => {

    service.deletePublication('7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1').then(respuesta => {
      expect(typeof respuesta).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1/`);
    expect(req.request.method).toBe('DELETE');
    req.event(new HttpResponse<boolean>({body: true}));

  });

});
