import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommunityModel} from '../../../../models/user/community.model';
import {CommunityService} from '../../../../services/user/community.service';
import {CommunityUserService} from '../../../../services/user/community-user.service';
import {CommunityAdapter} from '../../../../adapters/implementation/user/community.adapter';
import {CommunityUserAdapter} from '../../../../adapters/implementation/user/community-user.adapter';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {UserModel} from '../../../../models/user/user.model';
import {StringRoute} from '../../../../utilities/routes/string-route';
import {MessagerService} from '../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';

@Component({
  selector: 'app-community-card',
  templateUrl: './community-card.component.html'
})
export class CommunityCardComponent implements OnInit {

  @Input() community: CommunityModel;
  @Input() showButton = false;
  @Input() pendingApproval = false;
  public labelButton: string;
  private readonly userSession: UserModel;
  private readonly pendingMessage = 'Pendiente';
  private readonly communityJoinMessage = 'Unirte a la comunidad';
  private readonly goToTheCommunityMessage = 'Ir a la comunidad';

  constructor(private router: Router,
              private communityService: CommunityService,
              private communityUserServices: CommunityUserService,
              private adapterCommunity: CommunityAdapter,
              private adapterCommunityUser: CommunityUserAdapter,
              private messagerService: MessagerService,
              public utilitiesConfigString: UtilitiesConfigString,
  ) {
    this.userSession = this.utilitiesConfigString.ls.get('user');
  }

  ngOnInit(): void {
    this.evaluateButtonMessage();
  }

  evaluateButtonMessage(): void {
    if (this.showButton) {
      if (this.pendingApproval) {
        this.labelButton = this.pendingMessage;
      } else {
        this.labelButton = this.communityJoinMessage;
      }
    } else {
      this.labelButton = this.goToTheCommunityMessage;
    }
  }

  evaluateRequest(): void {
    switch (this.labelButton) {
      case this.communityJoinMessage:
        this.requestJoinCommunity();
        break;
      case this.goToTheCommunityMessage:
        this.goToTheCommunity();
        break;
      case this.pendingMessage:
        this.cancelJoinCommunity();
        break;
    }
  }

  requestJoinCommunity(): void {
    this.labelButton = 'Solicitando...';
    const request = this.adapterCommunityUser.adaptCommunityUser(this.userSession, this.community);
    this.communityUserServices.saveCommunityUser(request)
      .then(res => {
        if (res.status) {
          if (this.community.commPrivacy) {
            this.labelButton = this.pendingMessage;
          } else {
            this.labelButton = this.goToTheCommunityMessage;
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Te has unido a la comunidad!');
          }
        } else {
          this.labelButton = this.communityJoinMessage;
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      })
      .catch(_ => {
        this.labelButton = this.communityJoinMessage;
      });
  }

  cancelJoinCommunity(): void {
    this.labelButton = this.communityJoinMessage;
    this.communityUserServices.deleteCommunityUserPerUser(this.community.id, this.userSession.id)
      .then(res => {
        if (!res.status) {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
          this.labelButton = this.pendingMessage;
        }
      });
  }

  goToTheCommunity(): void {
    this.router.navigate([StringRoute.COMMUNITY, this.community.id]).then();
  }

}
