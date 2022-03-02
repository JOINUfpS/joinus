import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {CommunityUserModel} from '../../../models/user/community-user.model';
import {UserModel} from '../../../models/user/user.model';


@Injectable({
  providedIn: 'root'
})
export class CommunityUserAdapter implements Adapter<CommunityUserModel> {

  adaptList(list: any): CommunityUserModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): CommunityUserModel {
    return new CommunityUserModel(
      item.id,
      item.comm_id,
      item.user_id,
      item.cous_pending_approval,
      item.cous_admin,
      item.comm_name,
      item.user_name,
      item.user_email,
      item.user_phone,
      item.user_photo,
      item.inst_id,
      item.inst_name,
    );
  }

  adaptObjectSend(item: any): any {
    return {
      id: item.id ? item.id : null,
      comm_id: item.comm_id,
      user_id: item.user_id,
      comm_owner_id: item.comm_owner_id,
      comm_photo: item.comm_photo,
      cous_pending_approval: item.cous_pending_approval,
      comm_name: item.comm_name ? item.comm_name : '',
      comm_category_name: item.comm_category_name,
      user_name: item.user_name ? item.user_name : '',
      user_email: item.user_email ? item.user_email : '',
      user_phone: item.user_phone ? item.user_phone : '',
      user_photo: item.user_photo ? item.user_photo : null,
      inst_id: item.inst_id,
      inst_name: item.inst_name ? item.inst_name : '',
    };
  }

  adaptCommunityUser(user: UserModel, communityToJoin: any): any {
    return {
      comm_id: communityToJoin.id ? communityToJoin.id : null,
      comm_owner_id: communityToJoin.commOwnerId ? communityToJoin.commOwnerId : user.id,
      comm_photo: communityToJoin.commPhotoId ? communityToJoin.commPhotoId : null,
      inst_id: user.instId,
      user_id: user.id,
      inst_name: user.instName,
      cous_pending_approval: communityToJoin.commPrivacy,
      cous_admin: communityToJoin.commOwnerId === user.id,
      comm_name: communityToJoin.commName,
      comm_category_name: communityToJoin.commCategoryName,
      user_name: user.userName,
      user_email: user.userEmail,
      user_phone: user.userPhone,
      user_photo: user.userPhoto !== '' ? user.userPhoto : null
    };
  }

  adaptDeleteAdmin(user: CommunityUserModel): any {
    return {
      user_id: user.userId,
      cous_admin: false,
    };
  }

}
