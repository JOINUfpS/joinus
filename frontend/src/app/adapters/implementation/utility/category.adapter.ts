import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {CategoryModel} from '../../../models/utility/category.model';
import {UserModel} from '../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';


@Injectable({
  providedIn: 'root'
})
export class CategoryAdapter implements Adapter<CategoryModel> {

  public user: UserModel;

  constructor(private utilitiesString: UtilitiesConfigString) {
    this.user = this.utilitiesString.ls.get('user');

  }

  adaptListToJson(list: any): CategoryModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(
        {
          cate_id: item.id,
          cate_name: item.cateName
        });
    });
    return array;
  }

  adaptTypeContrateToJson(categoryModel: CategoryModel): any {
    return {
      cate_id: categoryModel.id,
      cate_name: categoryModel.cateName
    };
  }

  adaptList(list: any): CategoryModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): CategoryModel {
    return new CategoryModel(
      item.id,
      item.inst_id,
      item.cate_name,
      item.cate_description,
      item.cate_type,
      item.cate_status
    );

  }

  adaptObjectSend(item: any): any {
    return {
      id: item.id ? item.id : null,
      inst_id: item.inst_id ? item.inst_id : this.user.instId,
      cate_name: item.cateName ? item.cateName : '',
      cate_description: item.cateDescription ? item.cateDescription : '',
      cate_type: item.cateType.name ? item.cateType.name : item.cateType,
      cate_status: item.cateStatus.name ? item.cateStatus.name : item.cateStatus
    };
  }
}
