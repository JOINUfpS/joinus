import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageServices {

  readonly URL_API = environment.urlChat + 'message/';

  constructor(private http: HttpClient) {
  }

  public getMessageByConversation(convId: string): Promise<any> {
    const URL_API = `${this.URL_API}?conv_id=${convId}&ordering=-mess_date`;
    return this.http.get(URL_API).toPromise();
  }

  getMessageByConversationWithPaginator(paginator: any): Promise<any> {
    return this.http.get(paginator.next).toPromise();
  }

}
