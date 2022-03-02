import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CreateEditOpportunityComponent} from './create-edit-opportunity.component';
import {UtilityRichText} from '../../../../utilities/utility-rich-text';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {CategoryService} from '../../../../services/utility/category.service';
import {CategoryAdapter} from '../../../../adapters/implementation/utility/category.adapter';
import {OpportunityService} from '../../../../services/institution/opportunity.service';
import {OpportunityAdapter} from '../../../../adapters/implementation/institutions/opportunity.adapter';
import {GeographicalLocationService} from '../../../../services/utility/geographical-location.service';
import {FileService} from '../../../../services/file/file.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../../../utilities/string/const-string';
import {MessageService} from 'primeng/api';
import {OpportunityModel} from '../../../../models/institutions/opportunity.model';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('CreateEditOpportunityComponent', () => {
  let component: CreateEditOpportunityComponent;
  let fixture: ComponentFixture<CreateEditOpportunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CreateEditOpportunityComponent],
      providers: [UtilityRichText,
        UtilitiesConfigString,
        CategoryService,
        CategoryAdapter,
        OpportunityService,
        OpportunityAdapter,
        DatePipe,
        ConstString,
        GeographicalLocationService,
        FileService,
        MessagerService,
        MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be show create edit opportunity dialog', () => {
    component.ngOnInit();
    const data = new OpportunityModel('90e18070-ce97-40b8-a2db-efdc89afa8fa',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'string',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      'string',
      'string',
      new Date(),
      'user@example.com',
      false,
      'string',
      {
        id: 'b8cca0cd-147e-47f1-96b6-ead94f421369',
        instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        cateName: 'Conferencia',
        cateDescription: 'El usuario puede subir videos, imagenes o documentos de la conferencia que pretende publicar',
        cateType: 'Documento',
        cateStatus: 'Activo'
      },
      [{
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        fileExtension: '.jpg',
        filePath: '',
        fileSize: '',
        fileType: ''
      }],
      ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      {},
      {},
      {},
      'string',
      new Date());
    component.show(data);
    expect(( component as any).display).toEqual( true);
    expect(( component as any).opportunity).toEqual(data);
    expect(( component as any).showEditBtn).toEqual(true);

  });

  it('should change error class employer email', () => {
    component.ngOnInit();
    component.errorClassEmployerEmail = 'ui-inputtext class-error';
    component.clearErrorClassEmployerEmail();
    expect(( component as any).errorClassEmployerEmail).toEqual('ui-inputtext');
  });

  it('should change error class application url', () => {
    component.ngOnInit();
    component.errorClassApplicationUrl = 'ui-inputtext class-error';
    component.clearErrorClassApplicationUrl();
    expect(( component as any).errorClassApplicationUrl).toEqual('ui-inputtext');
  });

  it('should change error class employer email', () => {
    component.ngOnInit();
    component.errorClassExpirationDate = 'error-date-field';
    component.clearErrorExpirationDate();
    expect(( component as any).errorClassExpirationDate).toEqual('');
  });

  it('should clear files upload', () => {
    component.ngOnInit();
    component.imgChange = 'Esto seria una imagen';
    component.clearFilesUpload();
    expect(( component as any).imgChange).toEqual(null);
  });

  it('should format department', () => {
    component.preDeparmentOpportunity = [
      {
        id: 2874,
        name: 'Department Quindío',
        iso2: 'QUI'
      },
      {
        id: 2875,
        name: 'Department Cundinamarca',
        iso2: 'CUN'
      },
      {
        id: 2876,
        name: 'Department Chocó',
        iso2: 'CHO'
      },
      {
        id: 2877,
        name: 'Department Norte de Santander',
        iso2: 'NSA'
      }
    ];
    const responseList = [
      {
        id: 2874,
        name: 'Department Quindío',
        iso2: 'QUI'
      },
      {
        id: 2875,
        name: 'Department Cundinamarca',
        iso2: 'CUN'
      },
      {
        id: 2876,
        name: 'Department Chocó',
        iso2: 'CHO'
      },
      {
        id: 2877,
        name: 'Department Norte de Santander',
        iso2: 'NSA'
      }
    ];
    component.formatDeparment();
    expect(( component as any).departmentOpportunity).toEqual(responseList);
  });

});
