import {Component, OnInit, ViewChild} from '@angular/core';
import {OpportunityService} from '../../../../services/institution/opportunity.service';
import {OpportunityAdapter} from '../../../../adapters/implementation/institutions/opportunity.adapter';
import {OpportunityModel} from '../../../../models/institutions/opportunity.model';
import {ContainerComponent} from '../../../container/container.component';
import {CreateEditOpportunityComponent} from '../create-edit-opportunity/create-edit-opportunity.component';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {Subject} from 'rxjs';
import {v4 as uuid} from 'uuid';

@Component({
  selector: 'app-list-opportunity',
  templateUrl: './list-opportunity.component.html'
})
export class ListOpportunityComponent implements OnInit {

  public opportunities: OpportunityModel[] = [];
  public userImage: string;
  public userSession;
  public searchField: string;
  public userOpportunities: OpportunityModel[] = [];
  public paginator: any;
  public isLoadingOpportunity = false;
  @ViewChild('modalOpportunities', {static: false}) modalOpportunities: CreateEditOpportunityComponent;
  @ViewChild('dt', {static: false}) dt: any;
  eventsBookmarkedSubject: Subject<uuid> = new Subject<uuid>();
  constructor(private app: ContainerComponent,
              private opportunityService: OpportunityService,
              private opportunityAdapter: OpportunityAdapter,
              public utilitiesString: UtilitiesConfigString) {
    this.userSession = this.utilitiesString.ls.get('user');
    this.userImage = this.userSession.userImage;
  }

  ngOnInit(): void {
    this.getOpportunities();
    this.getUserOpportunities();
  }

  getOpportunities(): void {
    this.isLoadingOpportunity = true;
    this.opportunityService.listOpportunities()
      .then((resp: any) => {
        this.opportunities = this.opportunityAdapter.adaptList(resp.data);
        this.paginator = resp.paginator;
      }).finally(() => {
      this.isLoadingOpportunity = false;
    });
  }

  onScrollDown(): void {
    if (this.paginator.next !== null && !this.isLoadingOpportunity) {
      this.isLoadingOpportunity = true;
      this.opportunityService.listOpportunitiesWithPagination(this.paginator)
        .then(res => {
          this.paginator = res.paginator;
          res.data.forEach(opportunity =>
            this.opportunities.push(this.opportunityAdapter.adaptObjectReceive(opportunity))
          );
        }).finally(() => {
        this.isLoadingOpportunity = false;
      });
    }
  }

  add(data): void {
    this.modalOpportunities.show(data);
  }

  getMatchOpportunities(): void {
    if (this.searchField !== '') {
      this.isLoadingOpportunity = true;
      this.opportunityService.searchOpportunitiesByTerm(this.userSession.instId, this.searchField)
        .then(res => {
          this.opportunities = this.opportunityAdapter.adaptList(res.data);
        })
        .finally(() => {
          this.isLoadingOpportunity = false;
        });
    } else {
      this.getOpportunities();
    }
  }

  getUserOpportunities(): void {
    this.opportunityService.userOpportunities(this.userSession.instId, this.userSession.id)
      .then(res => {
        this.userOpportunities = this.opportunityAdapter.adaptList(res.data);
      });
  }

  addNewOpportunity(opportunity: OpportunityModel): void {
    this.opportunities.unshift(opportunity);
  }

  removeOpportunityFromView(opportunityToRemove: OpportunityModel): void {
    const index = this.opportunities.indexOf(opportunityToRemove, 0);
    this.opportunities.splice(index, 1);
  }

  updateListOfMarked(opportunityModel: OpportunityModel): void {
    this.userOpportunities.unshift(opportunityModel);
  }

  removeOpportunitySavedFromView(opportunityToRemove: OpportunityModel): void {
    const opportunity = this.userOpportunities.filter(userOpportunity => userOpportunity.id === opportunityToRemove.id)[0];
    const index = this.userOpportunities.indexOf(opportunity);
    this.userOpportunities.splice(index, 1);
    this.clearBookmarkedFromOpportunity(opportunityToRemove.id);
  }

  private clearBookmarkedFromOpportunity(opportunityId: uuid): void {
    this.eventsBookmarkedSubject.next(opportunityId);
  }
}
