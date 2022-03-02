import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  readonly URL_API = environment.securityUrl + 'security/';

  constructor(private http: HttpClient) {
  }

  login(user): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    const URL_API = `${this.URL_API}login/`;
    return this.http.post(URL_API, user, httpOptions).toPromise();
  }

  forgotPassword(userEmail): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    const URL_API = `${this.URL_API}forgot_password/`;
    return this.http.post(URL_API, userEmail, httpOptions).toPromise();
  }

  confirmForgotPassword(userEmail): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    const URL_API = `${this.URL_API}confirm-forgot-password/`;
    return this.http.post(URL_API, userEmail, httpOptions).toPromise();
  }

  logout(user): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    const URL_API = `${this.URL_API}logout/`;
    return this.http.post(URL_API, user, httpOptions).toPromise();
  }

  refreshToken(token): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    const URL_API = `${this.URL_API}refresh-token/`;
    return this.http.post(URL_API, token, httpOptions);
  }

}
