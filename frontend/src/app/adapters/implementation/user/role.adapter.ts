import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {Status} from '../../../utilities/status';
import {RoleModel} from '../../../models/user/role.model';
import {UserModel} from '../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';

@Injectable({
  providedIn: 'root'
})
export class RoleAdapter implements Adapter<RoleModel> {

  public user: UserModel;

  constructor(public utilitiesString: UtilitiesConfigString) {
    this.user = this.utilitiesString.ls.get('user');
  }

  adaptList(list: any): RoleModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): RoleModel {
    return new RoleModel(
      item.id,
      item.inst_id,
      item.role_name,
      item.role_list_module,
      item.role_structure,
      item.role_static,
      item.role_status,
    );
  }

  adaptObjectSend(item: any): any {
    return {
      id: item.id ? item.id : null,
      inst_id: item.instId ? item.instId : this.user.instId,
      role_name: item.roleName,
      role_list_module: item.roleListModule ? item.roleListModule || undefined : [],
      role_structure: item.roleStructure ? item.roleStructure || undefined : [{}],
      role_static: item.roleStatic ? item.roleStatic || undefined : false,
      role_status: item.roleStatus ? item.roleStatus || undefined : Status.INACTIVO
    };
  }

}
