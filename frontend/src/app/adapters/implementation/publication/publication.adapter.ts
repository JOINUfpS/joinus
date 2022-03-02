import {Injectable} from '@angular/core';
import {Adapter} from '../../abstract/adapter';
import {v4 as uuid} from 'uuid';
import {PublicationModel} from '../../../models/publication/publication.model';
import {UserModel} from '../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {FollowUserModel} from '../../../models/user/follow.user.model';
import {AuthorPublicationAdapter} from './author-publication.adapter';
import {ProjectAdapter} from '../user/project.adapter';

@Injectable({
  providedIn: 'root'
})
export class PublicationAdapter implements Adapter<PublicationModel> {

  public user: UserModel;

  constructor(private utilitiesString: UtilitiesConfigString,
              private authorPublicationAdapter: AuthorPublicationAdapter,
              private userProjectAdapter: ProjectAdapter) {
    this.user = this.utilitiesString.ls.get('user');

  }

  adaptPublicationsWithOutCommunity(listPublications: Array<any>): PublicationModel[] {
    const publicationsWithOutCommunityAdapted = [];
    const publicationsWithOutCommunity = listPublications.filter(publication => publication.comm_id === null);
    publicationsWithOutCommunity.forEach(publication => {
      publicationsWithOutCommunityAdapted.push(this.adaptObjectReceive(publication));
    });
    return publicationsWithOutCommunityAdapted;
  }

  adaptList(list: any): PublicationModel[] {
    const array = [];
    list.forEach(item => {
      array.push(this.adaptObjectReceive(item));
    });
    return array;
  }

  adaptObjectReceive(item: any): PublicationModel {
    return new PublicationModel(
      item.id,
      item.user_id,
      item.inst_id,
      item.comm_id,
      item.user_name,
      item.user_photo,
      item.comm_name,
      item.cate_id,
      item.cate_name,
      item.publ_title,
      item.publ_description,
      item.publ_standard,
      this.authorPublicationAdapter.adaptList(item.publ_authors),
      item.publ_privacy,
      item.publ_date,
      item.publ_comment,
      item.publ_amount_download,
      item.publ_attachments,
      item.publ_interested_list,
      item.publ_amount_shared,
      item.publ_full_text,
      item.publ_permission_view_full_text,
      item.publ_link_doi,
      item.publ_project_id,
      this.userProjectAdapter.adaptObjectReceive(item.publ_project),
      item.created_date
    );
  }

  adaptObjectSend(item: any): any {
    return {
      id: item.id ? item.id : null,
      user_id: item.userId ? item.userId : this.user.id,
      user_name: item.userName ? item.userName : this.user.userName,
      user_photo: this.user.userPhoto,
      inst_id: item.instId ? item.instId : this.user.instId,
      comm_id: item.commId ? item.commId : null,
      comm_name: item.commName ? item.commName : '',
      cate_id: item.publCategory ? item.publCategory.id : null,
      cate_name: item.publCategory ? item.publCategory.cateName : '',
      publ_title: item.publTitle,
      publ_description: item.publDescription ? item.publDescription : '',
      publ_standard: item.publStandard,
      publ_authors: item.publAuthors ? this.authorPublicationAdapter.adaptListToSend(item.publAuthors) : [],
      publ_privacy: item.publPrivacy.code !== undefined ? item.publPrivacy.code : item.publPrivacy,
      publ_date: item.publDate ? item.publDate : new Date(),
      publ_comment: item.publComment ? item.publComment : [],
      publ_amount_download: item.publAmountDownload ? item.publAmountDownload : 0,
      publ_attachments: item.publAttachments ? item.publAttachments : [],
      publ_interested_list: item.publInterestedList ? item.publInterestedList : [],
      publ_amount_shared: item.publAmountShared ? item.publAmountShared : 0,
      publ_full_text: item.publFullText ? item.publFullText : false,
      publ_permission_view_full_text: item.publPermissionViewFullText,
      publ_link_doi: item.publLinkDoi ? item.publLinkDoi : '',
      publ_project_id: item.publProject ? item.publProject.id : null,
      publ_project: item.publProject ? this.userProjectAdapter.adaptObjectSend(item.publProject) : {}
    };
  }

  sendFullText(email, publication): any {
    return {
      user_email: email,
      publ_id: publication
    };
  }

  addOrEditCommentAdapter(item: any): any {
    return {
      id: item.id,
      inst_id: item.instId,
      inst_name: item.instName,
      publ_comment: item.publComment
    };
  }

  sharePublication(shareOption: string, publId: uuid, user: UserModel, userSharing: FollowUserModel): any {
    return {
      share_option: shareOption,
      publ_id: publId,
      user_share: user,
      user_sharing: userSharing,
    };
  }

  interestPublication(publId: uuid): any {
    return {
      publ_id: publId,
      user_interested: this.user.id,
      user_interested_photo: this.user.userPhoto ? this.user.userPhoto : null,
      user_interested_name: this.user.userName
    };
  }

  adaptListPublicationUserToListPublicationModel(listPublicationUser: any): PublicationModel [] {
    const listPublicationModel = [];
    listPublicationUser.forEach(publicationUser => {
      listPublicationModel.push(this.adaptPublicationUserToPublication(publicationUser));
    });
    return listPublicationModel;
  }

  adaptPublicationUserToPublication(publicationUser: any): PublicationModel {
    return new PublicationModel(
      publicationUser.publ_id,
      publicationUser.publ_user_id,
      null,
      null,
      publicationUser.publ_user_name,
      publicationUser.publ_user_photo,
      publicationUser.comm_name,
      null,
      publicationUser.cate_name,
      publicationUser.publ_title,
      publicationUser.publ_description,
      true,
      publicationUser.publ_authors,
      publicationUser.publ_privacy,
      null,
      publicationUser.publ_comment,
      0,
      publicationUser.publ_attachments,
      [],
      publicationUser.publ_amount_shared,
      false,
      [],
      publicationUser.publ_link_doi,
      publicationUser.publ_project_id,
      publicationUser.publ_project,
      publicationUser.created_date
    );
  }

  increasePublicationAmountDownload(numberToIncrease: number): any {
    return {
      publ_amount_download: numberToIncrease
    };
  }
}
