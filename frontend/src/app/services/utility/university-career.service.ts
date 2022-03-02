import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniversityCareerService {

  readonly URL_API = `${environment.utilityUrl}university_career/`;

  constructor(private http: HttpClient) {
  }

  saveUniversityCareer(UniversityCareer: any): Promise<any> {
    return this.http.post(this.URL_API, UniversityCareer).toPromise();
  }

  getAllUniversityCareer(): Promise<any> {
    return this.http.get(`${this.URL_API}?ordering=career_name`).toPromise();
  }

}
