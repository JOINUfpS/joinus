import {v4 as uuid} from 'uuid';

export class ConfirmationAccountModel {

  constructor(
    public id: uuid,
    public userEmail: string,
    public temporalPassword: string,
    public accountStatus: string,
    public createdDate: Date
  ) {
  }
}
