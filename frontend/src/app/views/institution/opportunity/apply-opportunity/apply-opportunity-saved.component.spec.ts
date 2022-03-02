import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {OpportunityService} from '../../../../services/institution/opportunity.service';
import {OpportunityAdapter} from '../../../../adapters/implementation/institutions/opportunity.adapter';
import {MessagerService} from '../../../../messenger/messager.service';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../../../utilities/string/const-string';
import {MessageService} from 'primeng/api';
import {ApplyOpportunityComponent} from './apply-opportunity.component';
import {OpportunityModel} from '../../../../models/institutions/opportunity.model';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('ApplyOpportunityComponent', () => {
  let component: ApplyOpportunityComponent;
  let fixture: ComponentFixture<ApplyOpportunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ApplyOpportunityComponent],
      providers: [UtilitiesConfigString,
        OpportunityService,
        OpportunityAdapter,
        DatePipe,
        ConstString,
        MessagerService,
        MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.opportunity.oppoTitle = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show dialog', () => {
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
    expect((component as any).applydisplay).toEqual(true);
    expect((component as any).opportunity).toEqual(data);
    expect((component as any).showEditBtn).toEqual(true);
    expect((component as any).validFile).toEqual(false);
  });

  it('should apply opportunity', () => {
    component.uploadedFiles = [];
    component.applyOpportunity();
    expect((component as any).buttonFormActioned).toEqual(true);
  });

});
