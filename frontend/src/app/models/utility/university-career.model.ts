import {v4 as uuid} from 'uuid';

export class UniversityCareerModel {
  constructor(
    public id: uuid,
    public careerName: string) {
  }

}
