import {Component, OnInit, ViewChild} from '@angular/core';
import {EditUserComponent} from '../edit-user/edit-user.component';
import {UserModel} from '../../../../models/user/user.model';
import {ConfirmationService} from 'primeng/api';
import {UsersService} from '../../../../services/user/user.service';
import {UserAdapter} from '../../../../adapters/implementation/user/user.adapter';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {ConstModules} from '../../../../utilities/string/security/const-modules';
import {ConstPermissions} from '../../../../utilities/string/security/const-permissions';


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html'
})
export class ListUserComponent implements OnInit {

  @ViewChild('modalUser', {static: false}) modalUser: EditUserComponent;
  users: UserModel[];
  listOriginalUsers: UserModel[];
  permissions: string[];
  stringUserToSearch: string;
  isLoadingSearch = false;
  userSession: UserModel;
  paginatorUser: any;

  constructor(private confirmationService: ConfirmationService,
              private userService: UsersService,
              private userAdapter: UserAdapter,
              private constModules: ConstModules,
              public constPermissions: ConstPermissions,
              public utilitiesString: UtilitiesConfigString) {
    this.users = [];
    this.permissions = utilitiesString.ls.get('permissions');
    if (this.permissions.length > 0) {
      this.permissions = utilitiesString.ls.get('permissions')
        .find(element => element.moduName === constModules.USERS).moduPermissions;
    } else {
      this.permissions = [];
    }
    this.userSession = utilitiesString.ls.get('user');
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): any {
    this.users = [];
    this.isLoadingSearch = true;
    this.userService.listUsers()
      .then(res => {
        this.users = this.userAdapter.adaptList(res.data);
        this.listOriginalUsers = this.users;
        this.paginatorUser = res.paginator;
      })
      .finally(() => {
        this.isLoadingSearch = false;
      });
  }

  onScrollDown(): void {
    if (this.paginatorUser.next !== null && !this.isLoadingSearch) {
      this.isLoadingSearch = true;
      this.userService.listUserWithPagination(this.paginatorUser)
        .then(res => {
          this.paginatorUser = res.paginator;
          this.users = this.users.concat(this.userAdapter.adaptList(res.data));
        }).finally(() => {
        this.isLoadingSearch = false;
      });
    }
  }

  addOrEdit(data): any {
    if (data !== null) {
      this.modalUser.show(data);
    } else {
      this.modalUser.show(null);
    }
  }

  searchUser(): void {
    if (this.stringUserToSearch?.trim().length > 0) {
      this.users = [];
      this.isLoadingSearch = true;
      this.userService.getUserByName(this.userSession.instId, this.stringUserToSearch)
        .then(res => {
          this.paginatorUser = res.paginator;
          this.users = this.userAdapter.adaptList(res.data);
        }).finally(() => {
        this.isLoadingSearch = false;
      });
    } else if (this.stringUserToSearch?.trim().length === 0) {
      this.getUsers();
      this.stringUserToSearch = undefined;
    }
  }
}
