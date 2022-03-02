import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfirmAccountService {

  readonly URL_API = environment.securityUrl + 'confirm_account/';

  constructor(private http: HttpClient) {
  }

  confirmAccount(confirmInformation): Promise<any> {
    const URL_API = `${this.URL_API}confirming_account/`;
    return this.http.put(URL_API, confirmInformation).toPromise();
  }
}
