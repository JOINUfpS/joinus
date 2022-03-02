import {v4 as uuid} from 'uuid';

export class ModulesModel {
  constructor(public id: uuid,
              public moduName: string,
              public moduRouter: string,
              public moduIcon: string,
              public moduStatus: string,
              public moduPermissions: Array<any>,
              public moduIsGeneric: boolean) {
  }

}
