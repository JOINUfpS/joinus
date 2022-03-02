import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NotificationService} from '../../../services/notification/notification.service';
import {UserModel} from '../../../models/user/user.model';
import {NotificationAdapter} from '../../../adapters/implementation/notification/notification.adapter';
import {NotificationModel} from '../../../models/notification/notification.model';
import {CallerNotificationService} from '../../../services/notification/notification_websocket/caller-notification.service';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {WebsocketService} from '../../../services/websocket_service/websocket-service';
import {LoadingService} from '../../../services/loading/loading.service';


@Component({
  selector: 'app-list-notification',
  templateUrl: './list-notification.component.html',
  providers: [WebsocketService]
})
export class ListNotificationComponent implements OnInit {

  @Output() communicatorWithFatherOutput = new EventEmitter<number>();
  userSession: UserModel;
  notificationsVirtual: NotificationModel[] = [];
  numberNotificationsNoRead = 0;
  callerNotification: CallerNotificationService;
  public paginator: any;
  isLoadingNotifications = false;


  constructor(private notificationService: NotificationService,
              private notificationAdapter: NotificationAdapter,
              private websocketService: WebsocketService,
              private loadingService: LoadingService,
              private utilitiesString: UtilitiesConfigString,
  ) {
    this.userSession = this.utilitiesString.ls.get('user');
  }

  ngOnInit(): void {
    this.getNotifications();
    this.listenNewNotifications();
  }

  getNotifications(): void {
    this.isLoadingNotifications = true;
    this.notificationService.getNotificationsPerUser(this.userSession.id)
      .then(res => {
        this.paginator = res.paginator;
        this.notificationsVirtual = this.notificationAdapter.adaptList(res.data);
        this.numberNotificationsNoRead = this.notificationsVirtual.filter(notification => !notification.notiIsRead).length;
        this.communicatorWithFatherOutput.emit(this.numberNotificationsNoRead);
      })
      .finally(() => {
        this.isLoadingNotifications = false;
      });
  }

  onScrollDown(): void {
    if (this.paginator.next !== null && !this.isLoadingNotifications) {
      this.notificationService.listNotificationsPerUserWithPagination(this.paginator)
        .then(res => {
          this.paginator = res.paginator;
          this.notificationsVirtual = this.notificationsVirtual.concat(this.notificationAdapter.adaptList(res.data));
        });
    }
  }

  private listenNewNotifications(): void {
    this.callerNotification = new CallerNotificationService(this.websocketService, this.userSession.id);
    this.callerNotification.messages.subscribe(
      _ => {
        this.numberNotificationsNoRead++;
        this.getNotifications();
        this.communicatorWithFatherOutput.emit(this.numberNotificationsNoRead);
      });
  }

  markNotificationAsUnRead(): void {
    this.numberNotificationsNoRead--;
    this.communicatorWithFatherOutput.emit(this.numberNotificationsNoRead);
  }

  removeNotification(indexToRemove: number): void {
    const manyToRemove = 1;
    this.notificationsVirtual.splice(indexToRemove, manyToRemove);
    this.markNotificationAsUnRead();
  }
}
