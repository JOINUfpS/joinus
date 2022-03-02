import {Component, OnInit, ViewChild} from '@angular/core';
import {CreateEditCommunityComponent} from '../create-edit-community/create-edit-community.component';
import {ContainerComponent} from '../../../container/container.component';
import {CommunityAdapter} from '../../../../adapters/implementation/user/community.adapter';
import {CommunityService} from '../../../../services/user/community.service';
import {CommunityUserService} from '../../../../services/user/community-user.service';
import {UserModel} from '../../../../models/user/user.model';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {CommunityModel} from '../../../../models/user/community.model';
import {v4 as uuid} from 'uuid';
import {Router} from '@angular/router';
import {StringRoute} from '../../../../utilities/routes/string-route';


@Component({
  selector: 'app-list-group',
  templateUrl: './list-community.component.html'
})
export class ListCommunityComponent implements OnInit {

  @ViewChild('modalCommunity', {static: false}) modalCommunity: CreateEditCommunityComponent;
  @ViewChild('dt', {static: false}) dt: any;

  public communitiesMember: CommunityModel[];
  public communitiesManaged: CommunityModel[];
  public communitiesPendingApproval: CommunityModel[];
  public otherCommunities: CommunityModel[];
  public userSession: UserModel;
  public permissions: any;
  public activeIndex = 0;

  constructor(private router: Router,
              private app: ContainerComponent,
              private communityService: CommunityService,
              private communityUserServices: CommunityUserService,
              private adapterCommunity: CommunityAdapter,
              public utilitiesConfigString: UtilitiesConfigString) {

    this.userSession = this.utilitiesConfigString.ls.get('user');
  }

  ngOnInit(): void {
    this.getAllCategoriesOfCommunities();
  }

  getAllCategoriesOfCommunities(): void {
    this.communityService.getAllCategoriesOfCommunities(this.userSession.instId, this.userSession.id)
      .then(res => {
        this.communitiesManaged = this.adapterCommunity.adaptList(res.data.communities_managed);
        this.communitiesMember = this.adapterCommunity.adaptList(res.data.communities_member);
        this.communitiesPendingApproval = this.adapterCommunity.adaptList(res.data.communities_pending_approval);
        this.otherCommunities = this.adapterCommunity.adaptList(res.data.other_communities);
      });
  }

  addCommunity(data): any {
    if (data !== null) {
      this.modalCommunity.show(data, this.userSession.instId);
    } else {
      this.modalCommunity.show(null, this.userSession.instId);
    }
  }

  seeCommunity(communityId: uuid): void {
    this.router.navigate([StringRoute.COMMUNITY, communityId]);
  }
}
