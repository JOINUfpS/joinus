import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserModel} from '../../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {SelectItem} from 'primeng/api';
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

  public user: UserModel;
  public form: FormGroup;
  public display: boolean;
  public rolesInfo: SelectItem[] = [];
  public statusOptions: any = Object.keys(Status).map(key => ({id: key, name: Status[key]}));
  public uploadedFiles;
  public imgChange: string;
  @Output()
  updateList: EventEmitter<any> = new EventEmitter();
  showEditBtn: boolean;
  @Input()
  permissions: any;
  public roles: RoleModel[];
  public listUniversityCareers: Array<any>;
  public becomeAdministrator: boolean;

  constructor(
    private messagerService: MessagerService,
    public utilitiesString: UtilitiesConfigString,
    public roleService: RoleService,
    private roleAdapter: RoleAdapter,
    private inviteRoleService: InviteRoleService,
    private inviteRoleAdapter: InviteRoleAdapter,
    private userService: UsersService,
    private userAdapter: UserAdapter) {
    this.display = false;
    this.becomeAdministrator = false;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      userName: new FormControl({value: null, disabled: true}, [Validators.required, Validators.maxLength(100)]),
      userEmail: new FormControl({value: null, disabled: true}, [Validators.required, Validators.maxLength(100)]),
      userPhone: new FormControl({value: null, disabled: true}, [Validators.required, Validators.maxLength(100)]),
      userRole: new FormControl({value: null, disabled: false}, []),
      userAdmin: new FormControl({value: null, disabled: false}, []),
      userDegree: new FormControl({value: null, disabled: true}, [Validators.required, Validators.maxLength(100)]),
      userStatus: new FormControl({value: null, disabled: true}, [Validators.required, Validators.maxLength(100)]),
    });
  }

  show(data): void {
    this.display = true;
    this.becomeAdministrator = data.becomeAdministrator;
    this.setData(data.user);
    this.user = data.user;
    this.imgChange = this.utilitiesString.getImage(this.user.userPhoto + '/');
    this.showEditBtn = true;
  }

  setData(data): void {
    this.form.get('userName').setValue(data ? data.userName : null);
    this.form.get('userEmail').setValue(data ? data.userEmail : null);
    this.form.get('userPhone').setValue(data ? data.userPhone : null);
    this.form.get('userAdmin').setValue(data ? data.userAdmin : null);
    this.form.get('userDegree').setValue(data ? data.userDegree.careerName : null);
    this.form.get('userStatus').setValue(data ? data.userStatus : null);
    this.getRoles(data);
  }

  getRoles(data): void {
    this.roleService.listRoles().then(res => {
      this.roles = this.roleAdapter.adaptList(res.data);
      const userRoleShow = [];
      this.roles.forEach(role => {
        data.userRole.forEach(userRole => {
          if (role.roleName === userRole.roleName){
            userRoleShow.unshift(role);
          }
        });
      });
      this.form.get('userRole').setValue(userRoleShow ? userRoleShow : null);
    });
  }

  save(): void {
    if (this.becomeAdministrator) {
      this.user.userAdmin = this.form.value.userAdmin;
      this.userService.updateUser(this.userAdapter.adaptObjectSend(this.user)).then(res => {
        if (res.status) {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡El usuario es ahora administrador!');
          this.display = false;
        }
      });
    } else {
      const data = {
        role: this.form.get('userRole').value[0],
        user: this.user
      };
      this.inviteRoleService.inviteTakeRole(this.inviteRoleAdapter.adaptObjectSendToPost(data))
        .then(res => {
          if (res.status) {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Invitación enviada!');
            this.display = false;
          } else {
            this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
          }
        });
    }
  }

}
