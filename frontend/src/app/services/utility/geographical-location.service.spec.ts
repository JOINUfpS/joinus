import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {GeographicalLocationService} from './geographical-location.service';


describe('GeographicalLocationService', () => {
  let service: GeographicalLocationService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const URL_API = 'https://api.countrystatecity.in/v1/';

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(GeographicalLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be list all countries', () => {

    const expectedData = [
      {
        id: 1,
        name: 'Afghanistan',
        iso2: 'AF'
      },
      {
        id: 2,
        name: 'Aland Islands',
        iso2: 'AX'
      }
    ];

    service.getCountries().then(response => {
      expect(response).toEqual(expectedData);
    });
    const req = httpTestingController.expectOne(`${URL_API}countries/`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();

  });

  it('should be list all departments', () => {

    const expectedData = [
      {
        id: 2823,
        name: 'Atacama',
        iso2: 'AT'
      },
      {
        id: 2824,
        name: 'Región Metropolitana de Santiago',
        iso2: 'RM'
      }
    ];
    const isoCountry = 'CL';

    service.getStates(isoCountry).then(response => {
      expect(response).toEqual(expectedData);
    });
    const req = httpTestingController.expectOne(`${URL_API}countries/${isoCountry}/states`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be list all states', () => {

    const expectedData = [
      {
        id: 18973,
        name: 'Coquimbo'
      },
      {
        id: 18988,
        name: 'Illapel'
      }
    ];

    const isoCountry = 'CO';
    const isoState = 'NSA';

    service.getCities(isoCountry, isoState).then(response => {
      expect(response).toEqual(expectedData);
    });

    const req = httpTestingController.expectOne(`${URL_API}countries/${isoCountry}/states/${isoState}/cities`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

});
