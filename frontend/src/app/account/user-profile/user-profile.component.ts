import {Component, OnInit, ViewChild} from '@angular/core';
import {UsersService} from '../../services/user/user.service';
import {UserModel} from '../../models/user/user.model';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {EditProfileComponent} from '../edit-profile/edit-profile.component';
import {UserAdapter} from '../../adapters/implementation/user/user.adapter';
import {FollowUserViewComponent} from '../../views/user/follow-user/follow-user-view/follow-user-view.component';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {OpportunityService} from '../../services/institution/opportunity.service';
import {OpportunityAdapter} from '../../adapters/implementation/institutions/opportunity.adapter';
import {OpportunityModel} from '../../models/institutions/opportunity.model';
import {PublicationService} from '../../services/publication/publication.service';
import {PublicationAdapter} from '../../adapters/implementation/publication/publication.adapter';
import {PublicationModel} from '../../models/publication/publication.model';
import {ActivatedRoute, Router} from '@angular/router';
import {v4 as uuid} from 'uuid';
import {FileService} from '../../services/file/file.service';
import {PublicationUserService} from '../../services/publication/publication-user.service';
import {saveAs} from 'file-saver';
import {SendAttachments} from '../../utilities/send-attachments.service';
import {MessagerService} from '../../messenger/messager.service';
import {ChangePasswordComponent} from '../change-password/change-password.component';
import {EnumLevelMessage} from '../../messenger/enum-level-message.enum';
import {FollowUserServices} from '../../services/user/follow_user.services';
import {FollowUserAdapter} from '../../adapters/implementation/user/follow-user.adapter';
import {FollowUserModel} from '../../models/user/follow.user.model';
import {ConstString} from '../../utilities/string/const-string';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {

  active: boolean;
  urlPhoto: string;
  itemsMenuEdit: MenuItem[];
  userToShow: UserModel;
  opportunitiesFavorites: OpportunityModel[];
  myOpportunities: OpportunityModel[];
  publications: PublicationModel[];
  publicationsFavorites: PublicationModel[];
  idUserToShow: uuid;
  activeIndex = 0;
  activeIndexInfo = 0;
  updatePhoto: boolean;
  validFile: boolean;
  uploadedFiles: any[];
  imgChange: any;
  userSession: UserModel;
  paginatorMyPublications: any;
  isLoadingPublications = false;
  isLoadingMyOpportunities = false;
  isLoadingOpportunitiesFavorites = false;
  paginatorPublicationsFavorites: any;
  paginatorOpportunitiesFavorites: any;
  paginatorMyOpportunities: any;
  iCanFollow = false;
  followerUserModel: FollowUserModel;
  @ViewChild('modalEditProfile', {static: false}) modalEditProfile: EditProfileComponent;
  @ViewChild(FollowUserViewComponent, {static: true}) followUser: FollowUserViewComponent;
  @ViewChild('modalChangePassword', {static: false}) modalChangePassword: ChangePasswordComponent;
  activeIndexFavorite = 0;
  isButtonFollowInAction = false;
  userRoleActive: string;
  buttonUserPhotoActioned = false;

  constructor(
    private router: Router,
    private messagerService: MessagerService,
    private userService: UsersService,
    private userModelAdapter: UserAdapter,
    public utilitiesConfigString: UtilitiesConfigString,
    private publicationService: PublicationService,
    private publicationAdapter: PublicationAdapter,
    private publicationUserService: PublicationUserService,
    private activatedRoute: ActivatedRoute,
    private opportunityService: OpportunityService,
    private opportunityAdapter: OpportunityAdapter,
    private fileService: FileService,
    private confirmationService: ConfirmationService,
    private followUserService: FollowUserServices,
    private followUserAdapter: FollowUserAdapter) {
    this.updatePhoto = false;
    this.userSession = this.utilitiesConfigString.ls.get('user');
    this.opportunitiesFavorites = [];
    this.myOpportunities = [];
    this.publications = [];
    this.publicationsFavorites = [];
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        this.idUserToShow = params.idUserToShow;
        this.getUserData();
      }
    );
  }

  public removeUserProject(indexUserProject: number): void {
    this.userSession.userProjects.splice(indexUserProject, 1);
  }

  getUserData(): void {
    this.loadUserInformationToShow();
    this.isFollowed();
    this.roleActive();
  }

  loadUserInformationToShow(): void {
    if (this.idUserToShow !== null && this.userSession.id !== this.idUserToShow) {
      this.getInfoUser();
    } else {
      this.userToShow = this.userSession;
      this.imgChange = this.utilitiesConfigString.getImage(this.userToShow?.userPhoto);
      this.getOtherInformationUser();
    }
  }

  isFollowed(): any {
    if (this.userSession.id !== this.idUserToShow) {
      this.followUserService.isUserFollowed(this.userSession.instId, this.userSession.id, this.idUserToShow)
        .then(res => {
          if (res.status) {
            if (res.data.length === 0) {
              this.iCanFollow = true;
            } else if (res.data.user_id === this.userSession.id || res.data.fous_is_bidirectional) {
              this.iCanFollow = false;
            } else if (res.data.user_id === this.idUserToShow && !res.data.fous_is_bidirectional) {
              this.iCanFollow = true;
              this.followerUserModel = this.followUserAdapter.adaptObjectReceive(res.data);
            }
          }
        });
    }
  }

  roleActive(): void {
    if (this.userToShow?.userRoleActive === null) {
      this.userRoleActive = 'Rol por defecto';
    } else {
      if (this.userToShow?.userRole !== undefined) {
        for (const role of this.userToShow?.userRole) {
          if (role.roleId === this.userToShow?.userRoleActive) {
            this.userRoleActive = role.roleName;
          }
        }
      }
    }
  }

  updateInfoAfterChange(): void {
    this.userToShow = this.utilitiesConfigString.ls.get('user');
  }

  getInfoUser(): void {
    this.userService.getInfoUser(this.idUserToShow)
      .then(res => {
        this.userToShow = this.userModelAdapter.adaptObjectReceive(res.data);
        this.imgChange = this.utilitiesConfigString.getImage(this.userToShow?.userPhoto);
        this.getOtherInformationUser();
      });
  }

  getMyOpportunities(): void {
    this.activeIndex = 4;
    this.isLoadingMyOpportunities = true;
    this.opportunityService.myOpportunities(this.userToShow.id).then(res => {
      this.myOpportunities = this.opportunityAdapter.adaptList(res.data);
      this.paginatorMyOpportunities = res.paginator;
    })
      .finally(() => {
        this.isLoadingMyOpportunities = false;
      });
  }

  getOpportunitiesFavorites(): void {
    this.isLoadingOpportunitiesFavorites = true;
    this.opportunityService.userOpportunities(this.userToShow.instId, this.userToShow.id).then(res => {
      this.opportunitiesFavorites = this.opportunityAdapter.adaptList(res.data);
      this.paginatorOpportunitiesFavorites = res.paginator;
    })
      .finally(() => {
        this.isLoadingOpportunitiesFavorites = false;
      });
  }

  createMenuEdit(): any {
    this.itemsMenuEdit = [
      {
        label: 'Resumen',
        icon: 'bi bi-file-earmark-person',
        command: (_ => this.addOrEditField('intro'))
      },
      {
        label: 'Datos básicos',
        icon: 'bi bi-book',
        command: (_ => this.addOrEditField('general'))
      },
      {
        label: 'Habilidades',
        icon: 'bi bi-palette2',
        command: (_ => this.addOrEditField('skill'))
      },
      {
        label: 'Intereses',
        icon: 'bi bi-heart',
        command: (_ => this.addOrEditField('interest'))
      },
    ];
  }

  seeNetwork(): void {
    this.activeIndex = 2;
    this.getFollowUser();
  }

  private getFollowUser(): any {
    this.followUser.getUsersFollowedAndFollowers(this.userToShow?.instId, this.userToShow?.id);
  }

  followerUser(): any {
    this.isButtonFollowInAction = true;
    if (this.followerUserModel === undefined) {
      this.followUserService.followUser(this.followUserAdapter
        .adaptUserModelToFollowUserModelAndFollowerUser(this.userSession, this.userToShow)).then(res => {
        this.processResponseFollower(res.status);
      }).finally(() => {
        this.isButtonFollowInAction = false;
        this.getFollowUser();
      });
    } else {
      this.followUserService.followUser(this.followUserAdapter.adaptFollowUserModelSend(this.followerUserModel)).then(res => {
        this.processResponseFollower(res.status);
      }).finally(() => {
        this.isButtonFollowInAction = false;
        this.getFollowUser();
      });
    }
  }

  private processResponseFollower(resStatus: boolean): void {
    if (resStatus) {
      this.iCanFollow = false;
      this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Usuario seguido con éxito');
    }
  }

  addOrEditField(field: string): void {
    this.modalEditProfile.processDialogToShow(field, this.userToShow);
  }

  onScrollDownMyOpportunities(): void {
    if (this.paginatorMyOpportunities !== undefined && this.paginatorMyOpportunities.next !== null &&
      !this.isLoadingMyOpportunities) {
      this.isLoadingMyOpportunities = true;
      this.opportunityService.listOpportunitiesWithPagination(this.paginatorMyOpportunities)
        .then(res => {
          this.paginatorMyOpportunities = res.paginator;
          this.myOpportunities = this.myOpportunities.concat(this.opportunityAdapter.adaptList(res.data));
        })
        .finally(() => {
          this.isLoadingMyOpportunities = false;
        });
    }
  }

  getPublicationFavorites(): void {
    this.isLoadingPublications = true;
    this.publicationUserService.listPublicationUser(this.userToShow.id)
      .then(res => {
        this.publicationsFavorites = this.publicationAdapter.adaptListPublicationUserToListPublicationModel(res.data);
        this.paginatorPublicationsFavorites = res.paginator;
      })
      .finally(() => {
        this.isLoadingPublications = false;
      });
  }

  onScrollDownOpportunitiesFavorites(): void {
    if (this.paginatorOpportunitiesFavorites !== undefined && this.paginatorOpportunitiesFavorites.next !== null
      && !this.isLoadingOpportunitiesFavorites) {
      this.isLoadingOpportunitiesFavorites = true;
      this.opportunityService.listOpportunitiesWithPagination(this.paginatorOpportunitiesFavorites)
        .then(res => {
          this.paginatorOpportunitiesFavorites = res.paginator;
          this.opportunitiesFavorites = this.opportunitiesFavorites.concat(this.opportunityAdapter.adaptList(res.data));
        })
        .finally(() => {
          this.isLoadingOpportunitiesFavorites = false;
        });
    }
  }

  getMyPublications(): void {
    this.isLoadingPublications = true;
    this.publicationService.getMyPublications(this.userToShow?.id)
      .then(res => {
        this.publications = this.publicationAdapter.adaptList(res.data);
        this.paginatorMyPublications = res.paginator;
      })
      .finally(() => {
        this.isLoadingPublications = false;
      });

  }

  onScrollDownMyPublications(): void {
    if (this.paginatorMyPublications !== undefined && this.paginatorMyPublications.next !== null) {
      this.isLoadingPublications = true;
      this.publicationService.listPublicationsWithPagination(this.paginatorMyPublications)
        .then(res => {
          this.paginatorMyPublications = res.paginator;
          this.publications = this.publications.concat(this.publicationAdapter.adaptList(res.data));
        })
        .finally(() => {
          this.isLoadingPublications = false;
        });
    }
  }

  onScrollDownPublicationsFavorites(): void {
    if (this.paginatorPublicationsFavorites !== undefined && this.paginatorPublicationsFavorites.next !== null) {
      this.isLoadingPublications = true;
      this.publicationService.listPublicationsWithPagination(this.paginatorPublicationsFavorites)
        .then(res => {
          this.paginatorPublicationsFavorites = res.paginator;
          this.publicationsFavorites = this.publicationsFavorites.concat(
            this.publicationAdapter.adaptListPublicationUserToListPublicationModel(res.data));
        })
        .finally(() => {
          this.isLoadingPublications = false;
        });
    }
  }

  getPublicationsAndOpportunityFavorites(): void {
    this.activeIndex = 3;
    this.getPublicationFavorites();
    this.getOpportunitiesFavorites();
  }

  showToUpdatePhoto(): void {
    this.updatePhoto = true;
  }

  async updateUserPhoto(): Promise<void> {
    if (this.uploadedFiles != null && this.uploadedFiles.length !== 0) {
      this.buttonUserPhotoActioned = true;
      const uploadAttachments = new SendAttachments(this.fileService);
      await uploadAttachments.sendAttachments(this.uploadedFiles, this.userSession.instId)
        .then(response => {
          if (response.status) {
            const userPhotoAdapted = this.userModelAdapter.adaptUserPhoto(response.data.id);
            this.userService.partialUserUpdate(userPhotoAdapted, this.idUserToShow)
              .then(res => {
                const userAdapted = this.userModelAdapter.adaptObjectReceive(res.data);
                this.utilitiesConfigString.ls.set('user', userAdapted);
                this.userSession = this.userToShow = userAdapted;
              });
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Foto de perfil actualizada, ' +
              'los cambios pueden demorar un poco en ser propagados, puedes recargar tu navegador.');
            this.updatePhoto = false;
            this.validFile = false;
          } else {
            this.messagerService.showToast(EnumLevelMessage.ERROR, response.message);
          }
        })
        .finally(() => {
          this.buttonUserPhotoActioned = false;
        });
    }
  }

  onSelectFile(event, photo): void {
    this.uploadedFiles = [];
    for (const file of event.files) {
      if (file.type.includes('image')) {
        if (file.size <= 1024000) {
          this.uploadedFiles.push(file);
          if (event.files && event.files[0]) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imgChange = e.target.result;
            };
            reader.readAsDataURL(event.files[0]);
          }
          this.validFile = true;
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, ConstString.MESSAGE_FILE_1MB);
        }
      } else {
        this.validFile = false;
        this.messagerService.showToast(EnumLevelMessage.WARNING, 'Tipo de archivo no válido');
      }
      photo.clear();
    }

  }

  downloadPdf(): void {
    const pdfUrl = this.utilitiesConfigString.getImage(this.userToShow?.userCurriculumVitae);
    saveAs.saveAs(pdfUrl, 'Hoja de vida - ' + this.userToShow.userName);
  }

  deleteAccount(): void {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea eliminar su cuenta de Joinus? <br>' +
        '<strong> ¡Recuerda que en cualquier momento puedes volver a registrarte!</strong>',
      header: 'Confirmar eliminación de cuenta',
      icon: 'bi bi-exclamation-triangle-fill color-icon-fill-yellow',
      accept: () => {
        this.userService.deleteUser(this.userSession.id)
          .then(_ => {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Cuenta eliminada con éxito.!');
            this.utilitiesConfigString.ls.removeAll();
            this.router.navigate(['iniciar-sesion']);
          });
      }
    });
  }

  changePassword(): void {
    this.modalChangePassword.show();
  }

  private getOtherInformationUser(): void {
    this.getFollowUser();
    this.createMenuEdit();
    this.getMyPublications();
  }

  showEditProject(indexProject: number): void {
    this.modalEditProfile.showNewProjectForm(indexProject);
  }

  removeOpportunityFromView(opportunityToRemove: OpportunityModel): void {
    const index = this.myOpportunities.indexOf(opportunityToRemove, 0);
    this.myOpportunities.splice(index, 1);
  }

  removePublicationFromView(index: number): void {
    this.publications.splice(index, 1);
  }
}
