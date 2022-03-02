import {Component, OnInit, ViewChild} from '@angular/core';
import {UserModel} from '../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {UsersService} from '../../../services/user/user.service';
import {UserAdapter} from '../../../adapters/implementation/user/user.adapter';
import {FormGroup} from '@angular/forms';
import {ConversationService} from '../../../services/chat/conversation.service';
import {ConversationAdapter} from '../../../adapters/implementation/chat/conversation.adapter';
import {ConversationModel} from '../../../models/chat/conversation.model';
import {MessageModel} from '../../../models/chat/message.model';
import {ViewConversationComponent} from '../view-conversation/view-conversation.component';
import {v4 as uuid} from 'uuid';

@Component({
  selector: 'app-chat',
  templateUrl: './list-conversation.component.html'
})
export class ListConversationComponent implements OnInit {

  private users: UserModel[];
  @ViewChild('viewConversation', {static: true}) viewConversation: ViewConversationComponent;
  idLastConversation: uuid;
  createConversationDialogDisplay: boolean;
  filteredUser: UserModel[] = [];
  conversationToSearch: string;
  userSession: UserModel;
  selectedUser: any;
  form: FormGroup;
  conversationsUserSession: ConversationModel[];
  listOriginalConversationsUserSession: ConversationModel[];
  messages: MessageModel[];
  conversationSelected: ConversationModel;
  paginator: any;
  isLoadingConversation: boolean;
  isButtonInAction = false;

  constructor(
    private userServices: UsersService,
    private userAdapter: UserAdapter,
    private conversationService: ConversationService,
    private conversationAdapter: ConversationAdapter,
    public utilitiesConfigString: UtilitiesConfigString) {
    this.userSession = this.utilitiesConfigString.ls.get('user');
  }

  ngOnInit(): void {
    this.listConversationByUserSession();
  }

  onScrollDown(): void {
    if (this.paginator.next !== null) {
      this.conversationService.getAllConversationsMatchUserWithPagination(this.paginator)
        .then(res => {
          this.paginator = res.paginator;
          this.listOriginalConversationsUserSession = this.listOriginalConversationsUserSession.concat(
            this.conversationAdapter.adaptList(res.data));
        });
    }
  }

  filterUser(event): void {
    this.userServices.getUserByName(this.userSession.instId, event.query)
      .then(res => {
        this.users = this.userAdapter.adaptList(res.data);
        const filtered = [];
        const query = event.query;
        this.users.forEach(user => {
          if (user.userName.toLowerCase().indexOf(query.toLowerCase()) > -1) {
            filtered.push(user);
          }
        });
        this.filteredUser = filtered;
      });
  }

  show(): void {
    this.createConversationDialogDisplay = true;
  }

  createConversation(): void {
    this.isButtonInAction = true;

    if (this.selectedUser === undefined || this.selectedUser.id === undefined
      || this.conversationsUserSession === undefined) {
      this.isButtonInAction = false;
      this.createConversationDialogDisplay = false;
    } else {
      let conversationSelected: ConversationModel[];
      if (this.selectedUser.id === this.userSession.id) {
        conversationSelected = this.conversationsUserSession.filter(
          conversation => conversation.convUserEmisorId === this.selectedUser.id
            && conversation.convUserReceiverId === this.selectedUser.id);
      } else {
        conversationSelected = this.conversationsUserSession.filter(
          conversation => conversation.convUserEmisorId === this.selectedUser.id
            || conversation.convUserReceiverId === this.selectedUser.id);
      }

      if (conversationSelected.length > 0) {
        this.seeConversation(conversationSelected[0]);
        this.createConversationDialogDisplay = false;
        this.isButtonInAction = false;
      } else {
        const request = this.conversationAdapter.adaptObjectSendNewConversation(this.userSession, this.selectedUser);
        this.conversationService.createConversation(request)
          .then(res => {
            this.conversationSelected = this.conversationAdapter.adaptObjectReceive(res.data);
            this.conversationsUserSession.push(this.conversationSelected);
            this.listOriginalConversationsUserSession = this.conversationsUserSession;
            this.seeConversation(this.conversationSelected);
          })
          .finally(() => {
            this.isButtonInAction = false;
            this.createConversationDialogDisplay = false;
            this.selectedUser = {};
          });
      }
    }
  }

  seeConversation(conversationSelected: ConversationModel): void {
    this.viewConversation.uploadMessagesInChat(conversationSelected);
    this.idLastConversation = conversationSelected.id;
  }

  searchConversation(): void {
    this.conversationsUserSession = this.listOriginalConversationsUserSession;
    if (this.conversationToSearch !== '') {
      const filtered = [];
      this.conversationsUserSession.forEach(conversation => {
        if (
          (conversation.convUserEmisorId === this.userSession.id &&
            conversation.convUserReceiverName.toLowerCase().indexOf(this.conversationToSearch.toLowerCase()) === 0)
          || (conversation.convUserReceiverId === this.userSession.id &&
            conversation.convUserEmisorName.toLowerCase().indexOf(this.conversationToSearch.toLowerCase()) === 0)
        ) {
          filtered.push(conversation);
        }
      });
      this.conversationsUserSession = filtered;
    } else {
      this.conversationsUserSession = this.listOriginalConversationsUserSession;
    }

  }

  private listConversationByUserSession(): void {
    this.isLoadingConversation = true;
    this.conversationService.getAllConversationsMatchUser(this.userSession.userEmail)
      .then(res => {
        this.conversationsUserSession = this.conversationAdapter.adaptList(res.data);
        this.listOriginalConversationsUserSession = this.conversationsUserSession;
        this.paginator = res.paginator;
      })
      .finally(() => {
        this.isLoadingConversation = false;
      });
  }

  removeConversation(conversationToRemove: ConversationModel): void {
    const manyDelete = 1;
    this.viewConversation.thereConversationShow = false;
    const indexConversationToRemove = this.conversationsUserSession.indexOf(conversationToRemove);
    this.conversationsUserSession.splice(indexConversationToRemove, manyDelete);
  }

  removeActive(): void {
    const conversationActive = document.getElementsByClassName('card-conversation col-12 justify-content-center conversation-active');
    if (conversationActive.item(0) !== null) {
      conversationActive.item(0).className = 'card-conversation col-12 justify-content-center';
    }
  }
}
