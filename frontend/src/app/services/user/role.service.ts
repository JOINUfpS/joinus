import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  readonly URL_API = environment.userUrl + 'role/';
  public user;

  constructor(private http: HttpClient, public utilistiesString: UtilitiesConfigString) {
    this.user = this.utilistiesString.ls.get('user');
  }

  listRoles(): Promise<any> {
    const URL_API = `${this.URL_API}?inst_id=${this.user.instId}`;
    return this.http.get(URL_API).toPromise();
  }

  getRole(roleId): Promise<any> {
    const URL_API = `${this.URL_API}${roleId}/`;
    return this.http.get(URL_API).toPromise();
  }

  saveRole(role): Promise<any> {
    return this.http.post(this.URL_API, role).toPromise();
  }

  updateRole(role): Promise<any> {
    const URL_API = `${this.URL_API}${role.id}/`;
    return this.http.put(URL_API, role).toPromise();
  }

  deleteRole(roleId): Promise<any> {
    const URL_API = `${this.URL_API}${roleId}/`;
    return this.http.delete(URL_API).toPromise();
  }


}
