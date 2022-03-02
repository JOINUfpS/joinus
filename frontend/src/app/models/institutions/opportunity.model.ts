import {v4 as uuid} from 'uuid';
import {FileModel} from '../file/file.model';
import {CategoryModel} from '../utility/category.model';

export class OpportunityModel {

  constructor(
    public id: uuid,
    public instId: uuid,
    public userId: uuid,
    public userName: string,
    public userPhoto: uuid,
    public oppoTitle: string,
    public oppoDescription: string,
    public oppoExpirationDate: Date,
    public oppoEmployerEmail: string,
    public oppoSimpleRequest: boolean,
    public oppoApplicationUrl: string,
    public oppoTypeContract: CategoryModel,
    public oppoAttachments: Array<FileModel>,
    public oppoUserSaved: Array<uuid>,
    public oppoCountry: any,
    public oppoDepartment: any,
    public oppoMunicipality: any,
    public oppoRemuneration: string,
    public createdDate: Date,
  ) {
  }

}
