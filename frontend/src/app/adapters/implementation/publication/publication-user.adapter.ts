import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {PublicationUserModel} from '../../../models/publication/publication-user.model';
import {UserModel} from '../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {PublicationModel} from '../../../models/publication/publication.model';

@Injectable({
  providedIn: 'root'
})
export class PublicationUserAdapter implements Adapter<PublicationUserModel> {

  user: UserModel;

  constructor(private utilitiesString: UtilitiesConfigString) {
    this.user = this.utilitiesString.ls.get('user');
  }

  adaptList(list: any): PublicationUserModel[] {
    const array: any = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): PublicationUserModel {
    return new PublicationUserModel(
      item.id,
      item.publ_id,
      item.user_id,
      item.puus_interest,
      item.puus_shared,
      item.puus_saved,
      item.publ_user_id,
      item.publ_user_name,
      item.publ_user_photo,
      item.cate_name,
      item.comm_id,
      item.comm_name,
      item.publ_title,
      item.publ_description,
      item.publ_authors,
      item.publ_privacy,
      item.publ_comment,
      item.publ_amount_interest,
      item.publ_amount_shared,
      item.publ_attachments,
      item.publ_link_doi,
      item.publ_project_id,
      item.publ_project,
      item.created_date,
    );
  }

  adaptObjectSend(publication: PublicationModel): any {
    return {
      publ_id: publication.id,
      user_id: this.user.id,
      puus_interest: false,
      puus_shared: false,
      puus_saved: true,
      publ_user_id: publication.userId,
      publ_user_name: publication.userName,
      publ_user_photo: publication.userPhoto,
      cate_name: publication.cateName,
      comm_id: publication.commId,
      comm_name: publication.commName,
      publ_title: publication.publTitle,
      publ_description: publication.publDescription,
      publ_authors: publication.publAuthors,
      publ_privacy: publication.publPrivacy,
      publ_comment: publication.publComment,
      publ_amount_interest: publication.publInterestedList.length,
      publ_amount_shared: publication.publAmountShared,
      publ_attachments: publication.publAttachments,
      publ_link_doi: publication.publLinkDoi,
      publ_project_id: publication.publProjectId,
      publ_project: publication.publProject,
      created_date: publication.createdDate,
    };
  }
}
