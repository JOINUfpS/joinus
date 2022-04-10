import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {environment} from '../../../environments/environment';
import {v4 as uuid} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class InviteRoleService {

  readonly URL_API = environment.userUrl + 'invite_role/';
  public user;

  constructor(private http: HttpClient, public utilitiesString: UtilitiesConfigString) {
    this.user = this.utilitiesString.ls.get('user');

  }

  listInviteRole(inroType): Promise<any> {
    const URL_API = `${this.URL_API}?inst_id=${this.user.instId}&inro_type=${inroType}`;
    return this.http.get(URL_API).toPromise();
  }

  listInviteRolesWithPagination(paginator: any): Promise<any>  {
    return this.http.get(paginator.next).toPromise();
  }

  saveInviteRole(inviteRole): Promise<any> {
    return this.http.post(this.URL_API, inviteRole).toPromise();
  }

  updateInviteRole(inviteRole): Promise<any> {
    const URL_API = `${this.URL_API}${inviteRole.id}/`;
    return this.http.put(URL_API, inviteRole).toPromise();
  }

  deleteInviteRole(inviteRoleId): Promise<any> {
    const URL_API = `${this.URL_API}${inviteRoleId}/`;
    return this.http.delete(URL_API).toPromise();
  }

  authorizeRole(inviteRole): Promise<any> {
    const URL_API = `${this.URL_API}authorize_role/${inviteRole.id}/`;
    return this.http.patch(URL_API, inviteRole).toPromise();
  }

  inviteTakeRole(inviteRole): Promise<any> {
    const URL_API = `${this.URL_API}invite_take_role/`;
    return this.http.post(URL_API, inviteRole).toPromise();
  }

  assignRoles(bodyAssignRoles): Promise<any> {
    const URL_API = `${this.URL_API}assign_roles/`;
    return this.http.post(URL_API, bodyAssignRoles).toPromise();
  }

  revokeRoles(userId: uuid, body): Promise<any> {
    const URL_API = `${this.URL_API}revoke_roles/${userId}/`;
    return this.http.patch(URL_API, body).toPromise();
  }

  requestRole(inviteRole): Promise<any> {
    const URL_API = `${this.URL_API}request_role/`;
    return this.http.post(URL_API, inviteRole).toPromise();
  }

}
