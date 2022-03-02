import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ViewConversationComponent} from './view-conversation.component';
import {DatePipe} from '@angular/common';
import {ConversationService} from '../../../services/chat/conversation.service';
import {WebsocketService} from '../../../services/websocket_service/websocket-service';
import {MessageServices} from '../../../services/chat/message-services.service';
import {MessagerService} from '../../../messenger/messager.service';
import {MessageService} from 'primeng/api';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('ViewConversationComponent', () => {
  let component: ViewConversationComponent;
  let fixture: ComponentFixture<ViewConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ViewConversationComponent],
      providers: [MessagerService,
        MessageService,
        ConversationService,
        MessageServices,
        WebsocketService,
        UtilitiesConfigString,
        DatePipe
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clean chat', () => {
    component.cleanChat();
    expect(( component as any).thereConversationShow).toEqual( true);
    expect(( component as any).classMenuEmoji).toEqual('cursor bi bi-emoji-smile');
    expect(( component as any).showEmojiPicker).toEqual(false);
  });

  it('should show emoji modal picker', () => {
    component.showEmojiModalPicker();
    expect(( component as any).showEmojiPicker).toEqual( true);
    expect(( component as any).classMenuEmoji).toEqual('cursor bi bi-emoji-smile-fill color-icon-fill');
  });

  it('should do not show emoji modal picker', () => {
    component.showEmojiPicker = true;
    component.showEmojiModalPicker();
    expect(( component as any).showEmojiPicker).toEqual( false);
    expect(( component as any).classMenuEmoji).toEqual('cursor bi bi-emoji-smile');
  });

});
