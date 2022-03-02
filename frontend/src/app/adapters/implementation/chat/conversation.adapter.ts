import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {ConversationModel} from '../../../models/chat/conversation.model';
import {UserModel} from '../../../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationAdapter implements Adapter<ConversationModel> {

  adaptList(list: any): ConversationModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): ConversationModel {
    return new ConversationModel(
      item.id,
      item.conv_user_emisor_id,
      item.conv_user_receiver_id,
      item.conv_user_emisor_photo_id,
      item.conv_user_receiver_photo_id,
      item.conv_user_emisor_name,
      item.conv_user_receiver_name
    );
  }

  adaptObjectSend(item: any): any {
    return {
      conv_user_emisor_id: item.conv_user_emisor_id,
      conv_user_receiver_id: item.conv_user_receiver_id,
      conv_is_bidirectional: item.conv_is_bidirectional,
      conv_user_emisor_photo_id: item.conv_user_emisor_photo_id,
      conv_user_receiver_photo_id: item.conv_user_receiver_photo_id,
      conv_user_emisor_name: item.conv_user_emisor_name,
      conv_user_receiver_name: item.conv_user_receiver_name,
      conv_user_emisor_email: item.conv_user_emisor_email,
      conv_user_receiver_email: item.conv_user_receiver_email
    };
  }

  adaptObjectSendNewConversation(userSession: UserModel, userToTalk: UserModel): any {
    return {
      conv_user_emisor_id: userSession.id,
      conv_user_receiver_id: userToTalk.id,
      conv_is_bidirectional: true,
      conv_user_emisor_photo_id: userSession.userPhoto ? userSession.userPhoto : null,
      conv_user_receiver_photo_id: userToTalk.userPhoto ? userToTalk.userPhoto : null,
      conv_user_emisor_name: userSession.userName,
      conv_user_receiver_name: userToTalk.userName,
      conv_user_emisor_email: userSession.userEmail,
      conv_user_receiver_email: userToTalk.userEmail
    };
  }

}
