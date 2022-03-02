import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectComponent} from './project.component';
import {ConfirmationService, MessageService} from 'primeng/api';
import {UsersService} from '../../../services/user/user.service';
import {ProjectAdapter} from '../../../adapters/implementation/user/project.adapter';
import {UserAdapter} from '../../../adapters/implementation/user/user.adapter';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {MessagerService} from '../../../messenger/messager.service';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../../utilities/string/const-string';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ProjectComponent ],
      providers: [ConfirmationService,
        UsersService,
        ProjectAdapter,
        DatePipe,
        UserAdapter,
        ConstString,
        UtilitiesConfigString,
        MessagerService,
        MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should see description see more', () => {
    component.ngOnInit();
    component.labelSeeAbstract = 'Ver más';
    component.seeDescription();
    expect((component as any).labelSeeAbstract).toEqual('Ver más');
  });

  it('should see description see less', () => {
    component.ngOnInit();
    component.labelSeeAbstract = 'Ver menos';
    component.seeDescription();
    expect((component as any).labelSeeAbstract).toEqual('Ver menos');
  });

});
