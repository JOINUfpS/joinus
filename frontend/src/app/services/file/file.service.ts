import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  readonly URL_API = environment.fileUrl + 'file/';

  constructor(private http: HttpClient) {
  }

  saveFile(file): Promise<any> {
    const URL_API = `${this.URL_API}put_object/`;
    return this.http.put(URL_API, file).toPromise();
  }

}
