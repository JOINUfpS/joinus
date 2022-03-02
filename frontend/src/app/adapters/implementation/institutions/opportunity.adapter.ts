import {Adapter} from '../../abstract/adapter';
import {Injectable} from '@angular/core';
import {OpportunityModel} from '../../../models/institutions/opportunity.model';
import {UserModel} from '../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../../utilities/string/const-string';


@Injectable({
  providedIn: 'root'
})
export class OpportunityAdapter implements Adapter<OpportunityModel> {

  user: UserModel;

  constructor(public utilitiesString: UtilitiesConfigString,
              private datePipe: DatePipe) {
    this.user = this.utilitiesString.ls.get('user');
  }

  adaptList(listOpportunities: any): OpportunityModel[] {
    const arrayOpportunities: OpportunityModel [] = [];
    listOpportunities.forEach((opportunity: any) => {
      arrayOpportunities.push(this.adaptObjectReceive(opportunity));
    });
    return arrayOpportunities;
  }

  adaptObjectReceive(item: any): OpportunityModel {
    return new OpportunityModel(
      item.id,
      item.inst_id,
      item.user_id,
      item.user_name,
      item.user_photo,
      item.oppo_title,
      item.oppo_description,
      item.oppo_expiration_date,
      item.oppo_employer_email,
      item.oppo_simple_request,
      item.oppo_application_url,
      item.oppo_type_contract,
      item.oppo_attachments,
      item.oppo_user_saved,
      item.oppo_country,
      item.oppo_department,
      item.oppo_municipality,
      item.oppo_remuneration ? item.oppo_remuneration : 'A convenir',
      item.created_date);
  }

  adaptObjectSend(item: any): any {
    return {
      id: item.id ? item.id : null,
      inst_id: item.instId ? item.instId : this.user.instId,
      user_id: item.userId ? item.userId : this.user.id,
      user_name: item.userName ? item.userName : this.user.userName,
      user_photo: item.userPhoto ? item.userPhoto : this.user.userPhoto,
      oppo_title: item.oppoTitle,
      oppo_description: item.oppoDescription,
      oppo_expiration_date: typeof item.oppoExpirationDate === ConstString.TYPE_STRING ?
        item.oppoExpirationDate : this.datePipe.transform(item.oppoExpirationDate, 'dd-MM-yyyy'),
      oppo_employer_email: item.oppoEmployerEmail,
      oppo_simple_request: item.oppoSimpleRequest ? item.oppoSimpleRequest : false,
      oppo_application_url: item.oppoApplicationUrl,
      oppo_type_contract: item.oppoTypeContract.cateName ? item.oppoTypeContract.cateName : item.oppoTypeContract,
      oppo_postulates: item.oppoPostulates ? item.oppoPostulates : [],
      oppo_attachments: item.oppoAttachments ? item.oppoAttachments : [],
      oppo_user_saved: item.oppoUserSaved ? item.oppoUserSaved : [],
      oppo_country: item.oppoCountry !== undefined ? item.oppoCountry : {},
      oppo_department: item.oppoDepartment !== undefined ? item.oppoDepartment : {},
      oppo_municipality: item.oppoMunicipality !== undefined ? item.oppoMunicipality : {},
      oppo_remuneration: item.oppoRemuneration !== null ? item.oppoRemuneration : 0
    };
  }

  applyOpportunityAdapter(file, user, opportunity): any {
    const input = new FormData();
    input.append('file', file);
    input.append('user_id', user.id);
    input.append('user_name', user.userName);
    input.append('opportunity', opportunity.id);
    return input;
  }
}
