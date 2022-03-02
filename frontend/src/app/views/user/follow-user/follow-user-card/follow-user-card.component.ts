import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FollowUserModel} from '../../../../models/user/follow.user.model';
import {FollowUserServices} from '../../../../services/user/follow_user.services';
import {FollowUserAdapter} from '../../../../adapters/implementation/user/follow-user.adapter';
import {Router} from '@angular/router';
import {v4 as uuid} from 'uuid';
import {UserModel} from '../../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';

@Component({
  selector: 'app-follow-user-card',
  templateUrl: './follow-user-card.component.html'
})
export class FollowUserCardComponent implements OnInit {

  @Input()
  public suggestedUser: FollowUserModel;
  @Input()
  public follow = false;
  @Input()
  public dashboard = false;
  @Output()
  public updateList: EventEmitter<any> = new EventEmitter();
  @Input()
  public observerUserId: uuid;
  public hiddenFollow: boolean;
  public hiddenUnfollow: boolean;
  public hiddenFollowing: boolean;
  public nameToShow: string;
  public userDegreeToShow: string;
  public idUserToShow: uuid;
  public isBidirectional: boolean;
  public userSession: UserModel;
  public userPhotoToShow: uuid;
  public buttonFollowUserActioned = false;
  public buttonUnfollowUserActioned = false;

  constructor(private messagerService: MessagerService,
              private followUserService: FollowUserServices,
              private followUserAdapter: FollowUserAdapter,
              public utilitiesConfigString: UtilitiesConfigString) {
    this.userSession = this.utilitiesConfigString.ls.get('user');
  }

  ngOnInit(): void {
    this.userSession = this.utilitiesConfigString.ls.get('user');
    this.chooseInformationToShow();
    this.setHiddenFollow();
    this.setHiddenUnFollow();
  }

  followUser(): void {
    this.buttonFollowUserActioned = true;
    const body = this.followUserAdapter.adaptFollowUserModelSend(this.suggestedUser);
    this.followUserService.followUser(body)
      .then(res => {
        if (res.status) {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Usuario seguido con éxito');
          this.hiddenFollow = true;
          this.updateList.emit();
        }
      }).finally(() => {
      this.buttonFollowUserActioned = false;
    });
  }

  unfollowUser(): void {
    this.buttonUnfollowUserActioned = true;
    this.follow = false;
    const body = this.followUserAdapter.adaptFollowUserModelSend(this.suggestedUser);
    this.followUserService.unfollowUser(body, this.userSession.id)
      .then(res => {
        this.messagerService.showToast(EnumLevelMessage.SUCCESS, res.message);
        this.hiddenUnfollow = true;
        this.updateList.emit();
      }).finally(() => {
      this.buttonUnfollowUserActioned = false;
    });
  }

  private chooseInformationToShow(): void {
    this.isBidirectional = this.suggestedUser.fousIsBidirectional;
    if (this.observerUserId !== this.suggestedUser.userId) {
      this.nameToShow = this.suggestedUser.nameUser;
      this.userDegreeToShow = this.suggestedUser.userDegree.careerName;
      this.idUserToShow = this.suggestedUser.userId;
      this.userPhotoToShow = this.suggestedUser.userPhoto;
    } else {
      this.nameToShow = this.suggestedUser.nameFous;
      this.userDegreeToShow = this.suggestedUser.fousDegree.careerName;
      this.idUserToShow = this.suggestedUser.fousUserId;
      this.userPhotoToShow = this.suggestedUser.fousPhoto;
    }
  }

  private setHiddenFollow(): void {
    this.hiddenFollow = this.observerUserId !== this.userSession.id || this.idUserToShow === this.userSession.id
      || this.isBidirectional || !this.follow;
    if (this.dashboard) {
      this.hiddenFollow = false;
    }
  }

  private setHiddenUnFollow(): void {
    this.hiddenUnfollow = this.observerUserId !== this.userSession.id || this.follow;
  }

}
