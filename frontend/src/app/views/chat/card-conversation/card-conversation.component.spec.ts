import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CardConversationComponent} from './card-conversation.component';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {ConversationAdapter} from '../../../adapters/implementation/chat/conversation.adapter';
import {ConversationService} from '../../../services/chat/conversation.service';
import {MessagerService} from '../../../messenger/messager.service';
import {MessageService} from 'primeng/api';
import {HttpClientTestingModule} from '@angular/common/http/testing';


xdescribe('CardConversationComponent', () => {
  let component: CardConversationComponent;
  let fixture: ComponentFixture<CardConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CardConversationComponent],
      providers: [UtilitiesConfigString,
        ConversationAdapter,
        ConversationService,
        MessagerService,
        MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
