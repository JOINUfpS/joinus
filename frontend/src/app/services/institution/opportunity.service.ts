import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {v4 as uuid} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  readonly URL_API = environment.institutionUrl + 'opportunity/';
  public user;

  constructor(private http: HttpClient, public utilistiesString: UtilitiesConfigString) {
    this.user = this.utilistiesString.ls.get('user');
  }

  listOpportunities(): Promise<any> {
    const URL_API = `${this.URL_API}?inst_id=${this.user.instId}&ordering=-created_date`;
    return this.http.get(URL_API).toPromise();
  }

  listOpportunitiesWithPagination(paginator: any): Promise<any> {
    return this.http.get(paginator.next).toPromise();
  }

  saveOpportunity(opportunity): Promise<any> {
    return this.http.post(this.URL_API, opportunity).toPromise();
  }

  updateOpportunity(opportunity): Promise<any> {
    const URL_API = `${this.URL_API}${opportunity.id}/`;
    return this.http.put(URL_API, opportunity).toPromise();
  }

  deleteOpportunity(oppoId): Promise<any> {
    const URL_API = `${this.URL_API}${oppoId}/`;
    return this.http.delete(URL_API).toPromise();
  }

  applyOpportunity(applicantInformation): Promise<any> {
    const URL_API = `${this.URL_API}apply_opportunity/`;
    return this.http.post(URL_API, applicantInformation).toPromise();
  }

  userOpportunities(instId: uuid, userId: uuid): Promise<any> {
    const URL_API = `${this.URL_API}user_opportunity_saved/${instId}/${userId}/`;
    return this.http.get(URL_API).toPromise();
  }

  myOpportunities(userId: uuid): Promise<any> {
    const URL_API = `${this.URL_API}?user_id=${userId}&ordering=-created_date`;
    return this.http.get(URL_API).toPromise();
  }

  searchOpportunitiesByTerm(instId: uuid, term: string): Promise<any> {
    const URL_API = `${this.URL_API}?inst_id=${instId}&search=${term}&ordering=-created_date`;
    return this.http.get(URL_API).toPromise();
  }

}
