import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ListInviteRoleComponent} from './list-invite-role.component';
import {ConfirmationService, MessageService} from 'primeng/api';
import {MessagerService} from '../../../../../messenger/messager.service';
import {UtilitiesConfigString} from '../../../../../utilities/utilities-config-string.service';
import {InviteRoleService} from '../../../../../services/user/invite-role.service';
import {InviteRoleAdapter} from '../../../../../adapters/implementation/user/invite-role.adapter';
import {ConfigTables} from '../../../../../utilities/config-tables.service';
import {ConstPermissions} from '../../../../../utilities/string/security/const-permissions';
import {HttpClientTestingModule} from '@angular/common/http/testing';


xdescribe('ListInviteRoleComponent', () => {
  let component: ListInviteRoleComponent;
  let fixture: ComponentFixture<ListInviteRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ListInviteRoleComponent],
      providers: [ConfirmationService,
        UtilitiesConfigString,
        InviteRoleService,
        InviteRoleAdapter,
        ConfigTables,
        ConstPermissions,
        MessagerService,
        MessageService,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInviteRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
