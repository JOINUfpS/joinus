import {v4 as uuid} from 'uuid';

export class InstitutionModel {


  constructor(
    public id: uuid,
    public instName: string,
    public instPhoto: uuid,
    public instAddress: string,
    public instCountry: string,
    public instDepartment: string,
    public instMunicipality: string,
    public instHead: string,
    public instWebsite: string,
    public instPhone: string,
    public instFax: string,
  ) {
  }

}
