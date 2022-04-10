import {Component, OnInit, ViewChild} from '@angular/core';
import {UserModel} from '../../models/user/user.model';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {FollowUserServices} from '../../services/user/follow_user.services';
import {FollowUserAdapter} from '../../adapters/implementation/user/follow-user.adapter';
import {FollowUserModel} from '../../models/user/follow.user.model';
import {FollowUserCardComponent} from '../user/follow-user/follow-user-card/follow-user-card.component';
import {PublicationService} from '../../services/publication/publication.service';
import {PublicationModel} from '../../models/publication/publication.model';
import {PublicationAdapter} from '../../adapters/implementation/publication/publication.adapter';
import {LoadingService} from '../../services/loading/loading.service';
import {ModulesModel} from '../../models/user/modules.model';
import {ConstModules} from '../../utilities/string/security/const-modules';
import {ConstString} from '../../utilities/string/const-string';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  @ViewChild('cardFollowUser', {static: false}) cardFollowUser: FollowUserCardComponent;
  public suggestedUsers: FollowUserModel[];
  userSession: UserModel;
  public publications: PublicationModel[];
  public paginator: any;
  public isLoadingPublications = false;
  public modelGrouped: ModulesModel[];
  numberFollowedUsers: number;
  numberFollowerUsers: number;
  public userIntro: string;
  public labelSeeIntro: string;
  public showRolesFunctions = false;

  constructor(public utilitiesString: UtilitiesConfigString,
              private followUserServices: FollowUserServices,
              private followUserAdapter: FollowUserAdapter,
              private loadingService: LoadingService,
              private publicationService: PublicationService,
              private publicationAdapter: PublicationAdapter) {
    this.modelGrouped = [];
  }

  ngOnInit(): void {
    this.userSession = this.utilitiesString.ls.get('user');
    this.getNumberUsersFollowedAndFollowers();
    this.getSuggestedUsers();
    this.loadMenu();
    this.getPublications();
    this.seeIntro();
    this.showRoleFunctions();
  }

  showRoleFunctions(): void {
    if (this.modelGrouped.length !== 0) {
      this.modelGrouped.forEach(role => {
        if (role.moduName === ConstModules.ROLES || role.moduName === ConstModules.CATEGORIES
          || role.moduName === ConstModules.INSTITUTIONS || role.moduName === ConstModules.AUTHORIZE_ROLE) {
          this.showRolesFunctions = true;
        }
      });
    }
  }

  updateViewFollows(): void {
    this.getSuggestedUsers();
    this.getNumberUsersFollowedAndFollowers();
  }

  private getSuggestedUsers(): void {
    this.followUserServices.getSuggestedUsers(this.userSession.instId, this.userSession.id)
      .then(res => {
        this.suggestedUsers = this.followUserAdapter.adaptUserModelToFollowUserModel(this.userSession, res.data);
      });
  }

  getPublications(): void {
    this.isLoadingPublications = true;
    this.publicationService.listPublications()
      .then(res => {
        this.publications = this.publicationAdapter.adaptPublicationsWithOutCommunity(res.data);
        this.paginator = res.paginator;
      })
      .finally(() => {
        this.isLoadingPublications = false;
      });
  }

  loadMenu(): void {
    const roleStructure = this.utilitiesString.ls.get('permissions');
    if (roleStructure != null) {
      this.modelGrouped = roleStructure;
    }
  }

  onScrollDown(): void {
    if (this.paginator.next !== null && !this.isLoadingPublications) {
      this.isLoadingPublications = true;
      this.publicationService.listPublicationsWithPagination(this.paginator)
        .then(res => {
          this.paginator = res.paginator;
          this.publications = this.publications.concat(this.publicationAdapter.adaptList(res.data));
        }).finally(() => {
        this.isLoadingPublications = false;
      });
    }
  }

  private getNumberUsersFollowedAndFollowers(): void {
    this.followUserServices.getUsersFollowedAndFolllowers(this.userSession.instId, this.userSession.id)
      .then(res => {
        this.numberFollowedUsers = res.data.followed_users.length;
        this.numberFollowerUsers = res.data.followers_users.length;
      });
  }

  addNewPublication(publication: PublicationModel): void {
    this.publications.unshift(publication);
  }

  removePublicationFromDOM(index: number): void {
    this.publications.splice(index, 1);
  }

  seeIntro(): void {
    if (this.labelSeeIntro === ConstString.SEE_MORE) {
      this.seeLess();
    } else {
      this.seeMore();
    }
  }

  seeMore(): void {
    this.userIntro = this.userSession.userIntro.trim();
    if (this.userSession.userIntro.length > 300) {
      this.userIntro = this.userSession.userIntro.slice(0, 300);
      this.userIntro = this.userIntro + '...';
      this.labelSeeIntro = ConstString.SEE_MORE;
    }
  }

  seeLess(): void {
    this.userIntro = this.userSession?.userIntro.slice(0);
    this.labelSeeIntro = ConstString.SEE_LEST;
  }

}
