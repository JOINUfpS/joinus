import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {PublicationUserService} from './publication-user.service';
import {PublicationUserAdapter} from '../../adapters/implementation/publication/publication-user.adapter';
import {PublicationModel} from '../../models/publication/publication.model';


describe('PublicationUserService', () => {
  let service: PublicationUserService;
  let httpTestingController: HttpTestingController;
  let publicationUserAdapter: PublicationUserAdapter;
  const url = `${environment.publicationUrl}publication_user/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PublicationUserService, UtilitiesConfigString, HttpClient]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PublicationUserService);
    publicationUserAdapter = TestBed.inject(PublicationUserAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be list publications user', () => {
    const userId = '4a74c6bf-59a2-4270-8bb3-96f194363a46';
    const expectedData = [
      {
        id: '197c3a6e-5cbc-4d93-b3a2-1d869cb479e5',
        publ_id: '336d249e-1d75-4e09-9199-1e33e93ff370',
        user_id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
        puus_interest: false,
        puus_shared: true,
        puus_saved: true,
        publ_userId: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
        publ_user_name: 'Yindy Paola Pájaro Urquijo',
        publ_user_photo: 'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
        cate_name: '',
        comm_id: null,
        comm_name: '',
        publ_title: 'Aplicación movil para la administración de las granjas porcinas',
        publ_description: '<p>Softpig ofrece múltiples beneficios para el negocio u organización del cliente. Algunos de estos son: Permitir a los granjeros porcicultores administrar su ganado porcino de una forma sencilla y eficiente, optimizando el manejo de los datos. Tener al alcance de su mano y en cualquier momento información de su granja a través de una serie de estadísticas que revelen el rendimiento de la misma; y así prevenir situaciones irregulares. Gestionar técnicamente su negocio y así un control más preciso del área reproductiva por medio de análisis y estudios a los puntos críticos&nbsp; que ayuden a la toma de medidas correctivas y establecimiento de objetivos de producción.</p>',
        publ_authors: [
          {
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
        publ_privacy: false,
        publ_amount_interest: 4,
        publ_amount_shared: 4,
        publ_attachments: [
          {
            id: 'fd7123fa-64f4-481e-b918-76dbf38e592e',
            file_type: 'image/png',
            name: 'Sin título.png'
          }
        ],
        publ_link_doi: '',
        publ_project_id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        publ_project: {
          id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
          title: 'Softpig',
          abstract: 'Plataforma para administrar ganado porcino',
          start_date: '04/2018',
          end_date: '06/2020',
          link: ''
        },
        created_date: '28-10-2021 09:13 PM'
      }
    ];

    const expectedDataAdapted = publicationUserAdapter.adaptList(expectedData);

    service.listPublicationUser(userId).then(response => {
      expect(expectedDataAdapted).toEqual(publicationUserAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?user_id=${userId}&ordering=-created_date`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be create publication user', () => {

    const publicationUser = new PublicationModel('90e18070-ce97-40b8-a2db-efdc89afa8fa',
      '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'a5dded9b-d94b-49e9-8ad3-55bb2280cbe2',
      'Juan Fernando Joaquin Romero',
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

    const publicationCreate = publicationUserAdapter.adaptObjectSend(publicationUser);

    service.savePublicationUser(publicationUser).then(response => {
      expect(typeof response).toBe('boolean');
      expect(publicationCreate).toEqual(publicationUserAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be update publication user', () => {

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
      true,
      [],
      '',
      'dc847485-9121-43a2-a8a5-28c57cce6609',
      {
        id: 'dc847485-9121-43a2-a8a5-28c57cce6609',
        title: 'Softpig',
        abstract: 'Plataforma para administrar ganado porcino',
        startDate: new Date(),
        endDate: new Date(),
        link: ''
      },
      new Date());

    const publicationUpdate = publicationUserAdapter.adaptObjectSend(publication);

    service.updatePublicationUser(publication).then(response => {
      expect(typeof response).toBe('boolean');
      expect(publicationUpdate).toEqual(publicationUserAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${publication.id}/`);
    expect(req.request.method).toBe('PUT');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be delete publication user', () => {

    service.deletePublicationUser('7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1').then(respuesta => {
      expect(typeof respuesta).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1/`);
    expect(req.request.method).toBe('DELETE');
    req.event(new HttpResponse<boolean>({body: true}));

  });

});
