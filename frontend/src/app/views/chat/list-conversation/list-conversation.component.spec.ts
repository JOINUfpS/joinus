import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ListConversationComponent} from './list-conversation.component';
import {UsersService} from '../../../services/user/user.service';
import {ConversationService} from '../../../services/chat/conversation.service';
import {ConversationAdapter} from '../../../adapters/implementation/chat/conversation.adapter';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {HttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {ProjectAdapter} from '../../../adapters/implementation/user/project.adapter';
import {ConstString} from '../../../utilities/string/const-string';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {UserModel} from '../../../models/user/user.model';
import {ConversationModel} from '../../../models/chat/conversation.model';


describe('ListConversationComponent', () => {
  let component: ListConversationComponent;
  let fixture: ComponentFixture<ListConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ListConversationComponent],
      providers: [UsersService,
        HttpClient,
        ProjectAdapter,
        DatePipe,
        ConstString,
        ConversationService,
        ConversationAdapter,
        UtilitiesConfigString]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show conversation', () => {
    component.ngOnInit();
    component.show();
    expect((component as any).createConversationDialogDisplay).toEqual(true);
  });

  it('should create conversation', () => {
    component.selectedUser = undefined;
    component.createConversation();
    expect((component as any).isButtonInAction).toEqual(false);
    expect((component as any).createConversationDialogDisplay).toEqual(false);
  });

  it('should create conversation with selected user', () => {
    component.selectedUser = new UserModel('4a74c6bf-59a2-4270-8bb3-96f194363a46',
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

    component.userSession = new UserModel('4a74c6bf-59a2-4270-8bb3-96f194363a46',
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
    component.createConversation();
    expect((component as any).isButtonInAction).toEqual(false);
  });

  it('should search conversation', () => {
    component.conversationToSearch = 'Eduardo Pájaro';
    component.conversationsUserSession = [new ConversationModel(
      '4fa85f64-6727-4562-b3fc-2c963f77afa6',
      '4fa85f64-5717-4562-d3fc-2c963f66bfa6',
      true,
      null,
      null,
      'Fernando Romero',
      'Paola Pájaro'),
      new ConversationModel('7fa96f64-5717-4562-b3fc-2c963f66afa6',
        '4a74c6bf-59a2-4270-8bb3-96f194363a46',
        '4fa85f64-5717-4562-d3fc-2c963f66bfa6',
        '047360c3-8991-4cb2-b756-06320be46a8e',
        '047360c3-8991-4cb2-b756-06320be46a8e',
        'Fernando Romero',
        'Fernando Romero')];
    component.listOriginalConversationsUserSession = [new ConversationModel(
      '4fa85f64-6727-4562-b3fc-2c963f77afa6',
      '4fa85f64-5717-4562-d3fc-2c963f66bfa6',
      true,
      null,
      null,
      'Fernando Romero',
      'Paola Pájaro')];
    component.searchConversation();
    expect((component as any).conversationsUserSession).toEqual([]);
  });

});
