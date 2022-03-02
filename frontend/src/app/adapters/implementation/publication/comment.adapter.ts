import {v4 as uuidv4} from 'uuid';
import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {CommentModel} from '../../../models/publication/comment.model';
import {UserModel} from '../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {DatePipe} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommentAdapter implements Adapter<CommentModel> {

  public userSession: UserModel;

  constructor(private utilitiesString: UtilitiesConfigString,
              public datePipe: DatePipe) {
    this.userSession = this.utilitiesString.ls.get('user');
  }

  adaptList(list: any): CommentModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): CommentModel {
    return new CommentModel(
      item.id,
      item.comm_user_id,
      item.comm_user_name,
      item.comm_user_photo,
      item.comm_content,
      item.comm_date
    );
  }

  adaptObjectSend(item: any): any {
    return {
      comm_user_id: item.commUserId ? item.commUserId : this.userSession.id,
      comm_user_name: item.commUserName ? item.commUserName : this.userSession.userName,
      comm_user_photo: item.commUserPhoto ? item.commUserPhoto : this.userSession.userPhoto,
      comm_content: item.commContent,
      comm_date: item.commDate ? item.commDate : this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm a')
    };
  }

  addOrEditCommentSend(commContent: string): any {
    return {
      id: uuidv4(),
      comm_user_id: this.userSession.id,
      comm_user_name: this.userSession.userName,
      comm_user_photo: this.userSession.userPhoto,
      comm_content: commContent,
      comm_date: this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm a')
    };
  }
}
