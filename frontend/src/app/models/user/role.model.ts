import {v4 as uuid} from 'uuid';
import {ModulesModel} from './modules.model';

export class RoleModel {
  constructor(
    public id: uuid,
    public instId: uuid,
    public roleName: string,
    public roleListModule: Array<string>,
    public roleStructure: ModulesModel[],
    public roleStatic: boolean,
    public roleStatus: string) {

  }

}
