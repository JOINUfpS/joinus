import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {v4 as uuid} from 'uuid';
import {ActivatedRoute, Router} from '@angular/router';
import {PublicationService} from '../../../../services/publication/publication.service';
import {PublicationAdapter} from '../../../../adapters/implementation/publication/publication.adapter';
import {PublicationModel} from '../../../../models/publication/publication.model';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {UserModel} from '../../../../models/user/user.model';
import {CommentAdapter} from '../../../../adapters/implementation/publication/comment.adapter';
import {PublicationUserAdapter} from '../../../../adapters/implementation/publication/publication-user.adapter';
import {PublicationUserService} from '../../../../services/publication/publication-user.service';
import {saveAs} from 'file-saver';
import {NotificationService} from '../../../../services/notification/notification.service';
import {NotificationAdapter} from '../../../../adapters/implementation/notification/notification.adapter';
import {MessagerService} from '../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {CreateEditPublicationComponent} from '../create-edit-publication/create-edit-publication.component';
import {privacyOptions} from 'src/app/utilities/types';
import {ConstString} from '../../../../utilities/string/const-string';

@Component({
  selector: 'app-view-publication',
  templateUrl: './view-publication.component.html'
})
export class ViewPublicationComponent implements OnInit {

  publication: PublicationModel;
  userSession: UserModel;
  comment: string;
  focus: any;
  activeIndex: number;
  viewFullText: boolean;
  publicationSaved: boolean;
  items: MenuItem[];
  hasPDFToDownload: boolean;
  publicationsRelated: Array<PublicationModel>;
  editButton: boolean;
  privacyOptions: MenuItem[];
  isLoadingPublications: boolean;
  isLoadingDataPublication: boolean;
  projectAbstract: string;
  labelSeeAbstractProject: string;
  publicationDescription: string;
  labelSeePublicationDescription: string;
  private readonly maximumLength = 300;
  private publicationId: uuid;
  private publicationUserId: uuid;
  @Output() private eventDelete = new EventEmitter<number>();
  @ViewChild('modalCreateEditPublication', {static: false}) private modalCreateEditPublication: CreateEditPublicationComponent;

  constructor(private activatedRoute: ActivatedRoute,
              private publicationService: PublicationService,
              private publicationAdapter: PublicationAdapter,
              private publicationUserService: PublicationUserService,
              private publicationUserAdapter: PublicationUserAdapter,
              private commentAdapter: CommentAdapter,
              private notificationService: NotificationService,
              private notificationAdapter: NotificationAdapter,
              private router: Router,
              private messagerService: MessagerService,
              private confirmationService: ConfirmationService,
              public utilitiesString: UtilitiesConfigString
  ) {
    this.isLoadingDataPublication = false;
    this.isLoadingPublications = false;
    this.publicationsRelated = [];
    this.hasPDFToDownload = false;
    this.activeIndex = 0;
    this.items = [];
    this.userSession = this.utilitiesString.ls.get('user');
    this.viewFullText = false;
    this.publicationSaved = false;
    this.formMenu();
    this.formPrivacyOptions();
  }

  ngOnInit(): void {
    this.getIdPublicationInUrl();
  }

  createComment(): void {
    if (this.comment !== '\n') {
      const comments = this.publication.publComment;
      comments.push(this.commentAdapter.addOrEditCommentSend(this.comment.trim()));
      this.publication.publComment = comments;
      this.comment = '';
      this.publicationService.partialUpdatePublication(this.publicationAdapter.addOrEditCommentAdapter(this.publication))
        .then(response => {
          this.validateStatusResponse(response);
        });
    }
  }

  private validateStatusResponse(response: any): void {
    if (!response.status) {
      this.messagerService.showToast(EnumLevelMessage.ERROR, response.message);
    }
  }

  showFullText(): void {
    this.viewFullText = true;
  }

  downloadPdf(): void {
    let pdfUrl = '';
    for (const attachment of this.publication.publAttachments) {
      if (attachment.fileType === 'application/pdf') {
        pdfUrl = this.utilitiesString.getImage(attachment.id);
        saveAs.saveAs(pdfUrl, this.publication.publTitle);
      }
    }
    this.increasePublicationAmountDownload();
  }

  requestPullRequest(): void {
    this.notificationService.saveNotification(this.notificationAdapter.adaptObjectSendFullText(this.publication)).then(res => {
      if (res.status) {
        this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Notificación enviada!');
      } else {
        this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
      }
    }, err => {
      this.messagerService.showToast(EnumLevelMessage.ERROR, err.errors);
    });
  }

  getInformationPublication(): any {
    this.isLoadingDataPublication = true;
    this.publicationService.getPublication(this.publicationId).then(res => {
      this.publication = this.publicationAdapter.adaptObjectReceive(res.data);
      for (const attachment of this.publication.publAttachments) {
        if (attachment.fileType === 'application/pdf') {
          this.hasPDFToDownload = true;
        }
      }
      this.seeDescriptionPublication();
      if (this.publication.publProject.abstract) {
        this.seeAbstractProject();
      }
      this.knowIfISavedThisPublication();
    });
  }

