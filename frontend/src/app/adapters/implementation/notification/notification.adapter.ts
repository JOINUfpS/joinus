import {Adapter} from '../../abstract/adapter';
import {NotificationModel} from '../../../models/notification/notification.model';
import {Injectable} from '@angular/core';
import {UserModel} from '../../../models/user/user.model';
import {CommunityModel} from '../../../models/user/community.model';
import {notificationTypes} from '../../../utilities/types';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {PublicationModel} from '../../../models/publication/publication.model';
import {CommunityUserMembers} from '../../abstract/community-user-members';
import {v4 as uuid} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class NotificationAdapter implements Adapter<NotificationModel> {

  public user: UserModel;

  constructor(private utilitiesString: UtilitiesConfigString) {
    this.user = this.utilitiesString.ls.get('user');
  }

  adaptList(list: any): NotificationModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): NotificationModel {
    return new NotificationModel(
      item.id,
      item.noti_is_read,
      item.noti_date,
      item.noti_receiver_id,
      item.noti_path,
      item.noti_type,
      item.noti_author_id,
      item.noti_author_name,
      item.noti_author_photo ? item.noti_author_photo : null,
      item.noti_author_email,
      item.noti_issue,
      item.noti_destination_name
    );
  }

  adaptObjectSend(item: any): any {
    return {
      id: item.id,
      noti_is_read: item.noti_is_read,
      noti_date: item.noti_date,
      noti_receiver_id: item.noti_receiver_id,
      noti_path: item.noti_path,
      noti_type: item.noti_type,
      noti_author_id: item.noti_author_id,
      noti_author_name: item.noti_author_name,
      noti_author_photo: item.noti_author_photo,
      noti_issue: item.noti_issue,
      noti_destination_name: item.noti_destination_name
    };
  }

  adaptObjectSendFullText(publication: PublicationModel): any {
    return {
      noti_receiver_id: publication.userId,
      noti_path: 'publicaciones/publicacion/' + publication.id,
      noti_type: notificationTypes.FULL_TEXT,
      noti_author_id: this.user.id,
      noti_author_name: this.user.userName,
      noti_author_photo: this.user.userPhoto,
      noti_author_email: this.user.userEmail,
      noti_issue: 'ha solicitado el texto completo de la publicación',
      noti_destination_name: publication.publTitle
    };
  }

  adaptNotificationToInviteACommunity(userSession: UserModel, usersToInvite: any, community: CommunityModel): any {
    const notiCommunity = {
      id: community.id,
      name: community.commName,
      photo: community.commPhotoId ? community.commPhotoId : null
    };
    return {
      noti_author_name: userSession.userName,
      noti_community: notiCommunity,
      noti_inviteds: usersToInvite
    };
  }

  adaptCommunityPostNotification(userSessionId: uuid, membersCommunity: CommunityUserMembers[], publId: uuid, authorName: string,
                                 authorPhoto: string, commId: uuid, commName: string): any {
    const MEMBERS_ID: uuid[] = [];
    membersCommunity.forEach(memberCommunity => {
      if (memberCommunity.id !== userSessionId) {
        MEMBERS_ID.push(
          memberCommunity.id
        );
      }
    });

    return {
      noti_members: MEMBERS_ID,
      noti_author_id: publId,
      noti_author_name: authorName,
      noti_author_photo: authorPhoto,
      noti_comm_id: commId,
      noti_comm_name: commName
    };
  }

  adaptNotificationToDelete(notiReceiverId: uuid, notiAuthorId: uuid): any {
    return {
      noti_receiver_id: notiReceiverId,
      noti_author_id: notiAuthorId,
    };
  }

}
