import {Subject} from 'rxjs';
import {v4 as uuid} from 'uuid';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {WebsocketService} from '../../websocket_service/websocket-service';

export interface NewNotification {
  message: string;
}

export class CallerNotificationService {

  public messages: Subject<NewNotification>;

  constructor(private websocketService: WebsocketService, userId: uuid) {
    const URL_ROOM = `${environment.notificationWebSocket}noti_individual/${userId}/`;
    this.messages = (websocketService
      .connect(URL_ROOM)
      .pipe(map((response: MessageEvent): NewNotification => {
        const data = JSON.parse(response.data);
        return {
          message: data.message
        };
      })) as Subject<NewNotification>);
  }

}
