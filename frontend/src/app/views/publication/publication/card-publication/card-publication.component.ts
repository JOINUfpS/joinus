import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PublicationModel} from '../../../../models/publication/publication.model';
import {v4 as uuid} from 'uuid';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {UserModel} from '../../../../models/user/user.model';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {CommentAdapter} from '../../../../adapters/implementation/publication/comment.adapter';
import {PublicationAdapter} from '../../../../adapters/implementation/publication/publication.adapter';
import {PublicationService} from '../../../../services/publication/publication.service';
import {privacyOptions, shareOptions} from '../../../../utilities/types';
import {CreateEditPublicationComponent} from '../create-edit-publication/create-edit-publication.component';
import {MessagerService} from '../../../../messenger/messager.service';
import {FollowUserModel} from '../../../../models/user/follow.user.model';
import {FollowUserServices} from '../../../../services/user/follow_user.services';
import {FollowUserAdapter} from '../../../../adapters/implementation/user/follow-user.adapter';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';
import {Router} from '@angular/router';
import {ConstString} from '../../../../utilities/string/const-string';

@Component({
  selector: 'app-card-publication',
  templateUrl: './card-publication.component.html'
})
export class CardPublicationComponent implements OnInit {

  @Input() indexPublication: number;
  @Input() publication: PublicationModel;
  @Input() likeButton: boolean;
  @Input() shareButton: boolean;
  @Input() editButton: boolean;
  @Input() commId: uuid;
  @Output() eventDelete = new EventEmitter<number>();
  user: UserModel;
  items: MenuItem[];
  shareOptions: MenuItem[];
  privacyOptions: MenuItem[];
  publComment = '';
  focus;
  publAmountInterest: number;
  publAmountShared: number;
  displayUserShare: boolean;
  followedUsers: FollowUserModel[] = [];
  wayToShare: string;
  interest = 'hand-thumbs-up';
  interestEvent = 'center';
  isLoading = false;
  isLoadingInterest = false;
  publDescription: string;
  labelSeeDescription: string;
  private amInterested = false;
  @ViewChild('modalCreateEditPublication', {static: false}) modalCreateEditPublication: CreateEditPublicationComponent;
  @ViewChild('htmlInputElement') htmlInputElement: ElementRef;

  constructor(public utilitiesString: UtilitiesConfigString,
              private messagerService: MessagerService,
              private commentAdapter: CommentAdapter,
              private publicationAdapter: PublicationAdapter,
              private publicationService: PublicationService,
              private followUserService: FollowUserServices,
              private followUserAdapter: FollowUserAdapter,
              private confirmationService: ConfirmationService,
              private router: Router) {
    this.user = this.utilitiesString.ls.get('user');
    this.likeButton = true;
    this.shareButton = true;
    this.editButton = true;
    this.displayUserShare = false;
    this.formShareOptions();
  }

  ngOnInit(): void {
    this.formMenu();
    this.formPrivacyOptions();
    this.seeDescription();
    this.publAmountInterest = this.publication?.publInterestedList?.length;
    this.publAmountShared = this.publication?.publAmountShared;
    this.amInterested = this.knowIfAmInterestedInThisPublication();
    if (this.amInterested) {
      this.interest = 'hand-thumbs-up-fill';
      this.interestEvent = 'center color-icon-fill';
    }
  }

  private knowIfAmInterestedInThisPublication(): boolean {
    return this.publication?.publInterestedList?.includes(this.user.id);
  }

  private changePrivacy(option: string): void {
    this.publication.publPrivacy = option === privacyOptions.PRIVADO;
    this.publicationService.updatePublication(this.publicationAdapter.adaptObjectSend(this.publication))
      .then(response => {
        this.validateStatusResponse(response);
      });
  }

  private validateStatusResponse(response: any): void {
    if (!response.status) {
      this.messagerService.showToast(EnumLevelMessage.ERROR, response.message);
    }
  }

  private formMenu(): void {
    this.items = [];
    if (this.user.id === this.publication.userId) {
      this.items = [
        {
          label: 'Editar',
          icon: 'bi bi-pencil-square',
          command: (_ => this.showEditPublication(this.publication))
        },
        {
          label: 'Eliminar',
          icon: 'bi bi-x-circle',
          command: (_ => this.deletePublication(this.publication))
        }
      ];
    }
  }

  private formShareOptions(): void {
    this.shareOptions = [
      {
        label: 'Chat',
        icon: 'bi bi-chat-square-text',
        command: (_ => this.showSharePublication(shareOptions.CHAT))
      },
      {
        label: 'Correo',
        icon: 'bi bi-envelope',
        command: (_ => this.showSharePublication(shareOptions.CORREO))
      },
    ];
  }

