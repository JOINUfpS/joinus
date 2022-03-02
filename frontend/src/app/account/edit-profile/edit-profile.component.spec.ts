import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditProfileComponent} from './edit-profile.component';
import {MessagerService} from '../../messenger/messager.service';
import {ProjectAdapter} from '../../adapters/implementation/user/project.adapter';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../utilities/string/const-string';
import {MessageService} from 'primeng/api';
import {UsersService} from '../../services/user/user.service';
import {UserAdapter} from '../../adapters/implementation/user/user.adapter';
import {FileService} from '../../services/file/file.service';
import {GeographicalLocationService} from '../../services/utility/geographical-location.service';
import {UniversityCareerService} from '../../services/utility/university-career.service';
import {UniversityCareerAdapter} from '../../adapters/implementation/utility/universityCareer.adapter';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {UtilityRichText} from '../../utilities/utility-rich-text';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {UserModel} from '../../models/user/user.model';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  const user = new UserModel('4a74c6bf-59a2-4270-8bb3-96f194363a46',
    '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    'Universidad Francisco de Paula Santander',
    'Fernando Romero',
    'juanfernandoro@ufps.edu.co',
    true,
    'Regular',
    [],
    null,
    'Hola!, Mi meta es tener libertad financiera.',
    [],
    '3003719983',
    '047360c3-8991-4cb2-b756-06320be46a8e',
    'Hombre',
    {
      id: '747cb17c-2a51-4f66-8df1-0dcb7b6f201c',
      careerName: 'Derecho'
    },
    [],
    '93fb4994-e45b-462f-9e88-93e0758481dd',
    ['finanzas personales', 'gestion de tiempo'],
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
    'Activo');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EditProfileComponent],
      providers: [UsersService,
        UserAdapter,
        FileService,
        GeographicalLocationService,
        UniversityCareerService,
        UniversityCareerService,
        UniversityCareerAdapter,
        UtilitiesConfigString,
        UtilityRichText,
        ProjectAdapter,
        DatePipe,
        ConstString,
        MessagerService,
        MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process dialog to show projects', () => {
    component.processDialogToShow('projects', user);
    expect(component.editingProject).toEqual(false);
  });

  it('should process dialog to show general', () => {
    component.processDialogToShow('general', user);
    expect(component.editProfileDialogDisplay).toEqual(true);
  });

  it('should process dialog to show intro', () => {
    component.processDialogToShow('intro', user);
    expect(component.editProfileDialogDisplay).toEqual(true);
  });

  it('should process dialog to show interest', () => {
    component.processDialogToShow('interest', user);
    expect(component.editProfileDialogDisplay).toEqual(true);
  });

  it('should process dialog to show skill', () => {
    component.processDialogToShow('skill', user);
    expect(component.editProfileDialogDisplay).toEqual(true);
  });

  it('should process dialog to show curriculum vitae', () => {
    component.processDialogToShow('curriculum vitae', user);
    expect(component.editProfileDialogDisplay).toEqual(true);
  });

});
