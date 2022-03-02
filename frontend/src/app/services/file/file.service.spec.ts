import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {FileService} from './file.service';


describe('FileService', () => {
  let service: FileService;
  let httpTestingController: HttpTestingController;
  const url = `${environment.fileUrl}file/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileService, HttpClient]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should be save file', () => {

    const file = {};

    service.saveFile(file).then(response => {
      expect(typeof response).toBe('boolean');
    });

    const req = httpTestingController.expectOne(`${url}put_object/`);
    expect(req.request.method).toBe('PUT');
    req.event(new HttpResponse<boolean>({body: true}));
  });

});
