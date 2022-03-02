import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ConversationService} from './conversation.service';
import {ConversationModel} from '../../models/chat/conversation.model';
import {ConversationAdapter} from '../../adapters/implementation/chat/conversation.adapter';
import {UserModel} from '../../models/user/user.model';
import {MessageAdapter} from '../../adapters/implementation/chat/message.adapter';


describe('ConversationService', () => {
  let service: ConversationService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let conversationAdapter: ConversationAdapter;
  let messageAdapter: MessageAdapter;
  const url = `${environment.urlChat}conversation/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConversationService, HttpClient]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ConversationService);
    conversationAdapter = TestBed.inject(ConversationAdapter);
    messageAdapter = TestBed.inject(MessageAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be list all conversation match user', () => {
    const userEmail = 'yindypaolapu@ufps.edu.co';

    const expectedData = [
      {
        conv_user_emisor_id: '4fa85f64-6727-4562-b3fc-2c963f77afa6',
        conv_user_receiver_id: '4fa85f64-5717-4562-d3fc-2c963f66bfa6',
        conv_is_bidirectional: true,
        conv_user_emisor_photo_id: null,
        conv_user_receiver_photo_id: null,
        conv_user_emisor_name: 'Fernando Romero',
        conv_user_receiver_name: 'Paola Pájaro',
        conv_user_emisor_email: 'yindypaolapu@ufps.edu.co',
        conv_user_receiver_email: 'juanfernandoro@ufps.edu.co'
      }
    ];

    const expectedDataAdapted = conversationAdapter.adaptList(expectedData);

    const urlServicios = `${url}?search=${userEmail}`;

    service.getAllConversationsMatchUser(userEmail).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(conversationAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(urlServicios);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be list all conversation match user with pagination', () => {

    const expectedData = [
      {
        conv_user_emisor_id: '5fa85f64-6727-4562-b3fc-2c963f77afa7',
        conv_user_receiver_id: '4fa85f64-5717-4562-d3fc-2c963f66bfa6',
        conv_is_bidirectional: true,
        conv_user_emisor_photo_id: null,
        conv_user_receiver_photo_id: null,
        conv_user_emisor_name: 'Fernando Romero',
        conv_user_receiver_name: 'Paola Pájaro',
        conv_user_emisor_email: 'yindypaolapu@ufps.edu.co',
        conv_user_receiver_email: 'juanfernandoro@ufps.edu.co'
      }
    ];

    const expectedDataAdapted = conversationAdapter.adaptList(expectedData);

    const paginator = {
      count: 21,
      next: `${url}?limit=20&offset=20`,
      previous: null
    };

    service.getAllConversationsMatchUserWithPagination(paginator).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(conversationAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(paginator.next);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be create conversation', () => {

    const conversation = new ConversationModel('7fa96f64-5717-4562-b3fc-2c963f66afa6',
      '4a74c6bf-59a2-4270-8bb3-96f194363a46',
      '4fa85f64-5717-4562-d3fc-2c963f66bfa6',
      '047360c3-8991-4cb2-b756-06320be46a8e',
      '047360c3-8991-4cb2-b756-06320be46a8e',
      'Fernando Romero',
      'Fernando Romero');

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

    const userToTalk = new UserModel('4a74c6bf-59a2-4270-8bb3-96f194363a46',
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

    const conversationCreate = conversationAdapter.adaptObjectSendNewConversation(userSession, userToTalk);

    service.createConversation(conversationCreate).then(response => {
      expect(typeof response).toBe('boolean');
      expect(conversation).toEqual(conversationAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be send message', () => {

    const conversation = new ConversationModel('4fa86f64-5717-4562-b3fc-2c963f66afa6',
      '6fa85f67-5717-4562-b3fc-2c963f66afa6',
      '7fa96f64-5717-4562-b3fc-2c963f66afa6',
      '2f23ee29-0368-4598-a4dd-b5a7dbf8ecd2',
      '21e91c5b-03d7-426e-837d-baf45833ec5f',
      'Maria Rodriguez',
      'Paola Pájaro');

    const message = {
      conv_id: '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1',
      mess_author: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      mess_date: '2021-11-27T20:48:54.730Z',
      mess_content: 'Hola, ¿como estas?'
    };

    const adaptedMessage = messageAdapter.adaptMessageSend(conversation, message.mess_author, message.mess_content);

    service.sendMessage(message).then(response => {
      expect(typeof response).toBe('boolean');
      expect(adaptedMessage).toEqual(messageAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}send_message/`);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be delete conversation', () => {
    const userSession = '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1';
    const convId = '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1';

    service.deleteConversation(userSession, convId).then(respuesta => {
      expect(typeof respuesta).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}delete_conversation/${userSession}/${convId}/`);
    expect(req.request.method).toBe('DELETE');
    req.event(new HttpResponse<boolean>({body: true}));

  });

});
