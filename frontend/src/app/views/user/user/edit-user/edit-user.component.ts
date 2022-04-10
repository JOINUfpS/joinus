import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserModel} from '../../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {Status} from '../../../../utilities/status';
import {RoleService} from '../../../../services/user/role.service';
import {RoleAdapter} from '../../../../adapters/implementation/user/role.adapter';
import {RoleModel} from '../../../../models/user/role.model';
import {InviteRoleService} from '../../../../services/user/invite-role.service';
import {InviteRoleAdapter} from '../../../../adapters/implementation/user/invite-role.adapter';
import {MessagerService} from '../../../../messenger/messager.service';
import {UsersService} from '../../../../services/user/user.service';
import {UserAdapter} from '../../../../adapters/implementation/user/user.adapter';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user: UserModel;
  form: FormGroup;
  display: boolean;
  rolesInfo: SelectItem[] = [];
  statusOptions: any = Object.keys(Status).map(key => ({id: key, name: Status[key]}));
  uploadedFiles;
  imgChange: string;
  @Output()
  updateUser: EventEmitter<UserModel> = new EventEmitter();
  @Input()
  permissions: any;
  roles: RoleModel[];
  listUniversityCareers: Array<any>;
  buttonActioned: boolean;
  displayDialog: boolean;
  checkedUserAdmin: boolean;
  private userHadRoles: boolean;

  constructor(
    private messagerService: MessagerService,
    public utilitiesString: UtilitiesConfigString,
    public roleService: RoleService,
    private inviteRoleService: InviteRoleService,
    private confirmationService: ConfirmationService,
    private userService: UsersService,
    private userAdapter: UserAdapter,
    private inviteRoleAdapter: InviteRoleAdapter) {
    this.display = false;
    this.buttonActioned = false;
    this.displayDialog = false;
    this.checkedUserAdmin = false;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      userName: new FormControl({value: null, disabled: true}, [Validators.required, Validators.maxLength(100)]),
      userEmail: new FormControl({value: null, disabled: true}, [Validators.required, Validators.maxLength(100)]),
      userPhone: new FormControl({value: null, disabled: true}, [Validators.required, Validators.maxLength(100)]),
      userRole: new FormControl({value: null, disabled: false}, []),
      userDegree: new FormControl({value: null, disabled: true}, [Validators.required, Validators.maxLength(100)]),
      userStatus: new FormControl({value: null, disabled: true}, [Validators.required, Validators.maxLength(100)]),
    });
  }

  show(user): void {
    this.user = user;
    this.setData();
    this.userHadRoles = this.user.userRole.length > 0 || this.user.userAdmin;
    this.imgChange = this.utilitiesString.getImage(this.user.userPhoto + '/');
    this.display = true;
  }

  setData(): void {
    this.form.get('userName').setValue(this.user ? this.user.userName : null);
    this.form.get('userEmail').setValue(this.user ? this.user.userEmail : null);
    this.form.get('userPhone').setValue(this.user ? this.user.userPhone : null);
    this.form.get('userDegree').setValue(this.user ? this.user.userDegree.careerName : null);
    this.form.get('userStatus').setValue(this.user ? this.user.userStatus : null);
    this.checkedUserAdmin = this.user.userAdmin;
    this.getRoles(this.user);
  }

  getRoles(data): void {
    const roleAdapter = new RoleAdapter(this.utilitiesString);
    this.roleService.listRoles().then(res => {
      this.roles = roleAdapter.adaptList(res.data);
      const userRoleShow = [];
      this.roles.forEach(role => {
        data.userRole.forEach(userRole => {
          if (role.roleName === userRole.roleName) {
            userRoleShow.unshift(role);
          }
        });
      });
      this.form.get('userRole').setValue(userRoleShow ? userRoleShow : null);
    });
  }

  processUpdateRoles(): void {
    this.buttonActioned = true;
    const rolesForm = this.form.get('userRole').value;
    if (this.userHadRoles && rolesForm.length === 0 && !this.checkedUserAdmin) {
      this.revokeRoles();
    } else if (rolesForm.length > 0 || this.checkedUserAdmin) {
      const dataRoles = {roles: rolesForm, user: this.user};
      this.assignRoleOrRoles(dataRoles);
    } else {
      this.buttonActioned = false;
      this.messagerService.showToastLarge(EnumLevelMessage.INFO, 'Debe realizar algún cambio en la secciones de roles. De lo contrario cierre esta ventana');
    }
  }

  private assignRoleOrRoles(dataRoles): void {
    const body = this.inviteRoleAdapter.adaptBodyToAssignRoles(this.user.id, this.checkedUserAdmin, dataRoles);
    this.inviteRoleService.assignRoles(body)
      .then(res => {
        if (res.status) {
          this.user = this.userAdapter.adaptObjectReceive(res.data);
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, res.message);
          this.updateUser.emit(this.user);
          this.display = false;
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      }).finally(() => {
      this.buttonActioned = false;
    });
  }

  private revokeRoles(): void {
    this.confirmationService.confirm({
      message: 'Si no seleccionas ningún rol, el usuario perderá todos los roles que tenía. Por favor confirma esta decisión',
      header: 'Confirmar revocación de roles',
      icon: 'bi bi-exclamation-triangle-fill color-icon-fill-yellow',
      accept: () => {
        const body = this.inviteRoleAdapter.adaptObjectToRevokeRoles();
        this.inviteRoleService.revokeRoles(this.user.id, body)
          .then(res => {
            if (res.status) {
              this.user = this.userAdapter.adaptObjectReceive(res.data);
              this.updateUser.emit(this.user);
              this.messagerService.showToast(EnumLevelMessage.SUCCESS, res.message);
              this.display = false;
            } else {
              this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
            }
          })
          .finally(() => {
            this.buttonActioned = false;
          });
      }, reject: () => {
        this.buttonActioned = false;
      }
    });
  }

  showExplainUserAdmin(): void {
    if (!this.checkedUserAdmin) {
      this.displayDialog = false;
    } else {
      this.displayDialog = !this.displayDialog;
    }
  }
}
