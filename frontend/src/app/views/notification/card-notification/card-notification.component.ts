import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {ManageFullText} from '../../../controllers/manage-full-text';
import {PublicationService} from '../../../services/publication/publication.service';
import {PublicationAdapter} from '../../../adapters/implementation/publication/publication.adapter';
import {NotificationModel} from '../../../models/notification/notification.model';
import {Router} from '@angular/router';
import {notificationTypes} from '../../../utilities/types';
import {NotificationService} from '../../../services/notification/notification.service';
import {UserModel} from '../../../models/user/user.model';
import {MenuItem} from 'primeng/api';
import {MessagerService} from '../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../messenger/enum-level-message.enum';


@Component({
  selector: 'app-card-notification',
  templateUrl: './card-notification.component.html'
})
export class CardNotificationComponent implements OnInit {

  @Output() eventMarkNotificationUnread = new EventEmitter<void>();
  @Output() eventDelete = new EventEmitter<number>();
  @Input() indexNotification: number;
  @Input() notification: NotificationModel;
  fullText = notificationTypes.FULL_TEXT;
  user: UserModel;
  items: MenuItem[];
  sendMessage = 'Enviar';
  declineMessage = 'Declinar';
  showSpinnerSending = false;
  showSpinnerDecline = false;
  showOptionButton = false;

  constructor(private router: Router,
              private publicationService: PublicationService,
              private publicationAdapter: PublicationAdapter,
              private notificationService: NotificationService,
              private messagerService: MessagerService,
              public utilitiesString: UtilitiesConfigString) {
    this.user = this.utilitiesString.ls.get('user');
  }

  ngOnInit(): void {
    this.formMenu();
  }

  private formMenu(): void {
    this.items = [
      {
        label: 'Eliminar',
        icon: 'pi pi-x',
        command: (_ => this.deleteNotification(this.notification))
      }
    ];
  }

  sendFullText(): void {
    this.sendMessage = 'Enviando';
    this.showSpinnerSending = true;
    const manageFullText = new ManageFullText(this.publicationService, this.publicationAdapter);
    const path = this.notification.notiPath.split('/');
    manageFullText.sendFullText(this.notification.notiAuthorEmail, path[2]).then(res => {
      if (res.status) {
        this.eventDelete.emit(this.indexNotification);
        this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Publicación compartida con éxito.');
        this.notificationService.deleteNotification(this.notification.id).then();
      } else {
        this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
      }
    });
  }

  goToTheNotification(): void {
    if (!this.notification.notiIsRead){
      this.markNotificationAsRead();
    }
    switch (this.notification.notiType) {
      case notificationTypes.PUBLICATION:
      case notificationTypes.COMMUNITY:
        this.router.navigate([this.notification.notiPath, this.notification.notiAuthorId]).then();
        break;
      case notificationTypes.CHAT:
        this.router.navigate([this.notification.notiPath]).then();
        break;
      case notificationTypes.USER:
        this.router.navigate([this.notification.notiPath, this.notification.notiAuthorId]).then();
        break;
      default:
        this.router.navigate([this.notification.notiPath, this.notification.notiType, this.notification.notiAuthorId]).then();
    }
  }

  declineRequest(): void {
    this.declineMessage = 'Declinando';
    this.showSpinnerDecline = true;
    this.notificationService.deleteNotification(this.notification.id)
      .then(res => {
        if (res.status) {
          this.eventDelete.emit(this.indexNotification);
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Solicitud declinada');
        }
      });
  }

  private deleteNotification(notification): void {
    this.notificationService.deleteNotification(notification.id)
      .then(res => {
        if (res.status) {
          this.eventDelete.emit(this.indexNotification);
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Notificación eliminada');
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      });
  }

  private markNotificationAsRead(): void {
      this.notification.notiIsRead = true;
      const body = {
        noti_is_read: true
      };
      this.eventMarkNotificationUnread.emit();
      this.notificationService.patchNotification(this.notification.id, body).then();
  }

}
