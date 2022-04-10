import {Component} from '@angular/core';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {Location} from '@angular/common';
import {UserModel} from '../../models/user/user.model';
import {ConstPermissions} from '../../utilities/string/security/const-permissions';
import {ConstModules} from '../../utilities/string/security/const-modules';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent {

  public user: UserModel;
  public permissions: any;
  public permissionList: any = {};

  constructor(public utilitiesString: UtilitiesConfigString,
              public location: Location,
              public constPermissions: ConstPermissions) {
    this.user = utilitiesString.ls.get('user');
    this.havePermissions();
  }


  havePermissions(): void {
    if (this.user) {
      this.permissions = this.utilitiesString.ls.get('permissions');
      this.permissionList = {
        institution: this.permissions
          .find(elementInstitution => elementInstitution.moduName === ConstModules.INSTITUTIONS).moduPermissions,
        role: this.permissions.find(elementRole => elementRole.moduName === ConstModules.ROLES).moduPermissions,
        roleInvitation: this.permissions
          .find(elementRoleInvitation => elementRoleInvitation.moduName === ConstModules.ROLE_INVITATION).moduPermissions
      };
    }
  }
}
