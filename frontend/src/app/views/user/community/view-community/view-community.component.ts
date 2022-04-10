import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {v4 as uuid} from 'uuid';
import {CommunityModel} from '../../../../models/user/community.model';
import {CommunityService} from '../../../../services/user/community.service';
import {CommunityAdapter} from '../../../../adapters/implementation/user/community.adapter';
import {UserModel} from '../../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {TabView} from 'primeng/tabview';
import {CommunityUserModel} from '../../../../models/user/community-user.model';
import {CommunityUserService} from '../../../../services/user/community-user.service';
import {CommunityUserAdapter} from '../../../../adapters/implementation/user/community-user.adapter';
import {PublicationService} from '../../../../services/publication/publication.service';
import {PublicationAdapter} from '../../../../adapters/implementation/publication/publication.adapter';
import {PublicationModel} from '../../../../models/publication/publication.model';
import {InviteRoleService} from '../../../../services/user/invite-role.service';
import {RoleModel} from '../../../../models/user/role.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {InviteRoleAdapter} from '../../../../adapters/implementation/user/invite-role.adapter';
import {FileService} from '../../../../services/file/file.service';
import {SendAttachments} from '../../../../utilities/send-attachments.service';
import {CommunityUserMembers} from '../../../../adapters/abstract/community-user-members';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {NotificationService} from '../../../../services/notification/notification.service';
import {NotificationAdapter} from '../../../../adapters/implementation/notification/notification.adapter';
import {MembersCommunityAdapter} from '../../../../adapters/implementation/user/members-community.adapter';
import {StringCommunity} from '../../../../utilities/string/community/string-community';
import {ActionCommunity} from '../../../../utilities/string/community/action-community';
import {CreateEditCommunityComponent} from '../create-edit-community/create-edit-community.component';
import {notificationTypes} from '../../../../utilities/types';
import {MessagerService} from '../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';
import {ConstString} from '../../../../utilities/string/const-string';

@Component({
  selector: 'app-view-community',
  templateUrl: './view-community.component.html',
  styleUrls: ['./view-community.component.scss']
})
export class ViewCommunityComponent implements OnInit {

  @ViewChild(TabView) tabView: TabView;
  @Output() updateListMember: EventEmitter<any> = new EventEmitter();
  selectedTab = 0;
  isAdmin = false;
  userSession: UserModel;
  commId: uuid;
  community: CommunityModel;
  communityUserSession: CommunityUserModel;
  communityAdmins: CommunityUserModel[];
  communityUsers: CommunityUserModel[];
  communityOtherMembers: CommunityUserModel[];
  communityUsersPending: CommunityUserModel[] = [];
  publicationsCommunity: PublicationModel[];
  permissions: any;
  authorizeRoleButton: boolean;
  showDialogInviteUser: boolean;
  user: CommunityUserModel;
  roles: RoleModel[];
  form: FormGroup;
  formInviteUser: FormGroup;
  isLoadingPermission = true;
  isMember: boolean;
  isAPendingMember: boolean;
  isInvited = false;
  activeIndex = 0;
  private action: string;
  membersCommunity: CommunityUserMembers[] = [];
  usersNoMembers: CommunityUserMembers[] = [];
  allUsersMigthInvite: CommunityUserMembers[] = [];
  selectedUsers: CommunityUserMembers[];
  updatePhoto: boolean;
  validFile: boolean;
  uploadedFiles: any[];
  imgChange: uuid;
  items: MenuItem[];
  lengthMembersCommunity = 0;
  @ViewChild('modalCreateEditCommunity', {static: false}) modalCreateEditCommunity: CreateEditCommunityComponent;
  actionedUpdatePhoto = false;
  isLoadingPublicationsCommunity = false;
  buttonInviteToCommunityActioned = false;
  buttonAppointAdministratorActioned = false;
  actionedInvitationOrDecline = false;
  actionedAcceptInvitation = false;
  isLoadingInviteUser = false;

