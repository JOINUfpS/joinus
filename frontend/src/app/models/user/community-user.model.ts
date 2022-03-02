import {v4 as uuid} from 'uuid';

export class CommunityUserModel {
  constructor(
    public id: uuid,
    public commId: uuid,
    public userId: uuid,
    public cousPendingApproval: boolean,
    public cousAdmin: boolean,
    public commName: string,
    public userName: string,
    public userEmail: string,
    public userPhone: string,
    public userPhoto: uuid,
    public instId: uuid,
    public instName: string,
  ) {
  }
}
