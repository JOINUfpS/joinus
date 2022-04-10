import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {OpportunityModel} from '../../../../models/institutions/opportunity.model';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {ApplyOpportunityComponent} from '../apply-opportunity/apply-opportunity.component';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {OpportunityService} from '../../../../services/institution/opportunity.service';
import {UserModel} from '../../../../models/user/user.model';
import {OpportunityAdapter} from '../../../../adapters/implementation/institutions/opportunity.adapter';
import {Router} from '@angular/router';
import {CreateEditOpportunityComponent} from '../create-edit-opportunity/create-edit-opportunity.component';
import {MessagerService} from '../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';
import {Observable, Subscription} from 'rxjs';
import {v4 as uuid} from 'uuid';
import {ConstString} from '../../../../utilities/string/const-string';

@Component({
  selector: 'app-card-opportunity',
  templateUrl: './card-opportunity.component.html'
})
export class CardOpportunityComponent implements OnInit {

  private eventsSubscription: Subscription;
  @Input() unBookmarkedObservable: Observable<uuid>;
  @Input() opportunity: OpportunityModel;
  @Input() save: OpportunityModel;
  @Input() saveButton: boolean;
  @Input() applyButton: boolean;
  @Input() editButton: boolean;
  @Input() userSession: UserModel;
  @Input() indexOpportunity: number;
  @ViewChild('modalApplyOpportunity', {static: false}) modalApplyOpportunity: ApplyOpportunityComponent;
  @ViewChild('modalCreateEditOpportunity', {static: false}) modalOpportunities: CreateEditOpportunityComponent;
  @Output() eventDelete = new EventEmitter<OpportunityModel>();
  @Output() eventBookmarked = new EventEmitter<OpportunityModel>();
  @Output() eventDeleteOpportunitySaved = new EventEmitter<OpportunityModel>();
  items: MenuItem[];
  savedEvent = 'bookmark';
  private iSavedIt = false;

  constructor(
    public utilitiesString: UtilitiesConfigString,
    private opportunityService: OpportunityService,
    private opportunityAdapter: OpportunityAdapter,
    private confirmationService: ConfirmationService,
    private router: Router,
    private messagerService: MessagerService) {
    this.saveButton = true;
    this.applyButton = true;
    this.editButton = false;
  }

  ngOnInit(): void {
    this.initObservableBookmarked();
    this.knowHaveItSaved() ? this.bookmarkOpportunity() : this.unBookmarkOpportunity();
    this.items = [
      {
        label: 'Editar',
        icon: 'bi bi-pencil-square',
        command: (_ => this.edit(this.opportunity))
      },
      {
        label: 'Eliminar',
        icon: 'bi bi-x-circle',
        command: (_ => this.delete())
      },
    ];
  }

  private initObservableBookmarked(): void {
    this.eventsSubscription = this.unBookmarkedObservable.subscribe((idOpportunityToUnbookmark) => {
      if (this.opportunity.id === idOpportunityToUnbookmark) {
        this.unBookmarkOpportunity();
      }
    });
  }

  apply(opportunity): void {
    this.modalApplyOpportunity.show(opportunity);
  }

  processSave(opportunity: OpportunityModel): void {
    this.iSavedIt ? this.removeSavedFromOpportunity() : this.saveOpportunity(opportunity);
  }

  knowHaveItSaved(): boolean {
    return this.opportunity?.oppoUserSaved.includes(this.userSession?.id);
  }

  removeSavedFromOpportunity(): void {
    const listOppoUserSaved = this.opportunity.oppoUserSaved;
    const indexOpportunityUserSaved = listOppoUserSaved.findIndex(idOpportunityUserSaved => idOpportunityUserSaved === this.userSession.id);
    listOppoUserSaved.splice(indexOpportunityUserSaved, 1);
    this.opportunity.oppoUserSaved = listOppoUserSaved;
    this.opportunityService.updateOpportunity(this.opportunityAdapter.adaptObjectSend(this.opportunity)).then(res => {
      if (res.status) {
        this.unBookmarkOpportunity();
      }
    });
    this.eventDeleteOpportunitySaved.emit(this.opportunity);
  }

  saveOpportunity(opportunity: OpportunityModel): void {
    this.bookmarkOpportunity();
    opportunity.oppoUserSaved.push(this.userSession.id);
    const opportunityRequest = this.opportunityAdapter.adaptObjectSend(opportunity);
    this.opportunityService.updateOpportunity(opportunityRequest)
      .then(res => {
        if (res.status) {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Oportunidad guardada!');
          this.eventBookmarked.emit(this.opportunityAdapter.adaptObjectReceive(res.data));
        } else {
          this.unBookmarkOpportunity();
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      }).catch(_ => {
      this.bookmarkOpportunity();
    });
  }

  private bookmarkOpportunity(): void {
    this.savedEvent = 'bookmark-fill';
    this.iSavedIt = true;
  }

  private unBookmarkOpportunity(): void {
    this.savedEvent = 'bookmark';
    this.iSavedIt = false;
  }

  edit(opportunity: OpportunityModel): void {
    if (opportunity !== null) {
      this.modalOpportunities.show(opportunity);
    }
  }

  delete(): void {
    this.confirmationService.confirm({
      message: ConstString.CONFIRM_DELETE + 'la oportunidad ' + this.opportunity.oppoTitle + '?',
      accept: () => {
        this.opportunityService.deleteOpportunity(this.opportunity.id)
          .then(_ => {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Oportunidad eliminada!');
            this.eventDelete.emit(this.opportunity);
          });
      }
    });
  }

  updateOpportunity(opportunity: OpportunityModel): void {
    this.opportunity = opportunity;
  }

}
