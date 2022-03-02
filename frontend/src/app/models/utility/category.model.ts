import {v4 as uuid} from 'uuid';

export class CategoryModel {
  constructor(
    public id: uuid,
    public instId: uuid,
    public cateName: string,
    public cateDescription: string,
    public cateType: string,
    public cateStatus: string) {
  }

}



