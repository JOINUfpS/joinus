import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {InstitutionModel} from '../../models/institutions/institution.model';
import {InstitutionService} from './institution.service';
import {InstitutionAdapter} from '../../adapters/implementation/institutions/institution.adapter';


describe('InstitutionService', () => {
  let service: InstitutionService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let institutionAdapter: InstitutionAdapter;
  const url = `${environment.institutionUrl}institution/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InstitutionService, UtilitiesConfigString, HttpClient]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(InstitutionService);
    institutionAdapter = TestBed.inject(InstitutionAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be get institution information', () => {
    const instId = '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1';
    const expectedData = {
      inst_name: 'Universidad Francisco de Paula Santander',
      inst_photo: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      inst_address: 'Calle 13a # 7-20 Centro',
      inst_country: 'Colombia',
      inst_department: 'Norte de Santander',
      inst_municipality: 'Cucuta',
      inst_head: 'Hector Parra',
      inst_website: 'www.ufps.edu.co',
      inst_phone: '325487687',
      inst_fax: 'N/A'
    };

    const expectedDataAdapted = institutionAdapter.adaptObjectReceive(expectedData);

    service.getInfoInstitution(instId).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(institutionAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${instId}/`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be update institution', () => {

    const institution = new InstitutionModel('',
      'Universidad Francisco de Paula Santander',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Calle 13a # 7-20 Centro',
      'Colombia',
      'Norte de Santander',
      'Cucuta',
      'Hector Parra',
      'ww2.ufps.edu.co',
      '57849857',
      '547845');

    const institutionUpdate = institutionAdapter.adaptObjectSend(institution);

    service.updateInstitution(institution).then(response => {
      expect(typeof response).toBe('boolean');
      expect(institutionUpdate).toEqual(institutionAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${institution.id}/`);
    expect(req.request.method).toBe('PUT');
    req.event(new HttpResponse<boolean>({body: true}));
  });

});
