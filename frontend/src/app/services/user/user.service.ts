import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {v4 as uuid} from 'uuid';
import {environment} from '../../../environments/environment';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {Status} from '../../utilities/status';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  readonly URL_API = environment.userUrl + 'user/';
  public user;

  constructor(private http: HttpClient, public utilistiesString: UtilitiesConfigString) {
    this.user = this.utilistiesString.ls.get('user');
  }

  listUsers(): Promise<any> {
    const URL_API = `${this.URL_API}?inst_id=${this.user.instId}&user_status=${Status.ACTIVO}`;
    return this.http.get(URL_API).toPromise();
  }

  listUserWithPagination(paginator: any): Promise<any> {
    return this.http.get(paginator.next).toPromise();
  }

  saveUser(user): Promise<any> {
    return this.http.post(this.URL_API, user).toPromise();
  }

  updateUser(user): Promise<any> {
    const URL_API = `${this.URL_API}${user.id}/`;
    return this.http.put(URL_API, user).toPromise();
  }

  partialUserUpdate(itemUser: any, idUser: uuid): Promise<any> {
    const URL_API = `${this.URL_API}${idUser}/`;
    return this.http.patch(URL_API, itemUser).toPromise();
  }

  deleteUser(userId): Promise<any> {
    const URL_API = `${this.URL_API}${userId}/`;
    return this.http.delete(URL_API).toPromise();
  }

  getInfoUser(userId): Promise<any> {
    const URL_API = `${this.URL_API}${userId}/`;
    return this.http.get(URL_API).toPromise();
  }

  getUserByName(instId: uuid, userName: string): Promise<any> {
    userName = userName?.replace(' ', '%20');
    const URL_API = `${this.URL_API}?inst_id=${instId}&user_status=Activo&search=${userName}&ordering=user_name`;
    return this.http.get(URL_API).toPromise();
  }

  getUserWithPaginator(paginator: any): Promise<any> {
    return this.http.get(paginator.next).toPromise();
  }

  changePassword(user): Promise<any> {
    const URL_API = `${this.URL_API}change_password/`;
    return this.http.put(URL_API, user).toPromise();
  }

}
