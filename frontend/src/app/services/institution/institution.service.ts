import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

  readonly URL_API = environment.institutionUrl + 'institution/';
  public user;

  constructor(private http: HttpClient, public utilistiesString: UtilitiesConfigString) {
    this.user = this.utilistiesString.ls.get('user');

  }

  listInstitutions(): Promise<any> {
    return this.http.get(this.URL_API).toPromise();
  }

  saveInstitution(institution): Promise<any> {
    return this.http.post(this.URL_API, institution).toPromise();
  }

  updateInstitution(institution): Promise<any> {
    const URL_API = `${this.URL_API}${institution.id}/`;
    return this.http.put(URL_API, institution).toPromise();
  }

  deleteInstitution(instId): Promise<any> {
    const URL_API = `${this.URL_API}${instId}/`;
    return this.http.delete(URL_API).toPromise();
  }

  getInfoInstitution(instId): Promise<any> {
    const URL_API = `${this.URL_API}${instId}/`;
    return this.http.get(URL_API).toPromise();
  }


}

