import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {OpportunityModel} from '../../../../models/institutions/opportunity.model';
import {ApplyOpportunityComponent} from '../apply-opportunity/apply-opportunity.component';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {OpportunityService} from '../../../../services/institution/opportunity.service';
import {OpportunityAdapter} from '../../../../adapters/implementation/institutions/opportunity.adapter';
import {UserModel} from '../../../../models/user/user.model';
import {MessagerService} from '../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';

@Component({
  selector: 'app-card-opportunity-saved',
  templateUrl: './card-opportunity-saved.component.html'
})
export class CardOpportunitySavedComponent {

  @Input() public opportunity: OpportunityModel;
  @ViewChild('modalApplyOpportunity', {static: false}) modalApplyOpportunity: ApplyOpportunityComponent;
  @Output() removeOpportunitySaved = new EventEmitter<OpportunityModel>();
  user: UserModel;

  constructor(
    public utilitiesConfigString: UtilitiesConfigString,
    private opportunityService: OpportunityService,
    private opportunityAdapter: OpportunityAdapter,
    private messagerService: MessagerService) {
    this.user = this.utilitiesConfigString.ls.get('user');
  }

  apply(): void {
    this.modalApplyOpportunity.show(this.opportunity);
  }

  unBookmarked(opportunitySaved: OpportunityModel): void {
    this.removeOpportunitySaved.emit(opportunitySaved);
    const indexOpportunitySaved = opportunitySaved.oppoUserSaved.findIndex(c => c.id === this.opportunity.oppoUserSaved);
    opportunitySaved.oppoUserSaved.splice(indexOpportunitySaved, 1);
    const opportunityRequest = this.opportunityAdapter.adaptObjectSend(opportunitySaved);
    this.opportunityService.updateOpportunity(opportunityRequest)
      .then(res => {
        if (!res.status) {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      });
  }

}
