import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {v4 as uuid} from 'uuid';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunityUserService {

  private readonly URL_API = environment.userUrl + 'community_user/';

  constructor(private http: HttpClient) {
  }

  getCommunityUser(commId: uuid, userId: uuid): Promise<any> {
    const COMMUNITY_USER = `?comm_id=${commId}&user_id=${userId}`;
    const URL_API = this.URL_API + COMMUNITY_USER;
    return this.http.get(URL_API).toPromise();
  }

  getUsersByCommunity(commId: uuid): Promise<any> {
    const USER_PER_COMMUNITY = `?comm_id=${commId}`;
    const URL_API = this.URL_API + USER_PER_COMMUNITY;
    return this.http.get(URL_API).toPromise();
  }

  saveCommunityUser(body: any): Promise<any> {
    return this.http.post(this.URL_API, body).toPromise();
  }

  deleteCommunityUserPerUser(communityId: uuid, userId: uuid): Promise<any> {
    const DELETE_COMMUNITY_USER = `information/${communityId}/${userId}/`;
    const URL_API = this.URL_API + DELETE_COMMUNITY_USER;
    return this.http.delete(URL_API).toPromise();
  }

  getMembersAndNoMembers(instId: uuid, commId: uuid): Promise<any> {
    const MEMBERS_AND_NO_MEMBERS = `members_and_no_members/${instId}/${commId}/`;
    const URL_API = this.URL_API + MEMBERS_AND_NO_MEMBERS;
    return this.http.get(URL_API).toPromise();
  }

  patchCommunityUser(body: any, communityUserId: uuid): Promise<any> {
    const URL_API = `${this.URL_API}${communityUserId}/`;
    return this.http.patch(URL_API, body).toPromise();
  }

  approveUnion(body, communityUserId: uuid): Promise<any> {
    const URL_API = `${this.URL_API}approve_union/${communityUserId}/`;
    return this.http.patch(URL_API, body).toPromise();
  }

  deleteCommunityUser(communityUserId: uuid): Promise<any> {
    const URL_API = `${this.URL_API}${communityUserId}/`;
    return this.http.delete(URL_API).toPromise();
  }

}
