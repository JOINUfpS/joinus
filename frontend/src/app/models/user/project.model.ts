import {v4 as uuid} from 'uuid';

export class ProjectModel {
  constructor(
    public id: uuid,
    public title: string,
    public abstract: string,
    public startDate: Date,
    public endDate: Date,
    public link: string
  ) {

  }

}
