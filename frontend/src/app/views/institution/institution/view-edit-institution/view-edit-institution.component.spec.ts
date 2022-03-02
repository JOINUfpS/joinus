import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ViewEditInstitutionComponent} from './view-edit-institution.component';
import {InstitutionAdapter} from '../../../../adapters/implementation/institutions/institution.adapter';
import {InstitutionService} from '../../../../services/institution/institution.service';
import {ConstModules} from '../../../../utilities/string/security/const-modules';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {ConstPermissions} from '../../../../utilities/string/security/const-permissions';
import {FileService} from '../../../../services/file/file.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {MessageService} from 'primeng/api';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {UserModel} from '../../../../models/user/user.model';
import {ProjectModel} from '../../../../models/user/project.model';


xdescribe('CreateEditInstitutionComponent', () => {
  let component: ViewEditInstitutionComponent;
  let fixture: ComponentFixture<ViewEditInstitutionComponent>;
  let utilities: UtilitiesConfigString;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ViewEditInstitutionComponent],
      providers: [InstitutionAdapter,
        InstitutionService,
        ConstModules,
        UtilitiesConfigString,
        ConstPermissions,
        FileService,
        MessagerService,
        MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditInstitutionComponent);
    component = fixture.componentInstance;
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
    utilities = TestBed.inject(UtilitiesConfigString);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
