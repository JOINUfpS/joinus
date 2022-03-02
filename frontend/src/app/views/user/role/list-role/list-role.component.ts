import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ContainerComponent} from '../../../container/container.component';
import {RoleService} from '../../../../services/user/role.service';
import {RoleModel} from '../../../../models/user/role.model';
import {ConfirmationService} from 'primeng/api';
import {RoleAdapter} from '../../../../adapters/implementation/user/role.adapter';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfigTables} from '../../../../utilities/config-tables.service';
import {ModulesModel} from '../../../../models/user/modules.model';
import {ModulesAdapter} from '../../../../adapters/implementation/user/modules.adapter';
import {ModulesService} from '../../../../services/user/modules.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {ConstModules} from '../../../../utilities/string/security/const-modules';
import {ConstPermissions} from '../../../../utilities/string/security/const-permissions';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';


@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html'
})
export class ListRoleComponent implements OnInit {

  public cols: any[];
  @Output()
  public roles: RoleModel[];
  public role: RoleModel;
  public isCreating: boolean;
  @ViewChild('dt', {static: false}) dt: any;
  public permissions: any[];
  public permissionStructure: string[];
  public updateList: EventEmitter<any> = new EventEmitter();
  public module: ModulesModel;
  public modules: ModulesModel[];
  public action: any;
  public actions: any;
  public allForm: FormGroup;
  public rolesPermissions: ModulesModel[];
  public errors = new Map();


  constructor(private app: ContainerComponent,
              private messagerService: MessagerService,
              private roleService: RoleService,
              private modulesService: ModulesService,
              private adapter: RoleAdapter,
              private confirmationService: ConfirmationService,
              private constModules: ConstModules,
              public utilitiesString: UtilitiesConfigString,
              public configTables: ConfigTables,
              public adapterModules: ModulesAdapter,
              public constPermissions: ConstPermissions) {
    this.cols = [{field: 'module', header: 'Módulo'}, {field: 'permission', header: 'Permiso'}, {
      field: 'actions',
      header: 'Acciones'
    }];
    this.roles = [];
    this.isCreating = false;
    this.permissions = [];
    this.permissionStructure = utilitiesString.ls.get('permissions')
      .find(element => element.moduName === constModules.ROLES).moduPermissions;
  }

  ngOnInit(): void {
    this.getRoles();
    this.getModules();
    this.buildForm();
  }

  getRoles(): void {
    this.roleService.listRoles()
      .then(res => {
        this.roles = this.adapter.adaptList(res.data);
      });
  }

  getModules(): void {
    this.modulesService.getModules()
      .then(res => {
        this.modules = this.adapterModules.adaptList(res.data);
      });
  }

  buildForm(): void {
    this.allForm = new FormGroup({
      roleName: new FormControl({value: null, disabled: false}, [Validators.required,
        Validators.maxLength(100)])
    });
  }

  getActions(): void {
    this.actions = [];
    this.action = [];
    this.module.moduPermissions.forEach(moduPermission => {
      const moduPermissionItem = {
        id: moduPermission,
        value: moduPermission
      };
      this.actions.push(moduPermissionItem);
    });
  }

  deleteRole(data): void {
    this.confirmationService.confirm({
      message: this.utilitiesString.msgConfirmDelete + 'el rol ' + data.roleName + '?',
      accept: () => {
        this.roleService.deleteRole(data.id)
          .then(_ => {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Rol Eliminado');
            this.permissions = [];
            this.getRoles();
          });
      }
    });
  }

  setRole(): void {
    this.rolesPermissions = this.adapterModules.adaptList(this.role.roleStructure);
    this.permissions = [];
    if (!this.rolesPermissions) {
      return;
    }
    this.rolesPermissions.forEach(rolePermission => {
      const moduleNew = rolePermission.moduName;
      rolePermission.moduPermissions.forEach(permissionItem => {
        this.permissions.push({
          id: rolePermission.id,
          module: moduleNew,
          permission: permissionItem
        });
      });
    });

  }

  newRole(): void {
    this.isCreating = true;
    this.role = undefined;
    this.actions = [];
    this.action = [];
    this.module = undefined;
  }

  cancelCreatingRole(): void {
    this.isCreating = false;
  }

  deletePermission(permission): void {

    this.confirmationService.confirm({
      message: '¿Realmente desea eliminar este permiso?',
      icon: 'bi bi-exclamation-triangle-fill color-icon-fill-yellow',
      accept: () => {
        this.permissions = this.permissions.filter(c => c.permission + c.module !== permission.permission + permission.module);
        this.savePermission().then();
      }
    });
  }

  addPermissions(): Promise<any> {
    return new Promise(async (resolve) => {
      if (this.action === undefined) {
        resolve(this.permissions);
        return;
      }

      this.action.forEach(actionItem => {
        if (!this.permissionExists(this.module.moduName, actionItem.value)) {
          const itemPermission = {
            id: this.module.id,
            module: this.module.moduName,
            permission: actionItem.value,
          };
          this.permissions.push(itemPermission);
        }
      });
      resolve(this.permissions);
    });
  }

  formatPermissions(): Promise<any> {
    return new Promise(async (resolve) => {
      const result = [];
      let itemPermission;
      let currentIdPermission = '';
      this.permissions.forEach(permission => {
        if (permission.id !== currentIdPermission) {
          if (currentIdPermission !== '') {
            result.push(itemPermission);
          }
          currentIdPermission = permission.id;
          itemPermission = {
            id: permission.id,
            perm_list: [],
          };
          itemPermission.perm_list.push(permission.permission);
        } else {
          itemPermission.perm_list.push(permission.permission);
        }
      });
      result.push(itemPermission);
      resolve(result);
    });
  }

  async savePermission(): Promise<void> {
    if (this.isCreating) {
      this.createPermission();
    } else {
      this.editPermission().then();
    }
  }

  createPermission(): void {
    this.roleService.saveRole(this.adapter.adaptObjectSend(this.allForm.value))
      .then(res => {
        if (res.status) {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Rol Creado');
          this.isCreating = false;
          this.getRoles();
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      })
      .catch(err => {
        this.errors = this.utilitiesString.catchValidationErrors(err);
      })
      .finally(() => {
        this.updateList.emit();
      });
  }

  async editPermission(): Promise<void> {
    await this.addPermissions();
    this.role.roleListModule = await this.formatPermissions();
    this.roleService.updateRole(this.adapter.adaptObjectSend(this.role))
      .then(res => {
        if (res.status) {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Rol Actualizado');
          this.isCreating = false;
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      })
      .catch(err => {
        this.errors = this.utilitiesString.catchValidationErrors(err);
      })
      .finally(() => {
        this.updateList.emit();
      });
  }

  private permissionExists(moduleName, action): boolean {
    const filteredPermissions = this.permissions.filter(c => c.module === moduleName && c.permission === action);
    return filteredPermissions.length > 0;
  }
}
