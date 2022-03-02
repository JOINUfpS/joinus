import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {ConversationModel} from '../../../models/chat/conversation.model';
import {UserModel} from '../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {v4 as uuid} from 'uuid';
import {MenuItem} from 'primeng/api';
import {ConversationService} from '../../../services/chat/conversation.service';
import {EnumLevelMessage} from '../../../messenger/enum-level-message.enum';
import {MessagerService} from '../../../messenger/messager.service';
import {ConversationAdapter} from '../../../adapters/implementation/chat/conversation.adapter';

@Component({
  selector: 'app-card-conversation',
  templateUrl: './card-conversation.component.html'
})
export class CardConversationComponent implements OnInit, OnChanges {

  @Input() conversation: ConversationModel;
  @Input() userSession: UserModel;
  @Input() idLastConversation: uuid;
  @Output() communicatorWithFather = new EventEmitter<ConversationModel>();
  @Output() eventDeleteConversation = new EventEmitter<ConversationModel>();
  @Output() eventActive = new EventEmitter<void>();
  public items: MenuItem[];
  public nameOtherUser: string;
  public photoOtherUser: uuid;
  public conversationClass = 'card-conversation col-12 justify-content-center';
  public showOptionButton = false;


  constructor(public utilitiesConfigString: UtilitiesConfigString,
              private conversationAdapter: ConversationAdapter,
              private conversationService: ConversationService,
              private messagerService: MessagerService) {
  }

  ngOnInit(): void {
    this.chooseInformationToShow();
    this.formMenu();
  }

  ngOnChanges(): void {
    if (this.conversation.id === this.idLastConversation) {
      this.conversationClass = 'card-conversation col-12 justify-content-center conversation-active';
    } else {
      this.conversationClass = 'card-conversation col-12 justify-content-center';
    }
  }

  formMenu(): void {
    this.items = [
      {
        label: 'Eliminar',
        icon: 'pi pi-x',
        command: (_ => this.deleteConversation(this.conversation))
      }
    ];
  }

  seeConversation(event: any): void {
    this.communicatorWithFather.emit(this.conversation);
    this.eventActive.emit();
    const rootActive = event.target.parentNode.offsetParent.offsetParent;
    if (rootActive.className === 'card-conversation col-12 justify-content-center') {
      this.conversationClass = this.conversationClass + ' conversation-active';
    } else {
      this.conversationClass = 'card-conversation col-12 justify-content-center';
    }
  }

  private chooseInformationToShow(): any {
    if (this.conversation.convUserEmisorId === this.userSession.id) {
      this.nameOtherUser = this.conversation.convUserReceiverName;
      this.photoOtherUser = this.conversation.convUserReceiverPhotoId;
    } else {
      this.nameOtherUser = this.conversation.convUserEmisorName;
      this.photoOtherUser = this.conversation.convUserEmisorPhotoId;
    }
  }

  deleteConversation(conversation): void {
    this.conversationService.deleteConversation(this.userSession.id, conversation.id).then(res => {
      if (res.status) {
        this.eventDeleteConversation.emit(this.conversation);
        this.messagerService.showToast(EnumLevelMessage.SUCCESS, res.message);
      } else {
        this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
      }
    });
  }
}