  constructor(private messagerService: MessagerService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private communityService: CommunityService,
              private communityAdapter: CommunityAdapter,
              private communityUserService: CommunityUserService,
              private communityUserAdapter: CommunityUserAdapter,
              private publicationService: PublicationService,
              private publicationAdapter: PublicationAdapter,
              private inviteRoleService: InviteRoleService,
              private inviteRoleAdapter: InviteRoleAdapter,
              private notificationServices: NotificationService,
              private notificationAdapter: NotificationAdapter,
              private membersCommunityAdapter: MembersCommunityAdapter,
              public constString: ConstString,
              public utilitiesConfigString: UtilitiesConfigString,
              private fileService: FileService,
              public stringCommunity: StringCommunity,
              private confirmationService: ConfirmationService,
  ) {
    this.userSession = this.utilitiesConfigString.ls.get('user');
    this.authorizeRoleButton = false;
    this.updatePhoto = false;
  }

  ngOnInit(): void {
    this.getActions();
    this.processReceivedActionInUrl();
    this.validateInvitation();
    this.getInformationCommunity();
    this.getPermissions();
    this.getPublicationsByCommunity();
  }

  getPermissions(): void {
    this.communityUserService.getCommunityUser(this.commId, this.userSession.id)
      .then(res => {
        if (res.data.length > 0) {
          this.communityUserSession = this.communityUserAdapter.adaptObjectReceive(res.data[0]);
          this.validatePermissions();
          this.formMenu();
        }
      });
  }

  showModalInviteUserToThisCommunity(): void {
    this.createFormInviteUser();
    this.getAllUsers();
  }

  getMembers(): void {
    this.selectedTab = 2;
    this.getUsersByCommunity();
  }

  formMenu(): void {
    this.items = [];
    if (this.isAdmin) {
      this.items.push(
        {
          label: 'Editar',
          icon: 'bi bi-pencil-square',
          command: (_ => this.editCommunity(this.community))
        }
      );
    }
    if (this.isMember) {
      this.items.push(
        {
          label: 'Abandonar',
          icon: 'bi bi-box-arrow-in-right',
          command: (_ => this.leaveCommunity())
        }
      );
    }
    if (this.community.commOwnerId === this.userSession.id) {
      this.items.push({
        label: 'Eliminar',
        icon: 'bi bi-x-circle',
        command: (_ => this.deleteCommunity())
      });
    }
  }

