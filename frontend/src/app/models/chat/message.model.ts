import {v4 as uuid} from 'uuid';

export class MessageModel {
  constructor(
    public id: uuid,
    public convId: uuid,
    public messAuthor: uuid,
    public messDate: Date,
    public messContent: string,
  ) {
  }
}
