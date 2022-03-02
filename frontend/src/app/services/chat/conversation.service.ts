import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {v4 as uuid} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  readonly URL_API = environment.urlChat + 'conversation/';

  constructor(private http: HttpClient) {
  }

  getAllConversationsMatchUser(userEmail: string): Promise<any> {
    const URL_API = `${this.URL_API}?search=${userEmail}`;
    return this.http.get(URL_API).toPromise();
  }

  getAllConversationsMatchUserWithPagination(paginator: any): Promise<any> {
    return this.http.get(paginator.next).toPromise();
  }

  createConversation(request: any): Promise<any> {
    return this.http.post(this.URL_API, request).toPromise();
  }

  sendMessage(bodyMessage: any): Promise<any> {
    const URL_API = `${this.URL_API}send_message/`;
    return this.http.post(URL_API, bodyMessage).toPromise();
  }

  deleteConversation(userSession: uuid, convId: uuid): Promise<any> {
    const URL_API = `${this.URL_API}delete_conversation/${userSession}/${convId}/`;
    return this.http.delete(URL_API).toPromise();
  }

}
