import {v4 as uuid} from 'uuid';

export class CategoryDocumentModel {
  constructor(
    public id: uuid,
    public cateId: uuid,
    public cateName: string,
    public docuId: uuid,
    public docuType: string) {
  }
}
