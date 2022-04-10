import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {AuthorizeRole} from '../../../utilities/status';
import {InviteRoleModel} from '../../../models/user/invite-role.model';
import {TypeInviteRole} from '../../../utilities/types';

@Injectable({
  providedIn: 'root'
})
export class InviteRoleAdapter implements Adapter<InviteRoleModel> {

  adaptList(list: any): InviteRoleModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): InviteRoleModel {
    return new InviteRoleModel(
      item.id,
      item.inst_id,
      item.user_id,
      item.role_id,
      item.inro_status,
      item.inro_type,
      item.user_name,
      item.role_name,
      item.user_email,
      item.comm_id,
      item.cous_id,
      item.comm_name,
    );
  }

  adaptObjectSend(item: any): any {
    return {
      id: item.id ? item.id : null,
      inst_id: item.instId ? item.instId : null,
      user_id: item.userId ? item.userId : null,
      role_id: item.roleId ? item.roleId : null,
      inro_status: item.inroStatus ? item.inroStatus : null,
      inro_type: item.inroType ? item.inroType : TypeInviteRole.STANDARD,
      user_name: item.userName ? item.userName : null,
      role_name: item.roleName ? item.roleName : null,
      user_email: item.userEmail,
      comm_id: item.commId ? item.cousId : null,
      cous_id: item.cousId ? item.cousId : null,
      comm_name: item.commName ? item.cousName : '',
    };
  }

  adaptObjectSendRequestRole(item): any {
    return {
      inst_id: item.instId,
      user_id: item.id,
      inro_status: item.inroStatus ? item.inroStatus : AuthorizeRole.PENDING,
      inro_type: TypeInviteRole.STANDARD,
      user_name: item.userName,
      user_email: item.userEmail,
    };
  }

  adaptObjectSendToPost(item: any): any {
    return {
      id: item.id ? item.id : null,
      inst_id: item.user.instId,
      user_id: item.user.id,
      role_id: item.role.id,
      inro_status: AuthorizeRole.AUTHORIZED,
      inro_type: item.inroType ? item.inroType : TypeInviteRole.STANDARD,
      user_name: item.user.userName,
      role_name: item.role.roleName,
      user_email: item.user.userEmail,
      comm_id: item.commId,
      cous_id: item.cousId,
      comm_name: item.commName
    };
  }

  adaptRolesToSend(dataRoles: any): any {
    const listRolesAdapted: Array<any> = [];
    dataRoles.roles.forEach(roleItem => {
      const dataRole = {user: dataRoles.user, role: roleItem};
      listRolesAdapted.push(this.adaptObjectSendToPost(dataRole));
    });
    return listRolesAdapted;
  }

  adaptObjectSendToUpdate(item: any): any {
    return {
      id: item.id ? item.id : null,
      inst_id: item.user.instId,
      user_id: item.user.id,
      role_id: item.role.id,
      inro_status: item.inroStatus ? item.inroStatus : AuthorizeRole.AUTHORIZED,
      inro_type: item.inroType ? item.inroType : TypeInviteRole.STANDARD,
      user_name: item.user.userName,
      role_name: item.role.roleName,
      user_email: item.user.userEmail,
      comm_id: item.commId,
      cous_id: item.cousId,
      comm_name: item.commName
    };
  }


  adaptObjectSendInviteRoleCommunity(user, role): any {
    return {
      inst_id: user.instId,
      user_id: user.userId,
      role_id: role?.id ? role?.id : null,
      inro_status: AuthorizeRole.AUTHORIZED,
      inro_type: TypeInviteRole.COMMUNITY,
      user_name: user.userName,
      role_name: role?.roleName ? role?.roleName : '',
      user_email: user.userEmail,
      comm_id: user.commId,
      cous_id: user.id,
      comm_name: user.commName,
    };
  }

  adaptObjectToRevokeRoles(): any {
    return {
      user_role: [],
      user_admin: false,
      role_active: null,
      user_role_structure: []
    };
  }

  adaptBodyToAssignRoles(userId: boolean, userAdmin: boolean, dataRoles: any): any {
    return {
      user_id: userId,
      user_admin: userAdmin,
      invite_roles: this.adaptRolesToSend(dataRoles),
    };
  }

}
