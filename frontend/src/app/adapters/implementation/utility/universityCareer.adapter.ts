import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {UserModel} from '../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {UniversityCareerModel} from '../../../models/utility/university-career.model';


@Injectable({
  providedIn: 'root'
})
export class UniversityCareerAdapter implements Adapter<UniversityCareerModel> {

  private user: UserModel;

  constructor(private utilitiesString: UtilitiesConfigString) {
    this.user = this.utilitiesString.ls.get('user');
  }

  adaptList(list: any): UniversityCareerModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): UniversityCareerModel {
    return new UniversityCareerModel(
      item.id,
      item.career_name
    );
  }

  adaptObjectSend(item: any): any {
    return {
      id: item.id ? item.id : null,
      career_name: item.careerName ? item.careerName : this.user.userDegree?.careerName,
    };
  }
}
