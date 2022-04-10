import {Component, OnInit, ViewChild} from '@angular/core';
import {InviteRoleModel} from '../../../../../models/user/invite-role.model';
import {UtilitiesConfigString} from '../../../../../utilities/utilities-config-string.service';
import {InviteRoleService} from '../../../../../services/user/invite-role.service';
import {InviteRoleAdapter} from '../../../../../adapters/implementation/user/invite-role.adapter';
import {ConfigTables} from '../../../../../utilities/config-tables.service';
import {CreateEditInivteRoleComponent} from '../create-edit-inivte-role/create-edit-inivte-role.component';
import {ConfirmationService} from 'primeng/api';
import {TypeInviteRole} from '../../../../../utilities/types';
import {MessagerService} from '../../../../../messenger/messager.service';
import {ConstModules} from '../../../../../utilities/string/security/const-modules';
import {ConstPermissions} from '../../../../../utilities/string/security/const-permissions';
import {EnumLevelMessage} from '../../../../../messenger/enum-level-message.enum';
import {ConstString} from '../../../../../utilities/string/const-string';

@Component({
  selector: 'app-list-invite-role',
  templateUrl: './list-invite-role.component.html'
})
export class ListInviteRoleComponent implements OnInit {

  public permissions: string[];
  public cols: any[];
  public totalRecords = 0;
  public inviteRoles: InviteRoleModel[];
  private paginator: any;

  @ViewChild('dt', {static: false}) dt: any;
  @ViewChild('modalInviteRole', {static: false}) modalInviteRole: CreateEditInivteRoleComponent;

  constructor(
    private confirmationService: ConfirmationService,
    public utilitiesString: UtilitiesConfigString,
    private inviteRoleService: InviteRoleService,
    private inviteRoleAdapter: InviteRoleAdapter,
    public configTables: ConfigTables,
    public constPermissions: ConstPermissions,
    private messagerService: MessagerService) {
    this.inviteRoles = [];
    this.permissions = utilitiesString.ls.get('permissions')
      .find(element => element.moduName === ConstModules.ROLE_INVITATION).moduPermissions;
  }

  ngOnInit(): void {
    this.cols = [
      {field: 'userName', header: 'Nombre usuario', class: 'text-view'},
      {field: 'roleName', header: 'Nombre rol', class: 'text-view'},
      {field: 'userEmail', header: 'Correo usuario', class: 'text-view'},
      {field: 'status', header: 'Estado'},
      {field: 'actions', header: 'Acciones'}
    ];

    this.getInviteRoles();
  }

  getInviteRoles(): void {
    this.inviteRoleService.listInviteRole(TypeInviteRole.STANDARD).then(res => {
      this.inviteRoles = this.inviteRoleAdapter.adaptList(res.data);
      this.paginator = res.paginator;
      this.totalRecords = res.paginator.count;
    }).finally(() => {
      this.bringPaginatedInviteRoles();
    });
  }

  bringPaginatedInviteRoles(): void {
    if (this.paginator.next !== null && this.paginator.next !== undefined) {
      this.inviteRoleService.listInviteRolesWithPagination(this.paginator).then(res => {
        this.inviteRoles = this.inviteRoles.concat(this.inviteRoleAdapter.adaptList(res.data));
        this.paginator = res.paginator;
      }).finally(() => {
        this.bringPaginatedInviteRoles();
      });
    }
  }

  addOrEdit(data): void {
    if (data !== null) {
      this.modalInviteRole.show(data);
    } else {
      this.modalInviteRole.show(null);
    }
  }

  delete(inviteRole: InviteRoleModel): void {
    this.confirmationService.confirm({
      message: ConstString.CONFIRM_DELETE + 'la invitación a ' + inviteRole.userName + '?',
      icon: 'bi bi-exclamation-triangle-fill color-icon-fill-yellow',
      accept: () => {
        this.inviteRoleService.deleteInviteRole(inviteRole.id)
          .then(_ => {
            this.deleteInviteRoleFromView(inviteRole);
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Invitación eliminada');
          });
      }
    });
  }

  private deleteInviteRoleFromView(inviteRole: InviteRoleModel): void {
    let inviteRolesCloned: InviteRoleModel [] = [];
    inviteRolesCloned = inviteRolesCloned.concat(this.inviteRoles);
    const indexInviteRole = inviteRolesCloned.findIndex(inviteRoleFind => inviteRoleFind.id === inviteRole.id);
    inviteRolesCloned.splice(indexInviteRole, 1);
    this.inviteRoles = inviteRolesCloned;
  }

  authorizeRole(inviteRole: InviteRoleModel): void {
    if (inviteRole.roleName === null && inviteRole.roleId === null) {
      this.messagerService.showToast(EnumLevelMessage.ERROR, 'Debe editar la invitación y seleccionar un rol a asignar.');
    } else {
      this.inviteRoleService.authorizeRole(this.inviteRoleAdapter.adaptObjectSend(inviteRole))
        .then(_ => {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS,
            'La invitación a' + inviteRole.userName +
            ' fue autorizada con éxito.');
          this.getInviteRoles();
        });
    }
  }

}