  acceptInvitation(): void {
    this.actionedAcceptInvitation = true;
    const body = this.communityUserAdapter.adaptCommunityUser(this.userSession, this.community);
    this.communityUserService.saveCommunityUser(body)
      .then(res => {
        if (res.status) {
          this.isInvited = false;
          this.isAPendingMember = res.data.cous_pending_approval;
          this.isMember = !this.isAPendingMember;
          if (this.community.commPrivacy) {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, this.stringCommunity.WAITING_FOR_APPROVAL);
          } else {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, this.stringCommunity.JOINED_COMMUNITY);
          }
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      })
      .finally(() => {
        this.actionedAcceptInvitation = false;
      });
  }

  showInviteTakeRoleModal(userToInvite: CommunityUserModel): void {
    this.authorizeRoleButton = true;
    this.user = userToInvite;
  }

  declineInvitation(): void {
    this.actionedInvitationOrDecline = true;
    this.isInvited = false;
    const BODY = this.notificationAdapter.adaptNotificationToDelete(this.userSession.id, this.commId);
    this.notificationServices.deleteNotificationCommunity(BODY)
      .then(_ => {
        this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Ha rechazado la invitación de esta comunidad.');
      })
      .finally(() => {
        this.actionedInvitationOrDecline = false;
      });
  }

  onChangeTab($event): void {
    this.selectedTab = $event.index;
  }

  getRequestJoin(): void {
    this.selectedTab = 3;
    this.getUsersByCommunity();
  }

  appointAdministrator(user): void {
    this.buttonAppointAdministratorActioned = true;
    this.inviteRoleService.inviteTakeRole(this.inviteRoleAdapter.adaptObjectSendInviteRoleCommunity(user, null))
      .then(res => {
        if (res.status) {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, `${user.userName} ahora también es administrador(a) de esta comunidad`);
          this.authorizeRoleButton = false;
          this.getUsersByCommunity();
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      })
      .finally(() => {
        this.buttonAppointAdministratorActioned = false;
      });
  }

  inviteUsersToCommunity(): void {
    this.buttonInviteToCommunityActioned = true;
    const body = this.notificationAdapter.adaptNotificationToInviteACommunity(
      this.userSession, this.selectedUsers, this.community);
    this.notificationServices.createNotificationToInviteCommunity(body)
      .then(_ => {
        this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Se han enviado las invitaciones a los usuarios seleccionados.');
      })
      .finally(() => {
        this.showDialogInviteUser = false;
        this.buttonInviteToCommunityActioned = false;
      });
  }

  getPublicationsByCommunity(): void {
    this.isLoadingPublicationsCommunity = true;
    this.publicationService.listPublicationsByCommunity(this.commId)
      .then(res => {
        this.publicationsCommunity = this.publicationAdapter.adaptList(res.data);
      })
      .finally(() => {
        this.isLoadingPublicationsCommunity = false;
      });
  }

  private getActions(): void {
    this.activatedRoute.params
      .subscribe(params => {
        this.commId = params.commId;
        this.action = params.action;
      });
  }

  private calculateLengthMembersCommunity(): void {
    this.lengthMembersCommunity = 0;
    if (this.isMember && !this.isAdmin) {
      this.lengthMembersCommunity = 1;
    }
    this.lengthMembersCommunity += this.communityOtherMembers.length + this.communityAdmins.length;
    this.updateAmountMembersCommunity();
  }

  private updateAmountMembersCommunity(): void {
    if (this.community.commAmountMember !== this.lengthMembersCommunity) {
      const bodyPatchCommunity = this.communityAdapter.adaptPatchAmountMember(this.lengthMembersCommunity);
      this.communityService.patchCommunity(bodyPatchCommunity, this.community.id).then();
    }
  }

  leaveCommunity(): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea abandonar  <b>${this.community.commName}</b>?`,
      header: 'Confirmar abandonar comunidad',
      icon: 'bi bi-exclamation-triangle-fill color-icon-fill-yellow',
      accept: () => {
        this.communityUserService.deleteCommunityUser(this.communityUserSession.id)
          .then(_ => {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Has abandonado la comunidad ' + this.community.commName);
            this.router.navigate(['usuarios/comunidades']).then();
          });
      }
    });
  }

  updateCommunityImage(): void {
    if (this.uploadedFiles != null && this.uploadedFiles.length !== 0) {
      this.actionedUpdatePhoto = true;
      const uploadAttachments = new SendAttachments(this.fileService);
      uploadAttachments.sendAttachments(this.uploadedFiles, this.userSession.instId).then(response => {
        if (response.status) {
          this.community.commPhotoId = response.data.id;
          this.communityService.updateCommunity(this.communityAdapter.adaptObjectSend(this.community))
            .then(_ => {
              this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Imagen ha sido actualizada');
              this.updatePhoto = false;
            })
            .finally(() => {
              this.actionedUpdatePhoto = false;
            });
        } else {
          this.actionedUpdatePhoto = false;
          this.messagerService.showToast(EnumLevelMessage.ERROR, response.message);
        }
      });
    }
  }

  deleteCommunity(): void {
    this.confirmationService.confirm({
      message: ConstString.CONFIRM_DELETE + this.community.commName.toUpperCase() + '?',
      accept: () => {
        this.communityService.deleteCommunity(this.commId)
          .then(_ => {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Comunidad eliminada!');
            this.router.navigate(['usuarios/comunidades']);
          });
      }
    });
  }

  private processReceivedActionInUrl(): void {
    if (this.action !== undefined && this.action === ActionCommunity.RequestCommunity) {
      this.locateInJoinRequests();
    }
  }

  cancelRequestCommunity(): void {
    this.isAPendingMember = false;
    this.communityUserService.deleteCommunityUserPerUser(this.community.id, this.userSession.id)
      .then(res => {
        if (!res.status) {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.errors[0].detail);
        }
      })
      .catch(error => {
        this.messagerService.showToast(EnumLevelMessage.ERROR, error.error.errors[0].detail);
      });
  }

  private validateInvitation(): void {
    this.notificationServices.getNotificationForUserAuthorType(this.userSession.id, this.commId, notificationTypes.INVITATION_COMMUNITY)
      .then(res => {
        if (res.data.length === 0) {
          if (this.router.url.includes('invitation')) {
            this.router.navigate(['usuarios/comunidad/', this.commId]).then();
          }
        } else {
          this.isInvited = true;
        }
      });
  }

  private locateInJoinRequests(): void {
    this.selectedTab = 3;
  }

  requestJoinCommunity(): void {
    const request = this.communityUserAdapter.adaptCommunityUser(this.userSession, this.community);
    this.communityUserService.saveCommunityUser(request)
      .then(res => {
        if (res.status) {
          this.isAPendingMember = res.data.cous_pending_approval;
          this.isMember = !this.isAPendingMember;
          this.isInvited = false;
          if (this.isMember) {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Te has unido a la comunidad!');
          } else {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Tu solicitud ha sido notificada al propietario de la comunidad');
          }
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.errors[0].detail);
        }
      });
  }

  showToUpdatePhoto(): void {
    this.updatePhoto = true;
  }

  private getInformationCommunity(): any {
    this.communityService.getCommunityById(this.commId)
      .then(res => {
        this.community = this.communityAdapter.adaptObjectReceive(res.data);
        this.imgChange = this.utilitiesConfigString.getImage(this.community.commPhotoId);
      });
  }

  removeRequestUnionFromView(requestUnionToRemove: CommunityUserModel): void {
    const div = document.getElementById(requestUnionToRemove.id);
    div.remove();
    const indexUserPending = this.communityUsersPending.findIndex(userPending => userPending.id === requestUnionToRemove.id);
    this.communityUsersPending.splice(indexUserPending, 1);
  }

  notifyNewPostInCommunity(publId: uuid): void {
    const bodyNotification = this.notificationAdapter.adaptCommunityPostNotification(
      this.userSession.id, this.membersCommunity, publId, this.userSession.userName, this.userSession.userPhoto,
      this.community.id, this.community.commName);
    this.notificationServices.notifyNewPublicationCommunity(bodyNotification).then();
  }

  editCommunity(community): void {
    if (community !== null) {
      this.modalCreateEditCommunity.show(community, this.userSession?.instId);
    }
  }

  private validatePermissions(): void {
    if (this.communityUserSession !== undefined) {
      this.isAdmin = this.communityUserSession?.cousAdmin;
      this.isAPendingMember = this.communityUserSession.cousPendingApproval;
      this.isMember = !this.isAPendingMember;
    }
    this.isLoadingPermission = false;
  }

  onSelectFile(event, photo): void {
    this.uploadedFiles = [];
    for (const file of event.files) {
      if (file.size <= 1024000) {
        if (file.type === 'image/png' ||
          file.type === 'image/jpg' ||
          file.type === 'image/jpeg') {
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
          this.validFile = false;
          this.messagerService.showToast(EnumLevelMessage.WARNING, 'Tipo de archivo no válido');
        }
      } else {
        this.messagerService.showToast(EnumLevelMessage.ERROR, ConstString.MESSAGE_FILE_1MB);
      }
      photo.clear();
    }

  }

  public getAllUsers(): void {
    this.showDialogInviteUser = true;
    if (this.allUsersMigthInvite === undefined || this.allUsersMigthInvite.length === 0) {
      this.isLoadingInviteUser = true;
      this.communityUserService.getMembersAndNoMembers(this.community.instId, this.community.id)
        .then(res => {
          this.usersNoMembers = this.membersCommunityAdapter.adaptList(res.data.no_members);
          this.membersCommunity = this.membersCommunityAdapter.adaptList(res.data.members);
          this.allUsersMigthInvite = this.allUsersMigthInvite.concat(this.usersNoMembers);
          this.allUsersMigthInvite = this.allUsersMigthInvite.concat(this.membersCommunity);
          this.formInviteUser.enable();
        })
        .finally(() => {
          this.isLoadingInviteUser = false;
        });
    } else {
      this.showDialogInviteUser = true;
      this.formInviteUser.enable();
    }
  }

  updateCommunity(community: CommunityModel): void {
    this.community = community;
  }

  private getUsersByCommunity(): void {
    this.communityUserService.getUsersByCommunity(this.commId)
      .then(res => {
          this.communityUsers = this.communityUserAdapter.adaptList(res.data);
          this.communityAdmins = this.communityUsers.filter(c => c.cousAdmin);
          this.communityOtherMembers = this.communityUsers.filter(c =>
            !c.cousAdmin && c.userId !== this.userSession.id && !c.cousPendingApproval);
          this.communityUsersPending = this.communityUsers.filter(c => c.cousPendingApproval);
          this.calculateLengthMembersCommunity();
        }
      );
  }

  private createFormInviteUser(): any {
    if (this.formInviteUser === undefined) {
      this.formInviteUser = new FormGroup({
        usersToInvite: new FormControl({
          value: null,
          disabled: false
        }, [Validators.required, Validators.maxLength(100)]),
      });
    }
  }
}
