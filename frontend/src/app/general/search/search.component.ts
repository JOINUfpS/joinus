import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UsersService} from '../../services/user/user.service';
import {UserModel} from '../../models/user/user.model';
import {UserAdapter} from '../../adapters/implementation/user/user.adapter';
import {PublicationModel} from '../../models/publication/publication.model';
import {PublicationService} from '../../services/publication/publication.service';
import {PublicationAdapter} from '../../adapters/implementation/publication/publication.adapter';
import {OpportunityModel} from '../../models/institutions/opportunity.model';
import {OpportunityService} from '../../services/institution/opportunity.service';
import {OpportunityAdapter} from '../../adapters/implementation/institutions/opportunity.adapter';
import {CommunityModel} from '../../models/user/community.model';
import {CommunityService} from '../../services/user/community.service';
import {CommunityAdapter} from '../../adapters/implementation/user/community.adapter';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';

enum TabViewName {
  Users = 0,
  Communities,
  PublicationsStandard,
  Questions,
  Opportunities,
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

  selectedIndex: number;
  stringToSearch: string;
  usersFound: UserModel [];
  publicationsFound: PublicationModel [];
  questionsFound: PublicationModel [];
  opportunitiesFound: OpportunityModel[];
  communitiesFound: CommunityModel [];
  isLoading: boolean;
  private userSession: UserModel;
  private paginatorUserFound: any;
  private paginatorPublicationsFound: any;
  private paginatorQuestionsFound: any;
  private paginatorOpportunitiesFound: any;
  private paginatorCommunitiesFound: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private userAdapter: UserAdapter,
    private publicationService: PublicationService,
    private publicationAdapter: PublicationAdapter,
    private opportunityService: OpportunityService,
    private opportunityAdapter: OpportunityAdapter,
    private communityService: CommunityService,
    private communityAdapter: CommunityAdapter,
    private utilitiesConfigString: UtilitiesConfigString) {
    this.isLoading = false;
    this.selectedIndex = 0;
    this.paginatorUserFound = {};
    this.paginatorPublicationsFound = {};
    this.paginatorQuestionsFound = {};
    this.paginatorOpportunitiesFound = {};
    this.paginatorCommunitiesFound = {};
  }

  ngOnInit(): void {
    this.userSession = this.utilitiesConfigString.ls.get('user');
    this.activatedRoute.params
      .subscribe(params => {
        this.stringToSearch = params.stringToSearch;
        this.getMatchUsers();
      });
  }

  search(): void {
    this.validateQueryToBeMade(this.selectedIndex);
  }

  validateQueryToBeMade(tabViewSelected: number): void {
    this.selectedIndex = tabViewSelected;
    if (this.stringToSearch?.trim().length > 0) {
      switch (this.selectedIndex) {
        case TabViewName.Users:
          this.getMatchUsers();
          break;
        case TabViewName.Communities:
          this.getMatchCommunities();
          break;
        case TabViewName.PublicationsStandard:
          this.getMatchPublications();
          break;
        case TabViewName.Questions:
          this.getMatchQuestions();
          break;
        case TabViewName.Opportunities:
          this.getMatchOpportunities();
          break;
        default:
          this.getMatchUsers();
          break;
      }
    }
  }

  private getMatchUsers(): void {
    this.showSkeleton();
    this.userService.getUserByName(this.userSession.instId, this.stringToSearch)
      .then(res => {
        this.usersFound = this.userAdapter.adaptList(res.data);
        this.paginatorUserFound = res.paginator;
      })
      .finally(() => {
        this.hiddenSkeleton();
      });
  }

  private getMatchCommunities(): void {
    this.showSkeleton();
    this.communityService.searchCommunitiesByTerm(this.userSession.instId, this.stringToSearch)
      .then(res => {
        this.communitiesFound = this.communityAdapter.adaptList(res.data);
        this.paginatorCommunitiesFound = res.paginator;
      })
      .finally(() => {
        this.hiddenSkeleton();
      });
  }

  private getMatchPublications(): void {
    this.showSkeleton();
    this.publicationService.searchPublicationsByTerm(this.userSession.instId, this.stringToSearch)
      .then(res => {
        this.publicationsFound = this.publicationAdapter.adaptPublicationsWithOutCommunity(res.data);
        this.paginatorPublicationsFound = res.paginator;
      })
      .finally(() => {
        this.hiddenSkeleton();
      });
  }

  private getMatchQuestions(): void {
    this.showSkeleton();
    this.publicationService.searchQuestionByTerm(this.userSession.instId, this.stringToSearch)
      .then(res => {
        this.questionsFound = this.publicationAdapter.adaptPublicationsWithOutCommunity(res.data);
        this.paginatorQuestionsFound = res.paginator;
      })
      .finally(() => {
        this.hiddenSkeleton();
      });
  }

  private getMatchOpportunities(): void {
    this.showSkeleton();
    this.opportunityService.searchOpportunitiesByTerm(this.userSession.instId, this.stringToSearch)
      .then(res => {
        this.opportunitiesFound = this.opportunityAdapter.adaptList(res.data);
        this.paginatorOpportunitiesFound = res.paginator;
      })
      .finally(() => {
        this.hiddenSkeleton();
      });
  }

  onScrollDownUser(): void {
    if (this.paginatorUserFound.next !== null) {
      this.showSkeleton();
      this.userService.getUserWithPaginator(this.paginatorUserFound)
        .then(res => {
          this.paginatorUserFound = res.paginator;
          this.usersFound = this.usersFound.concat(this.userAdapter.adaptList(res.data));
        })
        .finally(() => {
          this.hiddenSkeleton();
        });
    }
  }

  onScrollDownCommunity(): void {
    if (this.paginatorCommunitiesFound.next !== null) {
      this.showSkeleton();
      this.communityService.getCommunityWithPaginator(this.paginatorCommunitiesFound)
        .then(res => {
          this.paginatorCommunitiesFound = res.paginator;
          this.communitiesFound = this.communitiesFound.concat(this.communityAdapter.adaptList(res.data));
        })
        .finally(() => {
          this.hiddenSkeleton();
        });
    }
  }

  onScrollDownPublications(): void {
    if (this.paginatorPublicationsFound.next !== null) {
      this.showSkeleton();
      this.publicationService.listPublicationsWithPagination(this.paginatorPublicationsFound)
        .then(res => {
          this.paginatorPublicationsFound = res.paginator;
          this.publicationsFound = this.publicationsFound.concat(this.publicationAdapter.adaptList(res.data));
        })
        .finally(() => {
          this.hiddenSkeleton();
        });
    }
  }

  onScrollDownQuestions(): void {
    if (this.paginatorQuestionsFound.next !== null) {
      this.showSkeleton();
      this.publicationService.listPublicationsWithPagination(this.paginatorQuestionsFound)
        .then(res => {
          this.paginatorQuestionsFound = res.paginator;
          this.questionsFound = this.questionsFound.concat(this.publicationAdapter.adaptList(res.data));
        })
        .finally(() => {
          this.hiddenSkeleton();
        });
    }
  }

  onScrollDownOpportunities(): void {
    if (this.paginatorOpportunitiesFound.next !== null) {
      this.showSkeleton();
      this.opportunityService.listOpportunitiesWithPagination(this.paginatorOpportunitiesFound)
        .then(res => {
          this.paginatorOpportunitiesFound = res.paginator;
          this.opportunitiesFound = this.opportunitiesFound.concat(this.opportunityAdapter.adaptList(res.data));
        })
        .finally(() => {
          this.hiddenSkeleton();
        });
    }
  }

  showSkeleton(): void {
    this.isLoading = true;
  }

  private hiddenSkeleton(): void {
    this.isLoading = false;
  }
}
