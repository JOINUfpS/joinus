import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FollowUserModel} from '../../../../models/user/follow.user.model';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {PublicationAdapter} from '../../../../adapters/implementation/publication/publication.adapter';
import {PublicationService} from '../../../../services/publication/publication.service';
import {UserModel} from '../../../../models/user/user.model';
import {PublicationModel} from '../../../../models/publication/publication.model';
import {FollowUserAdapter} from '../../../../adapters/implementation/user/follow-user.adapter';
import {UserAdapter} from '../../../../adapters/implementation/user/user.adapter';
import {MessagerService} from '../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';
import {v4 as uuid} from 'uuid';


@Component({
  selector: 'app-card-user-share-publication',
  templateUrl: './card-user-share-publication.component.html'
})
export class CardUserSharePublicationComponent implements OnChanges {

  @Input() followedUser: FollowUserModel;
  @Input() publication: PublicationModel;
  @Input() wayToShare: string;
  @Output() emitPublAmountShared = new EventEmitter<void>();
  userSession: UserModel;
  showSpinner: boolean;
  disableSharing: boolean;
  shareMessage: string;
  userNameToShare: string;
  idUserPhotoToShare: uuid;

  constructor(
    public utilitiesString: UtilitiesConfigString,
    public publicationAdapter: PublicationAdapter,
    public publicationService: PublicationService,
    public followUserAdapter: FollowUserAdapter,
    public userAdapter: UserAdapter,
    private messagerService: MessagerService) {
    this.userSession = this.utilitiesString.ls.get('user');
    this.shareMessage = 'Enviar';
    this.disableSharing = false;
    this.showSpinner = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chooseInformationUserFollowedToDisplay();
  }

  private chooseInformationUserFollowedToDisplay(): void {
    if (this.followedUser.userId === this.userSession.id) {
      this.idUserPhotoToShare = this.followedUser.fousPhoto;
      this.userNameToShare = this.followedUser.nameFous;
    } else {
      this.idUserPhotoToShare = this.followedUser.userPhoto;
      this.userNameToShare = this.followedUser.nameUser;
    }
  }

  sharePublication(followedUser: FollowUserModel): void {
    this.shareMessage = 'Enviando';
    this.showSpinner = true;
    const bodyInformationToShare = this.createBodyInformationToShare(followedUser);
    this.publicationService.sharePublication(bodyInformationToShare)
      .then(res => {
        if (res.status) {
          this.showSpinner = false;
          this.disableSharing = true;
          this.shareMessage = 'Enviado';
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, res.message);
          this.emitPublAmountShared.emit();
        } else {
          this.shareMessage = 'Enviar';
          this.showSpinner = false;
          this.disableSharing = true;
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      })
      .catch(_ => {
        this.shareMessage = 'Enviar';
        this.showSpinner = false;
        this.disableSharing = false;
      });
  }

  private createBodyInformationToShare(followedUser: FollowUserModel): any {
    const sendingUser = this.userAdapter.adaptObjectSend(this.userSession);
    const receivingUser = this.followUserAdapter.adaptFollowUserModelSend(followedUser);
    return this.publicationAdapter.sharePublication(this.wayToShare, this.publication.id, sendingUser, receivingUser);
  }

}
