import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {v4 as uuid} from 'uuid';
import {UserModel} from '../../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class PublicationUserService {

  private readonly URL_API = environment.publicationUrl + 'publication_user/';
  private user: UserModel;

  constructor(private http: HttpClient, public utilistiesString: UtilitiesConfigString) {
    this.user = this.utilistiesString.ls.get('user');
  }

  listPublicationUser(userId: uuid): Promise<any> {
    const URL_API = `${this.URL_API}?user_id=${userId}&ordering=-created_date`;
    return this.http.get(URL_API).toPromise();
  }

  savePublicationUser(publicationUser): Promise<any> {
    return this.http.post(this.URL_API, publicationUser).toPromise();
  }

  updatePublicationUser(publicationUser): Promise<any> {
    const URL_API = `${this.URL_API}${publicationUser.id}/`;
    return this.http.put(URL_API, publicationUser).toPromise();
  }

  deletePublicationUser(publicationUserId): Promise<any> {
    const URL_API = `${this.URL_API}${publicationUserId}/`;
    return this.http.delete(URL_API).toPromise();
  }

  getPublicationUser(publicationUserId): Promise<any> {
    const URL_API = `${this.URL_API}?userId=${this.user.id}&publ_id=${publicationUserId}`;
    return this.http.get(URL_API).toPromise();
  }
}
