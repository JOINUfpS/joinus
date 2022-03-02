import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {v4 as uuid} from 'uuid';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FollowUserServices {

  userId: uuid;
  readonly URL_API = environment.userUrl + 'follow_user';

  constructor(private http: HttpClient) {
  }

  isUserFollowed(instId, userSession, userId): Promise<any> {
    const URL_API = `${this.URL_API}/is_followed/${instId}/${userSession}/${userId}/`;
    return this.http.get(URL_API).toPromise();
  }

  getUsersFollowedAndFolllowers(instIdUser: uuid, userId: uuid): Promise<any> {
    const URL_API = `${this.URL_API}/followed_users/${instIdUser}/${userId}/`;
    return this.http.get(URL_API).toPromise();
  }

  getSuggestedUsers(instId: uuid, userId: uuid): Promise<any> {
    const URL_API = `${this.URL_API}/suggested_users/${instId}/${userId}/`;
    return this.http.get(URL_API).toPromise();
  }

  followUser(followUser: any): Promise<any> {
    const URL_API = `${this.URL_API}/follow/`;
    return this.http.post(URL_API, followUser).toPromise();
  }

  unfollowUser(followUser: any, idUserSession: uuid): Promise<any> {
    const URL_API = `${this.URL_API}/unfollow/${idUserSession}/`;
    return this.http.post(URL_API, followUser).toPromise();
  }

}
