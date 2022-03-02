import {v4 as uuid} from 'uuid';

export class CommentModel {
  constructor(
    public id: uuid,
    public commUserId: uuid,
    public commUserName: string,
    public commUserPhoto: uuid,
    public commContent: string,
    public commDate: Date) {
  }
}
