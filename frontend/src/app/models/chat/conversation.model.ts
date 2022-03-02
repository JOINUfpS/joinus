import {v4 as uuid} from 'uuid';

export class ConversationModel {
  constructor(
    public id: uuid,
    public convUserEmisorId: uuid,
    public convUserReceiverId: uuid,
    public convUserEmisorPhotoId: uuid,
    public convUserReceiverPhotoId: uuid,
    public convUserEmisorName: string,
    public convUserReceiverName: string,
  ) {
  }
}
