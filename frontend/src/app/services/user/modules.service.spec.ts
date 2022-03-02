import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {ModulesService} from './modules.service';
import {ModulesAdapter} from '../../adapters/implementation/user/modules.adapter';


describe('ModulesService', () => {
  let service: ModulesService;
  let httpTestingController: HttpTestingController;
  let moduleAdapter: ModulesAdapter;
  const url = `${environment.userUrl}module/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ModulesService, UtilitiesConfigString, HttpClient]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ModulesService);
    moduleAdapter = TestBed.inject(ModulesAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be list all modules', () => {

    const expectedData = [
      {
        id: '79e53cd6-1670-41dc-906d-f9c6314a6668',
        modu_name: 'Categorias',
        modu_router: '/utilidades/categorias',
        modu_icon: 'category',
        modu_status: 'Activo',
        modu_permissions: [
          'Ver',
          'Crear',
          'Editar',
          'Borrar'
        ],
        modu_is_generic: false
      }
    ];

    const expectedDataAdapted = moduleAdapter.adaptList(expectedData);

    service.getModules().then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(moduleAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(`${url}?modu_is_generic=false`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

});
