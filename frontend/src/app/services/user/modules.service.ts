import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  readonly URL_API = environment.userUrl + 'module/';

  constructor(private http: HttpClient) {
  }

  getModules(): Promise<any> {
    return this.http.get(`${this.URL_API}?modu_is_generic=false`).toPromise();
  }
}