  private formPrivacyOptions(): void {
    this.privacyOptions = [
      {
        label: 'Privada',
        icon: 'bi bi-lock',
        disabled: this.publication?.publPrivacy,
        command: (_ => this.changePrivacy(privacyOptions.PRIVADO))
      },
      {
        label: 'Pública',
        icon: 'bi bi-globe',
        disabled: !this.publication?.publPrivacy,
        command: (_ => this.changePrivacy(privacyOptions.PUBLICO))
      },
    ];
  }

  private getFollowedUsers(): void {
    this.isLoading = true;
    this.followUserService.getUsersFollowedAndFolllowers(this.user.instId, this.user.id)
      .then(res => {
        this.followedUsers = this.followUserAdapter.adaptList(res.data.followed_users);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  private deletePublication(publication: PublicationModel): void {
    this.confirmationService.confirm({
      message: ConstString.CONFIRM_DELETE + 'la publicación ' + publication.publTitle + '?',
      accept: () => {
        this.eventDelete.emit(this.indexPublication);
        this.publicationService.deletePublication(publication.id).then(res => {
          if (res.status) {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'La publicación ha sido eliminada con éxito');
          }
        });
      }
    });
  }

  updateAmountShared(): void {
    this.publAmountShared += 1;
  }

  private showSharePublication(option: string): void {
    this.getFollowedUsers();
    this.wayToShare = option;
    this.displayUserShare = true;
  }

  interactWithThePublication(): void {
    this.amInterested = !this.amInterested;
    this.isLoadingInterest = true;
    if (this.amInterested) {
      this.interest = 'hand-thumbs-up-fill';
      this.interestEvent = 'center color-icon-fill';
      this.giveMeInterestToThePublication();
    } else {
      this.interest = 'hand-thumbs-up';
      this.interestEvent = 'center';
      this.removeInterestFromPublication();
    }
  }

  private removeInterestFromPublication(): void {
    this.publAmountInterest--;
    this.publication.publInterestedList = this.publication.publInterestedList.splice(
      this.publication.publInterestedList.findIndex(value => value === this.user.id) + 1, 1);
    this.publicationService.updatePublication(this.publicationAdapter.adaptObjectSend(this.publication))
      .then(res => {
        if (res.status) {
          this.publAmountInterest = this.publication.publInterestedList.length;
        }
      })
      .finally(() => {
        this.isLoadingInterest = false;
      });
  }

  private giveMeInterestToThePublication(): void {
    this.publAmountInterest++;
    this.publicationService.interestPublication(this.publicationAdapter.interestPublication(this.publication.id))
      .then(res => {
        if (res.status) {
          this.publication = this.publicationAdapter.adaptObjectReceive(res.message);
        }
      })
      .finally(() => {
        this.isLoadingInterest = false;
      });
  }

  createComment(): void {
    if (this.publComment?.trim().length > 0) {
      const comments = this.publication.publComment;
      comments.unshift(this.commentAdapter.addOrEditCommentSend(this.publComment.trim()));
      this.publComment = '';
      this.publication.publComment = comments;
      this.publicationService.partialUpdatePublication(this.publicationAdapter.addOrEditCommentAdapter(this.publication))
        .then(response => {
          this.validateStatusResponse(response);
        });
    }
    this.publComment = '';
  }

  private showEditPublication(publication: PublicationModel): void {
    if (publication !== null) {
      this.modalCreateEditPublication.show(publication, publication.publStandard);
    }
  }

  doFocus(): void {
    this.htmlInputElement.nativeElement.focus();
  }

  updatePublication(publication: PublicationModel): void {
    this.publication = publication;
  }

  seeDescription(): void {
    if (this.labelSeeDescription === ConstString.SEE_MORE) {
      this.seeLess();
    } else {
      this.seeMore();
    }
  }

  private seeMore(): void {
    this.publDescription = this.publication?.publDescription.trim();
    if (this.publication?.publDescription.length > 300) {
      this.publDescription = this.publication?.publDescription.slice(0, 300);
      this.publDescription = this.publDescription + '...';
      this.labelSeeDescription = ConstString.SEE_MORE;
    }
  }

  private seeLess(): void {
    this.publDescription = this.publication?.publDescription.slice(0);
    this.labelSeeDescription = ConstString.SEE_LEST;
  }

  seeProfile(idUser: uuid): void {
    if (idUser !== null) {
      this.router.navigate(['perfil', idUser]).then();
    }
  }

  goToPublication(): void {
    this.router.navigate(['/publicaciones/publicacion', this.publication.id]).then();
  }
}
