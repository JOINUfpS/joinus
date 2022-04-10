import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ListRoleComponent} from './list-role.component';
import {ContainerComponent} from '../../../container/container.component';
import {MessagerService} from '../../../../messenger/messager.service';
import {RoleService} from '../../../../services/user/role.service';
import {ModulesService} from '../../../../services/user/modules.service';
import {RoleAdapter} from '../../../../adapters/implementation/user/role.adapter';
import {ConfirmationService, MessageService} from 'primeng/api';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {ConfigTables} from '../../../../utilities/config-tables.service';
import {ModulesAdapter} from '../../../../adapters/implementation/user/modules.adapter';
import {ConstPermissions} from '../../../../utilities/string/security/const-permissions';
import {HttpClientTestingModule} from '@angular/common/http/testing';

xdescribe('ListRoleComponent', () => {
  let component: ListRoleComponent;
  let fixture: ComponentFixture<ListRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ListRoleComponent],
      providers: [ContainerComponent,
        MessagerService,
        MessageService,
        RoleService,
        ModulesService,
        RoleAdapter,
        ConfirmationService,
        UtilitiesConfigString,
        ConfigTables,
        ModulesAdapter,
        ConstPermissions]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
