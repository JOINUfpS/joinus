import {v4 as uuid} from 'uuid';

export class UserRoleModel {
  constructor(public roleId: uuid,
              public roleName: string) {
  }
}
