import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EditUserComponent} from './edit-user.component';
import {MessagerService} from '../../../../messenger/messager.service';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {RoleService} from '../../../../services/user/role.service';
import {RoleAdapter} from '../../../../adapters/implementation/user/role.adapter';
import {InviteRoleService} from '../../../../services/user/invite-role.service';
import {InviteRoleAdapter} from '../../../../adapters/implementation/user/invite-role.adapter';
import {UsersService} from '../../../../services/user/user.service';
import {UserAdapter} from '../../../../adapters/implementation/user/user.adapter';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {ProjectAdapter} from '../../../../adapters/implementation/user/project.adapter';
import {ConstString} from '../../../../utilities/string/const-string';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EditUserComponent],
      providers: [MessagerService,
        UtilitiesConfigString,
        RoleService,
        RoleAdapter,
        InviteRoleService,
        InviteRoleAdapter,
        UsersService,
        UserAdapter,
        ProjectAdapter,
        DatePipe,
        ConstString,
        MessageService,
        ConfirmationService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form edit user', () => {
    component.ngOnInit();
    const editFormUser = component.form;
    const editFormUserValues = {
      userRole: null
    };
    expect(editFormUser.value).toEqual(editFormUserValues);
  });

  it('should be show edit user dialog', () => {
    component.ngOnInit();
    const data = {
      user: {
        id: '4a74c6bf-59a2-4270-8bb3-96f194363a46',
        instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        instName: 'Universidad Francisco de Paula Santander',
        username: 'Fernando Romero',
        userEmail: 'juanfernandoro@ufps.edu.co',
        userProvider: 'regular',
        userRole: [{}],
        userRoleStructure: {},
        roleActive: null,
        userAdmin: false,
        userIntro: 'Hola!, Mi meta es tener libertad financiera.',
        userInterest: [],
        userPhone: '3003719983',
        userPhoto: '047360c3-8991-4cb2-b756-06320be46a8e',
        userGender: 'Hombre',
        userDegree: {
          id: '747cb17c-2a51-4f66-8df1-0dcb7b6f201c',
          careerName: 'Derecho'
        },
        userProjects: [],
        user_curriculum_vitae: '93fb4994-e45b-462f-9e88-93e0758481dd',
        user_skill: [
          'finanzas personales',
          'gestion de tiempo'
        ],
        userCountry: {
          id: 48,
          name: 'Colombia',
          iso2: 'CO'
        },
        userDepartment: {
          id: 2877,
          name: 'Norte de Santander',
          iso2: 'NSA'
        },
        userMunicipality: {
          id: 20772,
          name: 'Cúcuta'
        },
        user_status: 'Activo'
      }
    };
    component.show(data.user);
    expect((component as any).display).toEqual(true);
    expect((component as any).user).toEqual(data.user);
  });

});
