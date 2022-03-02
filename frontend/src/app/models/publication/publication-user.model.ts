import {v4 as uuid} from 'uuid';
import {FileModel} from '../file/file.model';
import {AuthorPublicationModel} from './author-publication.model';
import {ProjectModel} from '../user/project.model';

export class PublicationUserModel {
  constructor(
    public id: uuid,
    public publId: uuid,
    public userId: uuid,
    public puusInterest: boolean,
    public puusShared: boolean,
    public puusSaved: boolean,
    public publUserId: uuid,
    public publUserName: string,
    public publUserPhoto: uuid,
    public cateName: string,
    public commId: uuid,
    public commName: string,
    public publTitle: string,
    public publDescription: string,
    public publAuthors: Array<AuthorPublicationModel>,
    public publPrivacy: boolean,
    public publComment: Array<object>,
    public publAmountInterest: number,
    public publAmountShared: number,
    public publAttachments: Array<FileModel>,
    public publLinkDoi: string,
    public publProjectId: uuid,
    public publProject: ProjectModel,
    public createdDate: Date) {
  }
}
