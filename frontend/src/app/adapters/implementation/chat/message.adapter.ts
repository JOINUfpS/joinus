import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {MessageModel} from '../../../models/chat/message.model';
import {ConversationModel} from '../../../models/chat/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class MessageAdapter implements Adapter<MessageModel> {
  adaptList(list: any): MessageModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): MessageModel {
    return new MessageModel(
      item.id,
      item.conv_id,
      item.mess_author,
      item.mess_date,
      item.mess_content,
    );
  }

  adaptMessageSend(conversation: ConversationModel, messAuthor: string, messContent: any): any {
    return {
      conv_id: conversation.id,
      user_emisor: messAuthor,
      user_receiver: conversation.convUserReceiverId,
      mess_content: messContent,
    };
  }

  adaptObjectSend(obj: any): MessageModel {
    return undefined;
  }
}
