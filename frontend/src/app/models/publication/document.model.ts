import {v4 as uuid} from 'uuid';

export class DocumentModel {
  constructor(
    public id: uuid,
    public userOwner: uuid,
    public userParticipants: Array<uuid>,
    public docuSize: string) {
  }
}
