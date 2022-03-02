import {v4 as uuid} from 'uuid';

export class CommunityModel {

  constructor(
    public id: uuid,
    public instId: uuid,
    public commPhotoId: uuid,
    public commOwnerId: uuid,
    public commName: string,
    public commDescription: string,
    public commCategory: uuid,
    public commCategoryName: string,
    public commPrivacy: boolean,
    public commAmountMember: number) {
  }
}
