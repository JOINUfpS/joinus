import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {InstitutionModel} from '../../../models/institutions/institution.model';

@Injectable({
  providedIn: 'root'
})
export class InstitutionAdapter implements Adapter<InstitutionModel> {

  adaptList(listInstitution: any): InstitutionModel[] {
    const arrayInstitutions: InstitutionModel [] = [];
    listInstitution.forEach((institution: any) => {
      arrayInstitutions.push(this.adaptObjectReceive(institution));
    });
    return arrayInstitutions;
  }

  adaptObjectReceive(item: any): InstitutionModel {
    return new InstitutionModel(
      item.id,
      item.inst_name,
      item.inst_photo,
      item.inst_address,
      item.inst_country,
      item.inst_department,
      item.inst_municipality,
      item.inst_head,
      item.inst_website,
      item.inst_phone,
      item.inst_fax,
    );
  }

  adaptObjectSend(item: any): any {
    return {
      id: item.id,
      inst_name: item.instName,
      inst_photo: item.instPhoto,
      inst_address: item.instAddress,
      inst_country: item.instCountry,
      inst_department: item.instDepartment,
      inst_municipality: item.instMunicipality,
      inst_head: item.instHead,
      inst_website: item.instWebsite,
      inst_phone: item.instPhone,
      inst_fax: item.instFax
    };
  }

}


