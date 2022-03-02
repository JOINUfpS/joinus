import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InviteRoleModel} from '../../../../../models/user/invite-role.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilitiesConfigString} from '../../../../../utilities/utilities-config-string.service';
import {InviteRoleService} from '../../../../../services/user/invite-role.service';
import {InviteRoleAdapter} from '../../../../../adapters/implementation/user/invite-role.adapter';
import {UserModel} from '../../../../../models/user/user.model';
import {RoleModel} from '../../../../../models/user/role.model';
import {UsersService} from '../../../../../services/user/user.service';
import {RoleService} from '../../../../../services/user/role.service';
import {AuthorizeRole} from '../../../../../utilities/status';
import {UserAdapter} from '../../../../../adapters/implementation/user/user.adapter';
import {RoleAdapter} from '../../../../../adapters/implementation/user/role.adapter';
import {MessagerService} from '../../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../../messenger/enum-level-message.enum';

@Component({
  selector: 'app-create-edit-inivte-role',
  templateUrl: './create-edit-inivte-role.component.html'
})
export class CreateEditInivteRoleComponent implements OnInit {

  @Output()
  updateList: EventEmitter<any> = new EventEmitter();
  @Input()
  permissions: string[];
  public display: boolean;
  public inviteRole: InviteRoleModel;
  public form: FormGroup;
  public showEditBtn: boolean;
  public userOptions: UserModel[];
  public roleOptions: RoleModel[];
  public statusOptions: any = Object.keys(AuthorizeRole).map(key => ({id: key, name: AuthorizeRole[key]}));
  public submitted: boolean;
  public buttonCreateInviteRoleActioned = false;

  constructor(public utilitiesString: UtilitiesConfigString,
              private inviteRoleService: InviteRoleService,
              private inviteRoleAdapter: InviteRoleAdapter,
              private userService: UsersService,
              private roleService: RoleService,
              private userAdapter: UserAdapter,
              private roleAdapter: RoleAdapter,
              private messagerService: MessagerService) {
    this.display = false;
    this.showEditBtn = true;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      user: new FormControl({value: null, disabled: false}, [Validators.required, Validators.maxLength(100)]),
      role: new FormControl({value: null, disabled: false}, [Validators.required, Validators.maxLength(100)]),
    });
  }

  show(data): void {
    this.display = true;
    this.inviteRole = data;
    this.setData(data);
    this.showEditBtn = data !== null;
    if (this.showEditBtn) {
      this.form.get('user').disable();
    } else {
      this.form.reset();
      this.form.enable();
    }
  }

  setData(data): void {
    this.userService.listUsers()
      .then(res => {
        this.userOptions = this.userAdapter.adaptList(res.data);
        const userSelected = this.userOptions.filter(user => user.userName === data?.userName);
        this.form.get('user').setValue(userSelected[0] ? userSelected[0] : null);
      });

    this.roleService.listRoles()
      .then(res => {
        this.roleOptions = this.roleAdapter.adaptList(res.data);
        const roleSelected = this.roleOptions.filter(role => role.roleName === data?.roleName);
        this.form.get('role').setValue(roleSelected[0] ? roleSelected[0] : null);
      });
  }

  save(): void {
    const inviteRole = this.form.getRawValue();
    this.buttonCreateInviteRoleActioned = true;
    if (this.inviteRole) {
      inviteRole.id = this.inviteRole.id;
      inviteRole.inroStatus = this.inviteRole.inroStatus;
      this.inviteRoleService.updateInviteRole(this.inviteRoleAdapter.adaptObjectSendToUpdate(inviteRole))
        .then(res => {
          if (res.status) {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Invitación actualizada');
            this.display = false;
          } else {
            this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
          }
        })
        .finally(() => {
          this.buttonCreateInviteRoleActioned = false;
          this.updateList.emit();
        });
    } else {
      this.inviteRoleService.saveInviteRole(this.inviteRoleAdapter.adaptObjectSendToPost(inviteRole))
        .then(res => {
          if (res.status) {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Invitación creada');
            this.display = false;
          } else {
            this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
          }
        })
        .finally(() => {
          this.buttonCreateInviteRoleActioned = false;
          this.updateList.emit();
        });
    }
  }

}
