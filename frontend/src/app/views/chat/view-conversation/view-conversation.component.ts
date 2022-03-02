import {Component, ElementRef, EventEmitter, Input, ViewChild} from '@angular/core';
import {MessageModel} from '../../../models/chat/message.model';
import {UserModel} from '../../../models/user/user.model';
import {ConversationModel} from '../../../models/chat/conversation.model';
import {MessageServices} from '../../../services/chat/message-services.service';
import {MessageAdapter} from '../../../adapters/implementation/chat/message.adapter';
import {v4 as uuid} from 'uuid';
import {NgForm} from '@angular/forms';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {WebsocketService} from '../../../services/websocket_service/websocket-service';
import {CallerChatService} from '../../../services/chat/chat_websocket/caller-chat.service';
import {ConversationService} from '../../../services/chat/conversation.service';
import {MessagerService} from '../../../messenger/messager.service';
import {DatePipe} from '@angular/common';
import {EnumLevelMessage} from '../../../messenger/enum-level-message.enum';
import {EmojiEvent} from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-view-conversation',
  templateUrl: './view-conversation.component.html',
  styleUrls: ['./view-conversation.component.css'],
  providers: [WebsocketService]
})
export class ViewConversationComponent {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @Input() userSession: UserModel;
  @ViewChild('ulMessageList') ulMessageList: ElementRef<HTMLUListElement>;
  @ViewChild('chatForm') myForm: NgForm;
  private callerChat: CallerChatService;
  @Input() conversation: ConversationModel;
  @Input() messages: MessageModel[];
  @Input() communicatorWithFather = new EventEmitter<ConversationModel>();
  @ViewChild('messageInput') messageInput: ElementRef;
  chatSocket: WebSocket;
  message = '';
  thereConversationShow = false;
  userToShow: any;
  paginator: any;
  showSpinner = false;
  classMenuEmoji = 'cursor bi bi-emoji-smile';
  showEmojiPicker = false;

  constructor(
    private messagerService: MessagerService,
    private messageService: MessageServices,
    private messageAdapter: MessageAdapter,
    private conversationService: ConversationService,
    private websocketService: WebsocketService,
    public utilitiesConfigString: UtilitiesConfigString,
    private datePipe: DatePipe) {
  }

  sendMsg(): void {
    if (this.message?.trim().length > 0) {
      const bodyMessageAdapted = this.messageAdapter.adaptMessageSend(this.conversation, this.userSession.id, this.message);
      this.showSentMessage(this.message, new Date(), true);
      this.message = '';
      this.conversationService.sendMessage(bodyMessageAdapted).then();
    }
  }

  public uploadMessagesInChat(conversationToShow: ConversationModel): void {
    this.thereConversationShow = true;
    this.cleanChat();
    this.conversation = conversationToShow;
    if (this.conversation.convUserEmisorId === this.userSession.id) {
      this.userToShow = {
        photo: this.conversation.convUserReceiverPhotoId,
        name: this.conversation.convUserReceiverName
      };
    } else {
      this.userToShow = {
        photo: this.conversation.convUserEmisorPhotoId,
        name: this.conversation.convUserEmisorName
      };
    }
    this.listenNewMessage();
    this.getMessagesFromTheConversation(this.conversation);
  }

  public cleanChat(): void {
    this.classMenuEmoji = 'cursor bi bi-emoji-smile';
    this.showEmojiPicker = false;
    const divContainer = document.getElementById('container-messages');
    if (divContainer !== null) {
      divContainer.className = 'chat-messages-show-container';
      const ul = document.getElementById('message-list');
      while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }
    }
  }

  onScrollUp(): void {
    this.showSpinner = true;
    if (this.paginator.next !== null) {
      this.messageService.getMessageByConversationWithPaginator(this.paginator)
        .then(res => {
          this.paginator = res.paginator;
          this.messages = this.messageAdapter.adaptList(res.data);
          this.messages.forEach(message => {
            this.addMessageToChat(message.messContent, message.messAuthor, message.messDate);
          });
        }).finally(() => {
        this.showSpinner = false;
      });
    } else {
      this.showSpinner = false;
    }

  }

  showSentMessage(message: string, messDate: Date, isOnline = false): void {
    const element = document.createElement('li');
    if (isOnline) {
      const stringDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy h:mm a');
      element.innerHTML = `${message}<li style="font-size:12px">${stringDate}</li>`;
    } else {
      element.innerHTML = `${message}<li style="font-size:12px">${messDate}</li>`;
    }
    element.className = 'message-sent';
    if (isOnline || !document.getElementById('message-list').hasChildNodes()) {
      document.getElementById('message-list').appendChild(element);
    } else {
      const nodoCabeza = document.getElementById('message-list').firstChild;
      document.getElementById('message-list').insertBefore(element, nodoCabeza);
    }
    if (isOnline) {
      this.scrollToBottom();
    }
  }

  showReceivedMessage(message: string, messDate: Date, isOnline = false): void {
    const element = document.createElement('li');
    if (message) {
      if (isOnline) {
        const stringDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy h:mm a');
        element.innerHTML = `${message}<li style="font-size:12px">${stringDate}</li>`;
      } else {
        element.innerHTML = `${message}<li style="font-size:12px">${messDate}</li>`;
      }
      element.className = 'message';
      if (isOnline || !document.getElementById('message-list').hasChildNodes()) {
        document.getElementById('message-list').appendChild(element);
      } else {
        const nodoCabeza = document.getElementById('message-list').firstChild;
        document.getElementById('message-list').insertBefore(element, nodoCabeza);
      }
    }
  }

  private getMessagesFromTheConversation(conversationToShow: ConversationModel): void {
    this.showSpinner = true;
    this.messageService.getMessageByConversation(conversationToShow.id)
      .then(res => {
        this.messages = this.messageAdapter.adaptList(res.data);
        this.messages.forEach(message => {
          this.addMessageToChat(message.messContent, message.messAuthor, message.messDate);
          this.paginator = res.paginator;
        });
      }).finally(() => {
      this.showSpinner = false;
      this.scrollToBottom();
    });
  }

  private addMessageToChat(message: string, authorId: uuid, messDate: Date, isOnline = false): void {
    if (authorId === this.userSession.id) {
      this.showSentMessage(message, messDate, isOnline);
    } else {
      this.showReceivedMessage(message, messDate, isOnline);
    }
  }

  private listenNewMessage(): void {
    this.callerChat = new CallerChatService(this.websocketService, this.conversation.id);
    this.callerChat.messages.subscribe(
      res => {
        if (res.mess_author !== this.userSession.id) {
          this.addMessageToChat(res.mess_content, res.mess_author, res.mess_date, true);
        }
      }, err => {
        this.messagerService.showToast(EnumLevelMessage.ERROR, err.error?.errors[0].detail);
      });
  }

  private scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }

  showEmojiModalPicker(): void {
    if (this.showEmojiPicker) {
      this.classMenuEmoji = 'cursor bi bi-emoji-smile';
    } else {
      this.classMenuEmoji = 'cursor bi bi-emoji-smile-fill color-icon-fill';
    }
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji($event: EmojiEvent): void {
    this.messageInput.nativeElement.focus();
    const selectionStart = this.messageInput.nativeElement.selectionStart;
    const currentValue = this.messageInput.nativeElement.value;
    const newValue = currentValue.substring(0, selectionStart) + $event.emoji.native + currentValue.substring(selectionStart);
    this.message = this.message + newValue;
    this.messageInput.nativeElement.selectionStart = selectionStart + $event.emoji.native.length;
    this.messageInput.nativeElement.selectionEnd = selectionStart + $event.emoji.native.length;
  }
}
