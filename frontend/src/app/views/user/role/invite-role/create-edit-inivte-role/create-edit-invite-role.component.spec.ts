import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MessagerService} from '../../../../../messenger/messager.service';
import {UtilitiesConfigString} from '../../../../../utilities/utilities-config-string.service';
import {RoleService} from '../../../../../services/user/role.service';
import {RoleAdapter} from '../../../../../adapters/implementation/user/role.adapter';
import {InviteRoleService} from '../../../../../services/user/invite-role.service';
import {InviteRoleAdapter} from '../../../../../adapters/implementation/user/invite-role.adapter';
import {UsersService} from '../../../../../services/user/user.service';
import {UserAdapter} from '../../../../../adapters/implementation/user/user.adapter';
import {MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {ProjectAdapter} from '../../../../../adapters/implementation/user/project.adapter';
import {ConstString} from '../../../../../utilities/string/const-string';
import {CreateEditInivteRoleComponent} from './create-edit-inivte-role.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CreateEditInivteRole', () => {
  let component: CreateEditInivteRoleComponent;
  let fixture: ComponentFixture<CreateEditInivteRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CreateEditInivteRoleComponent],
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
        MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditInivteRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form to create and edit invite role', () => {
    component.ngOnInit();
    const createEditForm = component.form;
    const createEditFormValues = {
      user: null,
      role: null
    };
    expect(createEditForm.value).toEqual(createEditFormValues);
  });

  it('should be show create edit invite role dialog', () => {
    component.ngOnInit();
    const data = {
      id: '07a3f0a6-2a04-46c0-818a-6999cba8f629',
      instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      userId: '8d9f8558-a7e0-4b15-a47c-874f33c6e2a9',
      roleId: null,
      inroStatus: 'Pendiente',
      inroType: 'Estándar',
      userName: 'Yindy Paola Pájaro Urquijo',
      roleName: null,
      userEmail: 'yindypaolapu@ufps.edu.co',
      commId: null,
      cousId: null,
      commName: ''
    };
    component.show(data);
    expect(( component as any).display).toEqual( true);
    expect(( component as any).inviteRole).toEqual(data);
    expect(( component as any).showEditBtn).toEqual(true);
  });

});
