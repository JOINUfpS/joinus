import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {v4 as uuid} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  readonly URL_API = environment.publicationUrl + 'publication/';
  public user;

  constructor(private http: HttpClient, public utilistiesString: UtilitiesConfigString) {
    this.user = this.utilistiesString.ls.get('user');
  }

  listPublications(): Promise<any> {
    const URL_API = `${this.URL_API}?inst_id=${this.user.instId}&publ_privacy=false&ordering=-created_date`;
    return this.http.get(URL_API).toPromise();
  }

  listPublicationsByCommunity(commId: uuid): Promise<any> {
    const URL_API = `${this.URL_API}?comm_id=${commId}&ordering=-created_date`;
    return this.http.get(URL_API).toPromise();
  }

  listPublicationsWithPagination(paginator: any): Promise<any> {
    return this.http.get(paginator.next).toPromise();
  }

  savePublication(publication): Promise<any> {
    return this.http.post(this.URL_API, publication).toPromise();
  }

  updatePublication(publication): Promise<any> {
    const URL_API = `${this.URL_API}${publication.id}/`;
    return this.http.put(URL_API, publication).toPromise();
  }

  partialUpdatePublication(publication): Promise<any> {
    const URL_API = `${this.URL_API}${publication.id}/`;
    return this.http.patch(URL_API, publication).toPromise();
  }

  patchPublication(publicationPatch: any, idPublication: uuid): Promise<any> {
    const URL_API = `${this.URL_API}${idPublication}/`;
    return this.http.patch(URL_API, publicationPatch).toPromise();
  }

  deletePublication(publicationId): Promise<any> {
    const URL_API = `${this.URL_API}${publicationId}/`;
    return this.http.delete(URL_API).toPromise();
  }

  getPublication(publicationId): Promise<any> {
    const URL_API = `${this.URL_API}${publicationId}/`;
    return this.http.get(URL_API).toPromise();
  }

  getMyPublications(userId): Promise<any> {
    const URL_API = `${this.URL_API}?user_id=${userId}&ordering=-created_date`;
    return this.http.get(URL_API).toPromise();
  }

  sendFullRequest(publication): Promise<any> {
    const URL_API = `${this.URL_API}send_full_text/`;
    return this.http.post(URL_API, publication).toPromise();
  }

  searchPublicationsByTerm(instId: uuid, term: string): Promise<any> {
    const URL_API = `${this.URL_API}?search=${term}&publ_privacy=false&publ_standard=true&inst_id=${instId}&ordering=-created_date`;
    return this.http.get(URL_API).toPromise();
  }

  searchQuestionByTerm(instId: uuid, term: string): Promise<any> {
    const URL_API = `${this.URL_API}?publ_privacy=false&publ_standard=false&inst_id=${instId}&search=${term}&ordering=-created_date`;
    return this.http.get(URL_API).toPromise();
  }

  sharePublication(bodyInformationToShare: any): Promise<any> {
    const URL_API = `${this.URL_API}share/`;
    return this.http.post(URL_API, bodyInformationToShare).toPromise();
  }

  interestPublication(infoInterest): Promise<any> {
    const URL_API = `${this.URL_API}interest/`;
    return this.http.post(URL_API, infoInterest).toPromise();
  }

  getPublicationsRelated(publicationId: uuid, projectId: uuid, showPrivates: boolean): Promise<any> {
    const URL_API = `${this.URL_API}public_related/${publicationId}/${projectId}/${showPrivates}/`;
    return this.http.get(URL_API).toPromise();
  }

}
