import {Observable, Observer, Subject, Subscriber} from 'rxjs';
import {AnonymousSubject} from 'rxjs/internal-compatibility';
import {Injectable} from '@angular/core';


@Injectable()
export class WebsocketService {

  private subject: Subject<MessageEvent>;

  public connect(url): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
    }
    return this.subject;
  }

  public create(url): AnonymousSubject<MessageEvent> {
    const ws = new WebSocket(url);
    const observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    const observer = new Subscriber({
      next: (data: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    });

    return new AnonymousSubject<MessageEvent>(observer, observable);
  }
}
