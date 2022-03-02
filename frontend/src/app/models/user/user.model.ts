import {v4 as uuid} from 'uuid';
import {UserRoleModel} from './user-role.model';
import {UniversityCareerModel} from '../utility/university-career.model';
import {ProjectModel} from './project.model';

export class UserModel {

  constructor(
    public id: uuid,
    public instId: uuid,
    public instName: string,
    public userName: string,
    public userEmail: string,
    public userAdmin: boolean,
    public userProvider: string,
    public userRole: Array<UserRoleModel>,
    public userRoleActive: uuid,
    public userIntro: string,
    public userInterest: Array<string>,
    public userPhone: string,
    public userPhoto: string,
    public userGender: string,
    public userDegree: UniversityCareerModel,
    public userProjects: Array<ProjectModel>,
    public userCurriculumVitae: uuid,
    public userSkill: Array<string>,
    public userCountry: any,
    public userDepartment: any,
    public userMunicipality: any,
    public userStatus: string
  ) {
  }
}
