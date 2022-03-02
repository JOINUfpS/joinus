import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {NotificationService} from './notification.service';
import {NotificationModel} from '../../models/notification/notification.model';
import {NotificationAdapter} from '../../adapters/implementation/notification/notification.adapter';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {UserModel} from '../../models/user/user.model';
import {CommunityModel} from '../../models/user/community.model';


describe('NotificationService', () => {
  let service: NotificationService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let notificationAdapter: NotificationAdapter;
  let utilities: UtilitiesConfigString;
  const url = `${environment.notificationUrl}notification/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService, UtilitiesConfigString, HttpClient]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(NotificationService);
    utilities = TestBed.inject(UtilitiesConfigString);
    notificationAdapter = TestBed.inject(NotificationAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be get notification per user', () => {
    const notiReceiverId = 'cf5e1370-c389-4cbf-a42c-8977354e8fe3';

    const expectedData = [
      {
        id: '55f55534-0b14-40bb-a8a0-cd0dc169fffc',
        noti_is_read: false,
        noti_date: '07-11-2021 11:36 AM',
        noti_receiver_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        noti_path: 'perfil',
        noti_type: 'user',
        noti_author_id: '70c22228-8956-4378-8e7d-9de59cc14bfd',
        noti_author_name: 'Crisel Jazmin Ayala Llanes',
        noti_author_photo: '29c6785a-ae00-4ce0-b28c-b8defbd63051',
        noti_author_email: '',
        noti_issue: 'El usuario <b>Crisel Jazmin Ayala Llanes</b> comenzó a seguirte.',
        noti_destination_name: ''
      }
    ];

    const expectedDataAdapted = notificationAdapter.adaptList(expectedData);

    service.getNotificationsPerUser(notiReceiverId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(notificationAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?noti_receiver_id=${notiReceiverId}&ordering=-noti_date`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be get notification for user author type', () => {
    const user = 'cf5e1370-c389-4cbf-a42c-8977354e8fe3';
    const author = 'Crisel Jazmin Ayala Llanes';
    const type = 'user';

    const expectedData = [
      {
        id: '55f55534-0b14-40bb-a8a0-cd0dc169fffc',
        noti_is_read: false,
        noti_date: '07-11-2021 11:36 AM',
        noti_receiver_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
        noti_path: 'perfil',
        noti_type: 'user',
        noti_author_id: '70c22228-8956-4378-8e7d-9de59cc14bfd',
        noti_author_name: 'Crisel Jazmin Ayala Llanes',
        noti_author_photo: '29c6785a-ae00-4ce0-b28c-b8defbd63051',
        noti_author_email: '',
        noti_issue: 'El usuario <b>Crisel Jazmin Ayala Llanes</b> comenzó a seguirte.',
        noti_destination_name: ''
      }
    ];

    const expectedDataAdapted = notificationAdapter.adaptList(expectedData);

    service.getNotificationForUserAuthorType(user, author, type).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(notificationAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?noti_receiver_id=${user}&noti_author_id=${author}&noti_type=${type}`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be list notification with pagination', () => {

    const expectedData = [
      {
        id: 'b099f619-3334-4f9a-81d9-ceb11f923f19',
        noti_is_read: true,
        noti_date: '08-10-2021 11:36 AM',
        noti_receiver_id: '2349b70f-4e16-4dd1-b42d-bb9d3d211fc1',
        noti_path: 'perfil',
        noti_type: 'user',
        noti_author_id: 'edbd9417-555b-49a5-b725-f519bca1264d',
        noti_author_name: 'Crisel Jazmin Ayala Llanes',
        noti_author_photo: '3112ff1a-bffc-42d7-a3a4-ec14674585d3',
        noti_author_email: '',
        noti_issue: 'El usuario <b>Crisel Jazmin Ayala Llanes</b> comenzó a seguirte.',
        noti_destination_name: ''
      }
    ];

    const paginator = {
      count: 21,
      next: `${url}?limit=20&offset=20`,
      previous: null
    };

    const expectedDataAdapted = notificationAdapter.adaptList(expectedData);

    service.listNotificationsPerUserWithPagination(paginator).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(notificationAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(paginator.next);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be create notification to invite community', () => {

    const notification = new NotificationModel('55f55534-0b14-40bb-a8a0-cd0dc169fffc',
      false,
      new Date(),
      'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      'Comunidad',
      'comunidad',
      '70c22228-8956-4378-8e7d-9de59cc14bfd',
      'Juan Fernando Romero Ortega',
      '29c6785a-ae00-4ce0-b28c-b8defbd63051',
      '',
      'El usuario <b>Juan Fernando Romero Ortega</b> ha publicado en la comunidad Joinus.',
      '');

    const userSession = new UserModel('4a74c6bf-59a2-4270-8bb3-96f194363a46',
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

    const usersToInvite = {
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
    };

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

    notificationAdapter.adaptNotificationToInviteACommunity(userSession, usersToInvite, community);

    service.createNotificationToInviteCommunity(notification).then(response => {
      expect(typeof response).toBe('boolean');
      expect(notification).toEqual(notificationAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}notify_community_invitation/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be partial update notification', () => {
    const notification = new NotificationModel('55f55534-0b14-40bb-a8a0-cd0dc169fffc',
      false,
      new Date(),
      'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      'comunidad',
      'user',
      '70c22228-8956-4378-8e7d-9de59cc14bfd',
      'Juan Fernando Romero Ortega',
      '29c6785a-ae00-4ce0-b28c-b8defbd63051',
      '',
      'El usuario <b>Juan Fernando Romero Ortega</b> comenzó a seguirte.',
      '');

    const notificationUpdate = notificationAdapter.adaptObjectSend(notification);

    service.patchNotification(notification.id, notification).then(response => {
      expect(typeof response).toBe('boolean');
      expect(notificationUpdate).toEqual(notificationAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${notification.id}/`);
    expect(req.request.method).toBe('PATCH');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be delete notification', () => {

    service.deleteNotification('7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1').then(respuesta => {
      expect(typeof respuesta).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1/`);
    expect(req.request.method).toBe('DELETE');
    req.event(new HttpResponse<boolean>({body: true}));

  });

  it('Should be delete notification community', () => {
    const search = {
      noti_receiver_id: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      noti_author_id: '70c22228-8956-4378-8e7d-9de59cc14bf',
    };

    service.deleteNotificationCommunity(search).then(respuesta => {
      expect(typeof respuesta).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}delete_invitation_community/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));

  });

  it('Should be save notification', () => {
    const notification = new NotificationModel('55f55534-0b14-40bb-a8a0-cd0dc169fffc',
      false,
      new Date(),
      'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      'Comunidad',
      'comunidad',
      '70c22228-8956-4378-8e7d-9de59cc14bfd',
      'Juan Fernando Romero Ortega',
      '29c6785a-ae00-4ce0-b28c-b8defbd63051',
      '',
      'El usuario <b>Juan Fernando Romero Ortega</b> ha publicado en la comunidad Joinus.',
      '');

    const notificationSave = notificationAdapter.adaptObjectSend(notification);

    service.saveNotification(notification).then(response => {
      expect(typeof response).toBe('boolean');
      expect(notificationSave).toEqual(notificationAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be notify new publication community', () => {

    const communityUser = [{
      id: '6eec0eb3-1a95-421f-93c1-cb7a885bcea8',
      userName: 'Sebastian Garcia',
      userDegree: {},
      userPhoto: 'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      isMember: true
    }];

    const notification = notificationAdapter.adaptCommunityPostNotification(
      '70c22228-8956-4378-8e7d-9de59cc14bfd', communityUser, '04c7fdcd-6923-4a9c-9fe6-5ca21c9b5697',
      'Fernando Urquijo', '29c6785a-ae00-4ce0-b28c-b8defbd63051', '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1',
      'SEMILLERO SILUX UFPS');

    service.notifyNewPublicationCommunity(notification).then(response => {
      expect(typeof response).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}notify_new_publication_community/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

});
