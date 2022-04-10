import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {UserModel} from '../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {UniversityCareerAdapter} from '../utility/universityCareer.adapter';
import {ProjectAdapter} from './project.adapter';
import {v4 as uuid} from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class UserAdapter implements Adapter<UserModel> {

  public user: UserModel;

  constructor(public utilitiesString: UtilitiesConfigString,
              private universityCareerAdapter: UniversityCareerAdapter,
              private userProjectAdapter: ProjectAdapter) {
    this.user = this.utilitiesString.ls.get('user');

  }

  adaptList(list: any): UserModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): UserModel {
    return new UserModel(
      item.id,
      item.inst_id,
      item.inst_name,
      item.user_name,
      item.user_email,
      item.user_admin,
      item.user_provider,
      item.user_role,
      item.role_active,
      item.user_intro,
      item.user_interest,
      item.user_phone,
      item.user_photo,
      item.user_gender,
      this.universityCareerAdapter.adaptObjectReceive(item.user_degree),
      this.userProjectAdapter.adaptList(item.user_projects),
      item.user_curriculum_vitae,
      item.user_skill,
      item.user_country,
      item.user_department,
      item.user_municipality,
      item.user_status
    );
  }

  adaptObjectSend(item: any): any {
    return {
      id: item.id,
      inst_id: item.instId,
      inst_name: item.instName,
      user_name: this.utilitiesString.convertToTitle(item.userName.trim()),
      user_email: item.userEmail.toLowerCase(),
      user_admin: item.userAdmin ? item.userAdmin : false,
      user_provider: item.userProvider,
      user_role: item.userRole ? item.userRole : [],
      user_role_structure: item.userRoleStructure ? item.userRoleStructure : [],
      role_active: item.userRoleActive,
      user_intro: item.userIntro,
      user_interest: item.userInterest,
      user_phone: item.userPhone,
      user_photo: item.userPhoto ? item.userPhoto : null,
      user_gender: item.userGender,
      user_degree: this.universityCareerAdapter.adaptObjectSend(item.userDegree),
      user_projects: item.userProjects?.length > 0 ? this.userProjectAdapter.adaptArrayObjectSend(item.userProjects) : [],
      user_curriculum_vitae: item.userCurriculumVitae,
      user_skill: item.userSkill ? item.userSkill : [],
      user_country: item.userCountry ? item.userCountry : {id: 48, name: 'Colombia', iso2: 'CO'},
      user_department: item.userDepartment ? item.userDeparment : {id: 2877, name: 'Norte de Santander', iso2: 'NSA'},
      user_municipality: item.userMunicipality ? item.userMunicipality : {id: 20772, name: 'Cúcuta'},
      user_status: item.userStatus
    };
  }

  adaptDataUpdatedUser(item: any): any {
    return {
      id: this.user.id,
      user_name: this.utilitiesString.convertToTitle(item.user_name),
      user_email: item.user_email.toLowerCase(),
      user_country: item.user_country === undefined ? {} : item.user_country,
      user_department: item.user_department === undefined ? {} : item.user_department,
      user_municipality: item.user_municipality === undefined ? {} : item.user_municipality,
      user_degree: this.universityCareerAdapter.adaptObjectSend(item.user_degree),
      user_intro: item.user_intro,
      user_interest: item.user_interest,
      user_phone: item.user_phone,
      user_skill: item.user_skill,
    };
  }

  adaptUpdateCurriculumVitae(curriculumVitae: string): any {
    return {user_curriculum_vitae: curriculumVitae};
  }

  adaptChangePassword(changePasswordBody: any): any {
    return {
      user_id: this.user.id,
      current_password: changePasswordBody.currentPassword,
      new_password: changePasswordBody.newPassword
    };
  }

  adaptUserPhoto(idPhoto: uuid): any {
    return {
      user_photo: idPhoto,
      user_name: this.user.userName,
      user_email: this.user.userEmail,
      user_phone: this.user.userPhone,
      user_degree: this.user.userDegree === undefined ? {} : this.universityCareerAdapter.adaptObjectSend(this.user.userDegree)
    };
  }
}
