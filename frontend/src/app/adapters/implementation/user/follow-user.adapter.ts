import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {FollowUserModel} from '../../../models/user/follow.user.model';
import {UserModel} from '../../../models/user/user.model';
import {UniversityCareerAdapter} from '../utility/universityCareer.adapter';


@Injectable({
  providedIn: 'root'
})
export class FollowUserAdapter implements Adapter<FollowUserModel> {

  constructor(private universityCareerAdapter: UniversityCareerAdapter) {
  }

  adaptList(listFollowers: any): FollowUserModel[] {
    const array: any = [];
    listFollowers.forEach(follower => {
      array.push(this.adaptObjectReceive(follower));
    });
    return array;
  }

  adaptObjectReceive(follower: any): FollowUserModel {
    return new FollowUserModel(
      follower.id,
      follower.user_id,
      follower.fous_user_id,
      follower.fous_is_bidirectional,
      follower.inst_id_user,
      follower.inst_name_user,
      follower.inst_id_fous,
      follower.inst_name_fous,
      follower.name_user,
      follower.name_fous,
      follower.user_email,
      follower.fous_email,
      this.universityCareerAdapter.adaptObjectReceive(follower.user_degree),
      this.universityCareerAdapter.adaptObjectReceive(follower.fous_degree),
      follower.user_photo,
      follower.fous_photo
    );
  }

  adaptObjectSend(item: any): any {
    return {
      id: item.id,
      user_id: item.user_id,
      fous_user_id: item.fous_user_id,
      fous_is_bidirectional: item.fous_is_bidirectional,
      inst_id_user: item.inst_id_user,
      inst_name_user: item.inst_name_user,
      inst_id_fous: item.inst_id_fous,
      inst_name_fous: item.inst_name_fous,
      name_user: item.name_user,
      name_fous: item.name_fous,
      user_email: item.user_email,
      fous_email: item.fous_email,
      user_degree: item.user_degree,
      fous_degree: item.fous_degree,
      user_photo: item.user_photo === '' ? null : item.user_photo,
      fous_photo: item.fous_photo === '' ? null : item.fous_photo
    };
  }

  adaptFollowUserModelSend(followUser: FollowUserModel): any {
    return {
      id: followUser.id ? followUser.id : null,
      user_id: followUser.userId,
      fous_user_id: followUser.fousUserId,
      fous_is_bidirectional: followUser.fousIsBidirectional,
      inst_id_user: followUser.instIdUser,
      inst_name_user: followUser.instNameUser,
      inst_id_fous: followUser.instIdFous,
      inst_name_fous: followUser.instNameFous,
      name_user: followUser.nameUser,
      name_fous: followUser.nameFous,
      user_email: followUser.userEmail,
      fous_email: followUser.fousEmail,
      user_degree: this.universityCareerAdapter.adaptObjectSend(followUser.userDegree),
      fous_degree: this.universityCareerAdapter.adaptObjectSend(followUser.fousDegree),
      user_photo: followUser.userPhoto ? followUser.userPhoto : null,
      fous_photo: followUser.fousPhoto ? followUser.fousPhoto : null
    };
  }

  adaptUserModelToFollowUserModel(userSession: UserModel, users: any[]): FollowUserModel[] {
    const followUsersModel: FollowUserModel[] = [];
    users.forEach(user => {
      followUsersModel.push(new FollowUserModel(
        null,
        userSession.id,
        user.id,
        false,
        userSession.instId,
        userSession.instName,
        user.inst_id,
        user.inst_name,
        userSession.userName,
        user.user_name,
        userSession.userEmail,
        user.user_email,
        userSession.userDegree,
        this.universityCareerAdapter.adaptObjectReceive(user.user_degree),
        userSession.userPhoto,
        user.user_photo
      ));
    });
    return followUsersModel;
  }

  adaptUserModelToFollowUserModelAndFollowerUser(userSession: UserModel, user: UserModel): any {
    return {
      user_id: userSession.id,
      fous_user_id: user.id,
      fous_is_bidirectional: false,
      inst_id_user: userSession.instId,
      inst_name_user: userSession.instName,
      inst_id_fous: user.instId,
      inst_name_fous: user.instName,
      name_user: userSession.userName,
      name_fous: user.userName,
      user_email: userSession.userEmail,
      fous_email: user.userEmail,
      user_degree: this.universityCareerAdapter.adaptObjectSend(userSession.userDegree),
      fous_degree: this.universityCareerAdapter.adaptObjectSend(user.userDegree),
      user_photo: userSession.userPhoto === '' ? null : userSession.userPhoto,
      fous_photo: user.userPhoto === '' ? null : user.userPhoto
    };
  }

}
