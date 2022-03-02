import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {v4 as uuid} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly URL_API = environment.notificationUrl + 'notification/';

  constructor(private http: HttpClient) {
  }

  getNotificationsPerUser(notiReceiverId: uuid): Promise<any> {
    const NOTIFICATION_PER_USER = `?noti_receiver_id=${notiReceiverId}&ordering=-noti_date`;
    const URL_API = this.URL_API + NOTIFICATION_PER_USER;
    return this.http.get(URL_API).toPromise();
  }

  listNotificationsPerUserWithPagination(paginator: any): Promise<any> {
    return this.http.get(paginator.next).toPromise();
  }

  createNotificationToInviteCommunity(body: any): Promise<any> {
    const INVITATION_COMMUNITY = 'notify_community_invitation/';
    const URL_API = `${this.URL_API}${INVITATION_COMMUNITY}`;
    return this.http.post(URL_API, body).toPromise();
  }

  patchNotification(notiId: uuid, body: any): Promise<any> {
    const URL_API = `${this.URL_API}${notiId}/`;
    return this.http.patch(URL_API, body).toPromise();
  }

  deleteNotification(notificationId): Promise<any> {
    const URL_API = `${this.URL_API}${notificationId}/`;
    return this.http.delete(URL_API).toPromise();
  }

  deleteNotificationCommunity(body: any): Promise<any> {
    const DELETE_INVITATION_COMMUNITY = 'delete_invitation_community/';
    const URL_API = this.URL_API + DELETE_INVITATION_COMMUNITY;
    return this.http.post(URL_API, body).toPromise();
  }

  getNotificationForUserAuthorType(user: uuid, author: uuid, type: string): Promise<any> {
    const FILTER_TYPE_NOTIFICATION = `?noti_receiver_id=${user}&noti_author_id=${author}&noti_type=${type}`;
    const URL_API = this.URL_API + FILTER_TYPE_NOTIFICATION;
    return this.http.get(URL_API).toPromise();
  }

  saveNotification(notification): Promise<any> {
    const URL_API = `${this.URL_API}`;
    return this.http.post(URL_API, notification).toPromise();
  }

  notifyNewPublicationCommunity(bodyNotification: string): Promise<any> {
    const URL_API = `${this.URL_API}notify_new_publication_community/`;
    return this.http.post(URL_API, bodyNotification).toPromise();
  }

}