  private knowIfISavedThisPublication(): void {
    this.publicationUserService.getPublicationUser(this.publication.id)
      .then(response => {
        if (response.status) {
          if (response.data !== []) {
            this.publicationUserId = response.data[0].id;
            this.publicationSaved = true;
          }
        }
      }).finally(() => {
      this.isLoadingDataPublication = false;
    });
  }

  triggerSaved(): void {
    this.publicationSaved ? this.notSavePublication() : this.savePublication();
  }

  private savePublication(): void {
    this.publicationSaved = true;
    this.publicationUserService.savePublicationUser(this.publicationUserAdapter.adaptObjectSend(this.publication))
      .then(res => {
        if (res.status) {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Has marcado esta publicación cómo favorita.');
        } else {
          this.publicationSaved = false;
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      }).catch(_ => {
      this.publicationSaved = false;
    });
  }

  private notSavePublication(): void {
    this.publicationSaved = false;
    this.publicationUserService.deletePublicationUser(this.publicationUserId).then(res => {
      if (res.status) {
        this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Has removido esta publicación de tus favoritas.');
      } else {
        this.publicationSaved = true;
        this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
      }
    }).catch(_ => {
      this.publicationSaved = true;
    });
  }

  private increasePublicationAmountDownload(): void {
    this.publication.publAmountDownload++;
    const publicationPatch = this.publicationAdapter.increasePublicationAmountDownload(this.publication.publAmountDownload);
    this.publicationService.patchPublication(publicationPatch, this.publication.id)
      .then(response => {
        this.validateStatusResponse(response);
      });
  }

  viewProfileUser(userId): void {
    this.router.navigate(['perfil', userId]).then();
  }

  private getIdPublicationInUrl(): void {
    this.activatedRoute.params.subscribe(params => {
      this.publicationId = params.publId;
      this.getInformationPublication();
    });
  }

  private formMenu(): void {
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

  updatePublication(publication: PublicationModel): void {
    this.publication = publication;
  }

  private showEditPublication(publication): void {
    if (publication !== null) {
      this.modalCreateEditPublication.show(publication, publication.publStandard);
    }
  }

  private deletePublication(publication: PublicationModel): void {
    this.confirmationService.confirm({
      message: ConstString.CONFIRM_DELETE + 'la publicación ' + publication.publTitle + '?',
      accept: () => {
        this.publicationService.deletePublication(publication.id)
          .then(_ => {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'La publicación ha sido eliminada con éxito');
            this.router.navigate(['/']).then();
          });
      }
    });
  }

  getPublicationsRelated(): void {
    this.activeIndex = 3;
    if (this.publication.publProjectId !== null) {
      this.isLoadingPublications = true;
      const showPrivates = this.publication.userId === this.userSession.id;
      this.publicationService.getPublicationsRelated(this.publication.id, this.publication.publProjectId, showPrivates)
        .then(response => {
          this.publicationsRelated = this.publicationAdapter.adaptList(response.data);
        })
        .finally(() => {
            this.isLoadingPublications = false;
          }
        );
    }
  }

  private changePrivacy(option: string): void {
    this.publication.publPrivacy = option === privacyOptions.PRIVADO;
    this.publicationService.updatePublication(this.publicationAdapter.adaptObjectSend(this.publication))
      .then(response => {
        this.validateStatusResponse(response);
      });
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

  seeAbstractProject(): void {
    if (this.labelSeeAbstractProject === ConstString.SEE_MORE) {
      this.seeLessProject();
    } else {
      this.seeMoreProject();
    }
  }

  private seeLessProject(): void {
    this.projectAbstract = this.publication.publProject.abstract;
    this.labelSeeAbstractProject = ConstString.SEE_LEST;
  }

  private seeMoreProject(): void {
    this.projectAbstract = this.publication.publProject.abstract.trim();
    if (this.projectAbstract.length > this.maximumLength) {
      this.projectAbstract = this.projectAbstract.slice(0, this.maximumLength);
      this.projectAbstract = this.projectAbstract + '...';
      this.labelSeeAbstractProject = ConstString.SEE_MORE;
    }
  }

  seeDescriptionPublication(): void {
    if (this.labelSeePublicationDescription === ConstString.SEE_MORE) {
      this.seeLessDescriptionPublication();
    } else {
      this.seeMoreDescriptionPublication();
    }
  }

  private seeLessDescriptionPublication(): void {
    this.publicationDescription = this.publication.publDescription;
    this.labelSeePublicationDescription = ConstString.SEE_LEST;
  }

  private seeMoreDescriptionPublication(): void {
    this.publicationDescription = this.publication.publDescription.trim();
    if (this.publicationDescription.length > this.maximumLength) {
      this.publicationDescription = this.publicationDescription.slice(0, this.maximumLength);
      this.publicationDescription = this.publicationDescription + '...';
      this.labelSeePublicationDescription = ConstString.SEE_MORE;
    }
  }
}
