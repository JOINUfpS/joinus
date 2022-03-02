import {v4 as uuid} from 'uuid';

export class NotificationModel {
  constructor(
    public id: uuid,
    public notiIsRead: boolean,
    public notiDate: Date,
    public notiReceiverId: uuid,
    public notiPath: string,
    public notiType: string,
    public notiAuthorId: uuid,
    public notiAuthorName: string,
    public notiAuthorPhoto: uuid,
    public notiAuthorEmail: string,
    public notiIssue: string,
    public notiDestinationName: string
  ) {
  }
}
