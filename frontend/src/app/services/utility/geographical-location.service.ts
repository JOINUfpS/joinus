import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeographicalLocationService {

  private readonly URL_API = 'https://api.countrystatecity.in/v1/';
  private readonly VALUE_KEY = 'bVFsbG1MZG50WFJXQUtPdzJmQjhNSzM1M3BoSUF4MDJsRnhGTDNJYQ==';
  private readonly HTTP_OPTIONS = {
    headers: new HttpHeaders({
      'X-CSCAPI-KEY': this.VALUE_KEY
    })
  };

  constructor(private http: HttpClient) {
  }

  getCountries(): Promise<any> {
    const URL_COUNTRIES = `${this.URL_API}countries/`;
    return this.http.get(URL_COUNTRIES, this.HTTP_OPTIONS).toPromise();
  }

  getStates(isoCountry: string): Promise<any> {
    const URL_STATES_BY_COUNTRY = `${this.URL_API}countries/${isoCountry}/states`;
    return this.http.get(URL_STATES_BY_COUNTRY, this.HTTP_OPTIONS).toPromise();
  }

  getCities(isoCountry: string, isoState: string): Promise<any> {
    const URL_CITIES_BY_STATE_BY_COUNTRY = `${this.URL_API}countries/${isoCountry}/states/${isoState}/cities`;
    return this.http.get(URL_CITIES_BY_STATE_BY_COUNTRY, this.HTTP_OPTIONS).toPromise();
  }


}
