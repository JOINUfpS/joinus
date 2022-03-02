import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {CommunityModel} from '../../../models/user/community.model';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {UserModel} from '../../../models/user/user.model';


@Injectable({
  providedIn: 'root'
})
export class CommunityAdapter implements Adapter<CommunityModel> {

  public user: UserModel;

  constructor(private utilitiesString: UtilitiesConfigString) {
    this.user = this.utilitiesString.ls.get('user');
  }

  adaptList(list: any): CommunityModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): CommunityModel {
    return new CommunityModel(
      item.id,
      item.inst_id,
      item.comm_photo_id,
      item.comm_owner_id,
      item.comm_name,
      item.comm_description,
      item.comm_category,
      item.comm_category_name,
      item.comm_privacy,
      item.comm_amount_member
    );
  }

  adaptObjectSend(item: any): any {
    return {
      id: item.id ? item.id : null,
      inst_id: item.instId ? item.instId : this.user.instId,
      comm_photo_id: item.commPhotoId !== undefined ? item.commPhotoId : null,
      comm_owner_id: item.commOwnerId ? item.commOwnerId : this.user.id,
      comm_name: item.commName ? item.commName : '',
      comm_description: item.commDescription ? item.commDescription : '',
      comm_category: item.commCategory.id ? item.commCategory.id : item.commCategory,
      comm_category_name: item.commCategory.cateName ? item.commCategory.cateName : item.commCategoryName,
      comm_privacy: item.commPrivacy.code ? item.commPrivacy.code : false,
      comm_amount_member: item.commAmountMember ? item.commAmountMember : 1
    };
  }

  adaptPatchAmountMember(commAmountMember: number): any {
    return {
      comm_amount_member: commAmountMember
    };
  }
}
