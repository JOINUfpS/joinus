import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {CommunityUserMembers} from '../../abstract/community-user-members';

@Injectable({
  providedIn: 'root'
})
export class MembersCommunityAdapter implements Adapter<CommunityUserMembers> {
  adaptList(list: any): CommunityUserMembers[] {
    const array: any = [];
    list.forEach(obj => {
      array.push(this.adaptObjectReceive(obj));
    });
    return array;
  }

  adaptObjectReceive(obj: any): CommunityUserMembers {
    return {
      id: obj.id,
      userName: obj.user_name,
      userDegree: obj.user_degree,
      userPhoto: obj.user_photo,
      isMember: obj.is_member
    };
  }

  adaptObjectSend(obj: any): CommunityUserMembers {
    return null;
  }

}
