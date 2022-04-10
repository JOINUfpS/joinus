import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ListCategoryComponent} from './list-category.component';
import {ConfirmationService, MessageService} from 'primeng/api';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {ConstPermissions} from '../../../../utilities/string/security/const-permissions';
import {CategoryService} from '../../../../services/utility/category.service';
import {CategoryAdapter} from '../../../../adapters/implementation/utility/category.adapter';
import {ConfigTables} from '../../../../utilities/config-tables.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {HttpClient} from '@angular/common/http';
import {OpportunityService} from '../../../../services/institution/opportunity.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {UserModel} from '../../../../models/user/user.model';
import {ProjectModel} from '../../../../models/user/project.model';

xdescribe('ListCategoryComponent', () => {
  let component: ListCategoryComponent;
  let fixture: ComponentFixture<ListCategoryComponent>;
  let categoryAdapter: CategoryAdapter;
  let utilities: UtilitiesConfigString;
  let service: OpportunityService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ListCategoryComponent],
      providers: [ConfirmationService,
        UtilitiesConfigString,
        ConstPermissions,
        CategoryService,
        CategoryAdapter,
        ConfigTables,
        MessagerService,
        MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    categoryAdapter = TestBed.inject(CategoryAdapter);
    utilities = TestBed.inject(UtilitiesConfigString);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(OpportunityService);
    utilities = TestBed.inject(UtilitiesConfigString);
    utilities.ls.set('user', new UserModel(
      '7be4a36b-4dfb-430b-a18e-32b9ebbc955b',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'Universidad Francisco de Paula Santander',
      'Romarte que va amarte',
      'romarte07@ufps.edu.co',
      true,
      'Regular',
      [],
      null,
      'Esta es la intro del usuario pruebas',
      ['Peliculas'],
      '',
      null,
      'Hombre',
      {
        id: 'f7c0a516-baee-4e3e-b4d2-5db6b3f8abe9',
        careerName: 'Análisis de Datos para la Investigación Científica'
      },
      [new ProjectModel('f7c0a516-baee-4e3e-b4d2-5db6b3f8abe9',
        'Análisis de Datos para la Investigación Científica',
        '',
        new Date(),
        new Date(),
        '')],
      '',
      [],
      {
        id: 48,
        name: 'Colombia',
        iso2: 'CO'
      },
      {
        id: 2877,
        name: 'Norte de Santander',
        iso2: 'NSA'
      },
      {
        id: 20772,
        name: 'Cúcuta'
      },
      'Inactivo'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create columns', () => {
    component.ngOnInit();
    const columns = [
      {field: 'cateName', header: 'Nombre'},
      {field: 'cateDescription', header: 'Descripción'},
      {field: 'cateType', header: 'Tipo'},
      {field: 'actions', header: ''}
    ];
    expect((component as any).cols).toEqual(columns);
  });

});
