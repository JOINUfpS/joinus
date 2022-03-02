import {v4 as uuid} from 'uuid';

export class InviteRoleModel {
  constructor(public id: uuid,
              public instId: uuid,
              public userId: uuid,
              public roleId: uuid,
              public inroStatus: string,
              public inroType: string,
              public userName: string,
              public roleName: string,
              public userEmail: string,
              public commId: uuid,
              public cousId: uuid,
              public commName: string) {
  }
}
