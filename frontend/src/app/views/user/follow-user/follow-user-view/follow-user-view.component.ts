import {Component, Input, ViewChild} from '@angular/core';
import {UserModel} from '../../../../models/user/user.model';
import {FollowUserServices} from '../../../../services/user/follow_user.services';
import {FollowUserModel} from '../../../../models/user/follow.user.model';
import {FollowUserAdapter} from '../../../../adapters/implementation/user/follow-user.adapter';
import {v4 as uuid} from 'uuid';
import {FollowUserCardComponent} from '../follow-user-card/follow-user-card.component';

@Component({
  selector: 'app-follow-user',
  templateUrl: './follow-user-view.component.html'
})
export class FollowUserViewComponent {

  @ViewChild('cardFollowUser', {static: false}) cardFollowUser: FollowUserCardComponent;
  @Input() user: UserModel;
  @Input() observerUserId: uuid;
  followersUsers: FollowUserModel [];
  followedUsers: FollowUserModel [];
  activeIndex = 0;

  constructor(
    private followUserServices: FollowUserServices,
    private followUserAdapter: FollowUserAdapter) {
  }

  getUsersFollowedAndFollowers(instIdUser: uuid, userId: uuid): void {
    this.followUserServices.getUsersFollowedAndFolllowers(instIdUser, userId)
      .then(res => {
        this.followedUsers = this.followUserAdapter.adaptList(res.data.followed_users);
        this.followersUsers = this.followUserAdapter.adaptList(res.data.followers_users);
      });
  }

}
