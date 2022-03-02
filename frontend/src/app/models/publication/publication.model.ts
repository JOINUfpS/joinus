import {v4 as uuid} from 'uuid';
import {FileModel} from '../file/file.model';
import {AuthorPublicationModel} from './author-publication.model';
import {ProjectModel} from '../user/project.model';

export class PublicationModel {
  constructor(
    public id: uuid,
    public userId: uuid,
    public instId: uuid,
    public commId: uuid,
    public userName: string,
    public userPhoto: uuid,
    public commName: string,
    public cateId: uuid,
    public cateName: string,
    public publTitle: string,
    public publDescription: string,
    public publStandard: boolean,
    public publAuthors: Array<AuthorPublicationModel>,
    public publPrivacy: boolean,
    public publDate: Date,
    public publComment: Array<object>,
    public publAmountDownload: number,
    public publAttachments: Array<FileModel>,
    public publInterestedList: Array<uuid>,
    public publAmountShared: number,
    public publFullText: boolean,
    public publPermissionViewFullText: Array<string>,
    public publLinkDoi: string,
    public publProjectId: uuid,
    public publProject: ProjectModel,
    public createdDate: Date) {
  }

  static newPublicationModel(publication: PublicationModel): PublicationModel {
    return new PublicationModel(
      publication.id,
      publication.userId,
      publication.instId,
      publication.commId,
      publication.userName,
      publication.userPhoto,
      publication.commName,
      publication.cateId,
      publication.cateName,
      publication.publTitle,
      publication.publDescription,
      publication.publStandard,
      publication.publAuthors,
      publication.publPrivacy,
      publication.publDate,
      publication.publComment,
      publication.publAmountDownload,
      publication.publAttachments,
      publication.publInterestedList,
      publication.publAmountShared,
      publication.publFullText,
      publication.publPermissionViewFullText,
      publication.publLinkDoi,
      publication.publProjectId,
      publication.publProject,
      publication.createdDate);
  }
}
