import {TestBed} from '@angular/core/testing';
import {UniversityCareerService} from './university-career.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {UniversityCareerModel} from '../../models/utility/university-career.model';
import {UniversityCareerAdapter} from '../../adapters/implementation/utility/universityCareer.adapter';


describe('UniversityCareerService', () => {
  let service: UniversityCareerService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let universityCareerAdapter: UniversityCareerAdapter;
  const url = `${environment.utilityUrl}university_career/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UniversityCareerService, UtilitiesConfigString, HttpClient]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UniversityCareerService);
    universityCareerAdapter = TestBed.inject(UniversityCareerAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be list all university career', () => {

    const expectedData = [
      {
        id: '1751e597-ab2c-45e5-80af-894e63c4219b',
        careerName: 'Administración de Empresas'
      },
      {
        id: 'f7c0a516-baee-4e3e-b4d2-5db6b3f8abe9',
        careerName: 'Análisis de Datos para la Investigación Científica'
      }
    ];

    const expectedDataAdapted = universityCareerAdapter.adaptList(expectedData);

    service.getAllUniversityCareer().then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(universityCareerAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?ordering=career_name`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be create university career', () => {

    const universityCareer = new UniversityCareerModel(
      'cff8fd61-24ab-40da-a3df-583f3445bda7',
      'Arquitectura'
    );

    const expectedDataAdapted = universityCareerAdapter.adaptObjectSend(universityCareer);

    service.saveUniversityCareer(universityCareer).then(response => {
      expect(typeof response).toBe('boolean');
      expect(expectedDataAdapted).toEqual(universityCareerAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

});
