import {TestBed} from '@angular/core/testing';
import {CategoryService} from './category.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CategoryModel} from '../../models/utility/category.model';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {CategoryAdapter} from '../../adapters/implementation/utility/category.adapter';


describe('CategoryService', () => {
  let service: CategoryService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let categoryAdapter: CategoryAdapter;
  const url = `${environment.utilityUrl}category/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService, UtilitiesConfigString, HttpClient]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CategoryService);
    categoryAdapter = TestBed.inject(CategoryAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be list all categories', () => {

    const expectedData = [
      {
        id: '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1',
        instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        cateName: 'Articulo en revista',
        cateDescription: '',
        cateType: 'Documento',
        cateStatus: 'Activo'
      },
      {
        id: 'b8cca0cd-147e-47f1-96b6-ead94f421369',
        instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        cateName: 'Conferencia',
        cateDescription: 'El usuario puede subir videos, imagenes o documentos de la conferencia que pretende publicar',
        cateType: 'Documento',
        cateStatus: 'Activo'
      }
    ];

    const expectedDataAdapted = categoryAdapter.adaptList(expectedData);

    service.listAllCategories().then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(categoryAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be list all categories by type', () => {
    const urlService = `${url}?inst_id=3fa85f64-5717-4562-b3fc-2c963f66afa6&cate_type=Comunidad`;

    const expectedData = [
      {
        id: '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1',
        instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        cateName: 'Articulo en revista',
        cateDescription: '',
        cateType: 'Comunidad',
        cateStatus: 'Activo'
      },
      {
        id: 'b8cca0cd-147e-47f1-96b6-ead94f421369',
        instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        cateName: 'Conferencia',
        cateDescription: 'El usuario puede subir videos, imagenes o documentos de la conferencia que pretende publicar',
        cateType: 'Comunidad',
        cateStatus: 'Activo'
      }
    ];

    const expectedDataAdapted = categoryAdapter.adaptList(expectedData);

    service.listAllCategoryByType('Comunidad').then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(categoryAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(urlService);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should be list with pagination', () => {

    const expectedData = [
      {
        id: '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1',
        instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        cateName: 'Articulo en revista',
        cateDescription: '',
        cateType: 'Documento',
        cateStatus: 'Activo'
      },
      {
        id: 'b8cca0cd-147e-47f1-96b6-ead94f421369',
        instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        cateName: 'Conferencia',
        cateDescription: 'El usuario puede subir videos, imagenes o documentos de la conferencia que pretende publicar',
        cateType: 'Documento',
        cateStatus: 'Activo'
      }
    ];

    const paginator = {
      count: 21,
      next: 'http://127.0.0.1:8095/utilities/api/category/?limit=20&offset=20',
      previous: null
    };

    const expectedDataAdapted = categoryAdapter.adaptList(expectedData);

    service.listCategoriesWithPagination(paginator).then(response => {
      expect(response).toEqual(expectedData);
      expect(expectedDataAdapted).toEqual(categoryAdapter.adaptList(response));
    });

    const req = httpTestingController.expectOne(paginator.next);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('Should be create category', () => {

    const category = new CategoryModel('90e18070-ce97-40b8-a2db-efdc89afa8fa',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Diseño',
      'El estudiante puede agregar imagenes de sus diseños y compartirlos con los demas',
      'Documento',
      'Activo');

    const expectedDataAdapted = categoryAdapter.adaptObjectSend(category);

    service.saveCategory(category).then(response => {
      expect(typeof response).toBe('boolean');
      expect(expectedDataAdapted).toEqual(categoryAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be update category', () => {

    const category = new CategoryModel('90e18070-ce97-40b8-a2db-efdc89afa8fa',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Diseño',
      'El estudiante puede agregar imagenes de sus diseños y compartirlos con los demas',
      'Documento',
      'Activo');

    const expectedDataAdapted = categoryAdapter.adaptObjectSend(category);

    service.updateCategory(category).then(response => {
      expect(typeof response).toBe('boolean');
      expect(expectedDataAdapted).toEqual(categoryAdapter.adaptObjectReceive(response));
    });

    const req = httpTestingController.expectOne(`${url}${category.id}/`);
    expect(req.request.method).toBe('PUT');
    req.event(new HttpResponse<boolean>({body: true}));
  });

  it('Should be delete category', () => {
    const urlService = `${url}7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1/`;

    service.deleteCategory('7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1').then(respuesta => {
      expect(typeof respuesta).toBe('boolean');
    });

    const req = httpTestingController.expectOne(urlService);
    expect(req.request.method).toBe('DELETE');
    req.event(new HttpResponse<boolean>({body: true}));

  });

});
