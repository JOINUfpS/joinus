import {v4 as uuid} from 'uuid';
import {UniversityCareerModel} from '../utility/university-career.model';

export class FollowUserModel {

  constructor(
    public id: uuid,
    public userId: uuid,
    public fousUserId: uuid,
    public fousIsBidirectional: boolean,
    public instIdUser: uuid,
    public instNameUser: string,
    public instIdFous: uuid,
    public instNameFous: string,
    public nameUser: string,
    public nameFous: string,
    public userEmail: string,
    public fousEmail: string,
    public userDegree: UniversityCareerModel,
    public fousDegree: UniversityCareerModel,
    public userPhoto: uuid,
    public fousPhoto: uuid,
  ) {
  }


}

