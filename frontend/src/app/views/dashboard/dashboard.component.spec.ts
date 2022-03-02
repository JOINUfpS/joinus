import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardComponent} from './dashboard.component';
import {FollowUserServices} from '../../services/user/follow_user.services';
import {FollowUserAdapter} from '../../adapters/implementation/user/follow-user.adapter';
import {LoadingService} from '../../services/loading/loading.service';
import {PublicationService} from '../../services/publication/publication.service';
import {PublicationAdapter} from '../../adapters/implementation/publication/publication.adapter';
import {ConstModules} from '../../utilities/string/security/const-modules';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {DatePipe} from '@angular/common';
import {ProjectAdapter} from '../../adapters/implementation/user/project.adapter';
import {ConstString} from '../../utilities/string/const-string';
import {UserModel} from '../../models/user/user.model';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DashboardComponent],
      providers: [FollowUserServices,
        UtilitiesConfigString,
        FollowUserAdapter,
        LoadingService,
        PublicationService,
        PublicationAdapter,
        ProjectAdapter,
        DatePipe,
        ConstString,
        ConstModules]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.userSession = new UserModel('4a74c6bf-59a2-4270-8bb3-96f194363a46',
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
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
