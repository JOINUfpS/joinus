import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {UserModel} from '../../models/user/user.model';
import {UsersService} from '../../services/user/user.service';
import {UserAdapter} from 'src/app/adapters/implementation/user/user.adapter';
import {InviteRoleService} from '../../services/user/invite-role.service';
import {InviteRoleAdapter} from '../../adapters/implementation/user/invite-role.adapter';
import {ListNotificationComponent} from '../../views/notification/list-notification/list-notification.component';
import {MessagerService} from '../../messenger/messager.service';
import {ChangePasswordComponent} from '../../account/change-password/change-password.component';
import {SecurityService} from '../../services/security/security.service';
import {SecurityAdapter} from '../../adapters/implementation/security/security.adapter';
import {EnumLevelMessage} from '../../messenger/enum-level-message.enum';

import {ModulesModel} from 'src/app/models/user/modules.model';
import {ConstModules} from 'src/app/utilities/string/security/const-modules';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  focus;
  visibilityDialogChangeRole: any;
  user: UserModel;
  searchField: string;
  numNotifications: number;
  sidebar = false;
  toggleSlider: string;
  classNotification = 'bell';
  userNameToShow;
  buttonChangeRolePress = false;
  private listTitles: any[];


  public modelGrouped: ModulesModel[];
  public showRolesFunctions = false;

  @ViewChild('listNotification', {static: true}) listNotification: ListNotificationComponent;
  @ViewChild('modalChangePassword', {static: false}) modalChangePassword: ChangePasswordComponent;


  constructor(private location: Location,
              private messagerService: MessagerService,
              private router: Router,
              public utilitiesString: UtilitiesConfigString,
              private userService: UsersService,
              private userAdapter: UserAdapter,
              private inviteRoleService: InviteRoleService,
              private inviteRoleAdapter: InviteRoleAdapter,
              private securityService: SecurityService,
              private securityAdapter: SecurityAdapter,
              private constModule: ConstModules
  ) {
    this.location = location;
    this.user = this.utilitiesString.ls.get('user');
    this.userNameToShow = this.user.userName.split(' ')[0];

    this.modelGrouped = [];
  }

  ngOnInit(): void {
    this.loadMenu();
    this.showRoleFunctions();
  }

  loadMenu(): void {
    const roleStructure = this.utilitiesString.ls.get('permissions');
    if (roleStructure != null) {
      this.modelGrouped = roleStructure;
    }
  }

  getTitle(): any {
    let title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === '#') {
      title = title.slice(1);
    }

    for (const item of this.listTitles) {
      if (this.listTitles[item].path === title) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  seeUser(): void {
    this.visibilityDialogChangeRole = true;
  }

  roleChange(role): void {
    this.buttonChangeRolePress = true;
    this.user.userRoleActive = role.roleId;
    this.userService.updateUser(this.userAdapter.adaptObjectSend(this.user))
      .then(res => {
        if (res.status) {
          this.visibilityDialogChangeRole = false;
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Has cambiado de rol con éxito, cierra sesión y vuelve a ingresar para verlo!');
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      }).finally(() => {
      this.buttonChangeRolePress = false;
    });
  }

  requestRole(): void {
    this.messagerService.showToast(EnumLevelMessage.WARNING, 'Enviando correo para solicitar rol...');
    this.inviteRoleService.requestRole(this.inviteRoleAdapter.adaptObjectSendRequestRole(this.user))
      .then(res => {
        if (res.status) {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, res.message);
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      });
  }

  search(): void {
    this.router.navigate(['buscar', this.searchField]);
    this.searchField = '';
  }

  logout(): void {
    this.securityService.logout(this.securityAdapter.adaptLogout(this.user.userEmail)).then(res => {
      if (res.status) {
        this.utilitiesString.ls.removeAll();
        this.messagerService.showToast(EnumLevelMessage.SUCCESS, res.message);
        this.router.navigate(['iniciar-sesion']);
      }
    });
  }

  showNumberNoSee($event: number): void {
    this.numNotifications = $event;
  }

  closeSidebar(): void {
    this.toggleSlider = 'closed-sidebar';

    setTimeout(() => {
      this.sidebar = false;
    }, 300);
  }

  showSidebar(): void {
    this.sidebar = true;
    this.toggleSlider = 'sidebar';
  }


  showRoleFunctions(): void {
    if (this.modelGrouped.length !== 0) {
      this.modelGrouped.forEach(role => {
        if (role.moduName === this.constModule.ROLES || role.moduName === this.constModule.CATEGORIES
          || role.moduName === this.constModule.INSTITUTIONS || role.moduName === this.constModule.AUTHORIZE_ROLE) {
          this.showRolesFunctions = true;
        }
      });
    }
  }

  @HostListener('window:click', ['$event'])
  changeClassNotification(event: any): void {
    if (event.target.id === 'notification-active' && event.target.className === 'bell') {
      this.classNotification = 'active-bell';
    } else {
      this.classNotification = 'bell';
    }
  }

}
