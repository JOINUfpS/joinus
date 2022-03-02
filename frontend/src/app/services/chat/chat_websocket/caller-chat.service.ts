import {Subject} from 'rxjs';
import {v4 as uuid} from 'uuid';
import {map} from 'rxjs/operators';
import {WebsocketService} from '../../websocket_service/websocket-service';
import {environment} from '../../../../environments/environment';

export interface Message {
  conv_id: uuid;
  mess_author: string;
  mess_content: string;
  mess_date: Date;
}

export class CallerChatService {

  public messages: Subject<Message>;

  constructor(private wsService: WebsocketService, conversationId: uuid) {
    const URL_ROOM = `${environment.chatWebsocket}conversation/${conversationId}/`;
    this.messages = (wsService
      .connect(URL_ROOM)
      .pipe(map((response: MessageEvent): Message => {
        const data = JSON.parse(response.data);
        if (data.conv_id === conversationId) {
          return {
            conv_id: data.conv_id,
            mess_author: data.mess_author,
            mess_content: data.mess_content,
            mess_date: data.mess_date
          };
        }
      })) as Subject<Message>);
  }
}
