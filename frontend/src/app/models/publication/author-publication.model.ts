import {v4 as uuid} from 'uuid';

export class AuthorPublicationModel {
  constructor(public id: uuid,
              public authorName: string,
              public authorPhoto: uuid) {
  }
}
