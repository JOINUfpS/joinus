import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {ModulesModel} from '../../../models/user/modules.model';

@Injectable({
  providedIn: 'root'
})
export class ModulesAdapter implements Adapter<ModulesModel> {

  adaptList(list: any): ModulesModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): ModulesModel {
    return new ModulesModel(
      item.id,
      item.modu_name,
      item.modu_router,
      item.modu_icon,
      item.modu_status,
      item.modu_permissions,
      item.modu_is_generic
    );
  }

  adaptObjectSend(item: any): any {
    return null;
  }

}
