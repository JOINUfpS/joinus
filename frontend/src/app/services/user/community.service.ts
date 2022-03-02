import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {v4 as uuid} from 'uuid';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  readonly URL_API = environment.userUrl + 'community/';

  constructor(private http: HttpClient) {
  }

  getCommunityById(commId: uuid): Promise<any> {
    const URL_API = `${this.URL_API}${commId}/`;
    return this.http.get(URL_API).toPromise();
  }

  saveCommunity(community): Promise<any> {
    return this.http.post(this.URL_API, community).toPromise();
  }

  updateCommunity(community): Promise<any> {
    const URL_API = `${this.URL_API}${community.id}/`;
    return this.http.put(URL_API, community).toPromise();
  }

  deleteCommunity(communityId): Promise<any> {
    const URL_API = `${this.URL_API}${communityId}/`;
    return this.http.delete(URL_API).toPromise();
  }

  getAllCategoriesOfCommunities(instId: uuid, userId: uuid): Promise<any> {
    const URL_API = `${this.URL_API}communities_categories/${instId}/${userId}/`;
    return this.http.get(URL_API).toPromise();
  }

  searchCommunitiesByTerm(instId: uuid, term: string): Promise<any> {
    const URL_API = `${this.URL_API}?inst_id=${instId}&search=${term}&ordering=comm_name`;
    return this.http.get(URL_API).toPromise();
  }

  getCommunityWithPaginator(paginator: any): Promise<any> {
    return this.http.get(paginator.next).toPromise();
  }

  patchCommunity(body: any, communityId: uuid): Promise<any> {
    const URL_API = `${this.URL_API}${communityId}/`;
    return this.http.patch(URL_API, body).toPromise();
  }

}
