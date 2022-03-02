import {Injectable} from '@angular/core';
import {AdapterWriteOnly} from '../../abstract/adapter-write-only';
import {UserModel} from '../../../models/user/user.model';
import {ProjectAdapter} from '../user/project.adapter';

@Injectable({
  providedIn: 'root'
})
export class SecurityAdapter implements AdapterWriteOnly<any> {

  constructor(private userProjectAdapter: ProjectAdapter) {
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
      item.user_degree,
      this.userProjectAdapter.adaptList(item.user_projects),
      item.user_curriculum_vitae,
      item.user_skill,
      item.user_country,
      item.user_department,
      item.user_municipality,
      item.user_status
    );
  }

  adaptObjectSend(user: any): any {
    return {
      user_email: user.userEmail ? user.userEmail : null,
      password: user.userPassword ? user.userPassword : null,
      provider: user.provider,
      user_google: user.userGoogle ? user.userGoogle : null
    };
  }

  adaptForgotPassword(userForm: any): any {
    return {user: userForm.userEmail};
  }

  adaptConfirmForgotPassword(item: any): any {
    return {
      user: item.userEmail,
      new_password: item.newPassword,
      confirmation_code: item.confirmationCode,
    };
  }

  adaptLogout(email: any): any {
    return {user: email};
  }

  adaptRefreshToken(token: any): any {
    return {access_token: token};
  }

}
