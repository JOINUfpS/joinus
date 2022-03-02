import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {CommunityUserModel} from '../../../../models/user/community-user.model';
import {StringCommunity} from '../../../../utilities/string/community/string-community';
import {ConstString} from '../../../../utilities/string/const-string';
import {CommunityUserService} from '../../../../services/user/community-user.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {CommunityUserAdapter} from '../../../../adapters/implementation/user/community-user.adapter';

@Component({
  selector: 'app-community-user-card',
  templateUrl: './community-user-card.component.html'
})
export class CommunityUserCardComponent {

  @Input() userMember: CommunityUserModel;
  @Input() userSessionMember: CommunityUserModel;
  @Input() showDesigneAdmin = false;
  @Input() showApproveOrDenyUnion = false;
  @Output() communicatorWithViewCommunity = new EventEmitter<CommunityUserModel>();
  @Output() communicatorViewCommunityResponse = new EventEmitter<void>();
  @Output() communicatorViewAdminDeleted = new EventEmitter<void>();
  hiddenProgressAprrove = true;
  hiddenProgressDeny = true;
  labelButtonApprove = this.constString.APPROVE;
  labelButtonDeny = this.constString.DENY;

  constructor(private messagerService: MessagerService,
              private router: Router,
              private communityUserService: CommunityUserService,
              private communityUserAdapter: CommunityUserAdapter,
              public utilitiesConfigString: UtilitiesConfigString,
              public stringCommunity: StringCommunity,
              public constString: ConstString) {
  }

  viewProfileUser(): void {
    this.router.navigate(['perfil', this.userMember.userId]);
  }

  showInviteTakeRoleModal(): void {
    this.communicatorWithViewCommunity.emit(this.userMember);
  }

  approveUnion(): void {
    this.hiddenProgressAprrove = false;
    this.labelButtonApprove = this.constString.APROVING;
    const BODY = {
      cous_pending_approval: false
    };
    this.communityUserService.approveUnion(BODY, this.userMember.id)
      .then(res => {
        if (res.status) {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, res.message);
          this.communicatorViewCommunityResponse.emit();
        } else {
          this.labelButtonApprove = this.constString.APPROVE;
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      }).finally(() => {
      this.hiddenProgressAprrove = true;
    });
  }

  denyUnion(): void {
    this.hiddenProgressDeny = false;
    this.labelButtonDeny = this.constString.DENYING;
    this.communityUserService.deleteCommunityUserPerUser(this.userMember.commId, this.userMember.userId)
      .then(res => {
        if (res.status) {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'La solicitud del usuario ha sido denegada');
          this.communicatorViewCommunityResponse.emit(res);
        } else {
          this.labelButtonDeny = this.constString.DENY;
          this.hiddenProgressDeny = true;
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.errors[0].detail);
        }
        this.hiddenProgressDeny = true;
      }).catch(_ => {
      this.labelButtonDeny = this.constString.DENY;
      this.hiddenProgressDeny = true;
    });
  }

  deleteAdmin(userMember): void {
    this.communityUserService.patchCommunityUser(this.communityUserAdapter.adaptDeleteAdmin(userMember), userMember.id).then(res => {
      if (res.status){
        this.communicatorViewAdminDeleted.emit();
      }
    });
  }
}
