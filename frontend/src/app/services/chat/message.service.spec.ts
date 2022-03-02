import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {MessageServices} from './message-services.service';
import {MessageAdapter} from '../../adapters/implementation/chat/message.adapter';


describe('MessageService', () => {
  let service: MessageServices;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let messageAdapter: MessageAdapter;
  const url = `${environment.urlChat}message/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessageServices, HttpClient]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MessageServices);
    messageAdapter = TestBed.inject(MessageAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be get message by conversation', () => {
    const convId = '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1';

    const expectedData = [
      {
        conv_id: convId,
        mess_author: '5ca13e7c-5d2d-4ba4-a654-f98ac4d292a7',
        mess_date: '2021-11-27T20:48:54.730Z',
        mess_content: 'Bien, ¿y tu?'
      },
      {
        conv_id: convId,
        mess_author: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        mess_date: '2021-11-27T20:48:54.730Z',
        mess_content: 'Hola, ¿como estas?'
      }
    ];

    const expectedDataAdapted = messageAdapter.adaptList(expectedData);

    service.getMessageByConversation(convId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(messageAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?conv_id=${convId}&ordering=-mess_date`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be get message by conversation with pagination', () => {

    const expectedData = [
      {
        conv_id: '5fa85f64-6727-4562-b3fc-2c963f77afa7',
        mess_author: '5ca13e7c-5d2d-4ba4-a654-f98ac4d292a7',
        mess_date: '2021-11-27T20:48:54.730Z',
        mess_content: 'Bien, ¿y tu?'
      },
      {
        conv_id: '5fa85f64-6727-4562-b3fc-2c963f77afa7',
        mess_author: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        mess_date: '2021-11-27T20:48:54.730Z',
        mess_content: 'Hola, ¿como estas?'
      }
    ];

    const paginator = {
      count: 21,
      next: `${url}?limit=20&offset=20`,
      previous: null
    };

    const expectedDataAdapted = messageAdapter.adaptList(expectedData);

    service.getMessageByConversationWithPaginator(paginator).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(messageAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(paginator.next);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

});
