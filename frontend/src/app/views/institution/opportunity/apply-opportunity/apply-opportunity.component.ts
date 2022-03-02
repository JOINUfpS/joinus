import {Component, EventEmitter, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {OpportunityService} from '../../../../services/institution/opportunity.service';
import {OpportunityAdapter} from '../../../../adapters/implementation/institutions/opportunity.adapter';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {UserModel} from '../../../../models/user/user.model';
import {MessagerService} from '../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';
import {ConstString} from '../../../../utilities/string/const-string';
import {OpportunityModel} from '../../../../models/institutions/opportunity.model';

@Component({
  selector: 'app-apply-opportunity',
  templateUrl: './apply-opportunity.component.html'
})
export class ApplyOpportunityComponent {

  public applydisplay: boolean;
  public viewPdf: boolean;
  public opportunity: OpportunityModel = {} as OpportunityModel;
  public user: UserModel;
  public form: FormGroup;
  public showEditBtn: boolean;
  public imgChange: any;
  public validFile: boolean;
  public uploadedFiles: any[];
  public buttonFormActioned = false;
  @Output() updateList: EventEmitter<any> = new EventEmitter();

  constructor(private opportunityService: OpportunityService,
              private opportunityAdapter: OpportunityAdapter,
              public utilitiesString: UtilitiesConfigString,
              private messagerService: MessagerService) {
    this.applydisplay = false;
    this.viewPdf = false;
    this.user = utilitiesString.ls.get('user');
  }

  show(data): void {
    this.applydisplay = true;
    this.opportunity = data;
    this.showEditBtn = true;
    this.validFile = false;
  }

  onSelectFile(event, photo): void {
    this.uploadedFiles = [];
    for (const file of event.files) {
      if (file.type === 'application/pdf') {
        if (file.size <= 1024000) {
          this.uploadedFiles.push(file);
          this.viewPdf = true;
          this.validFile = true;
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, ConstString.MESSAGE_FILE_1MB);
        }
      } else {
        this.validFile = false;
        this.messagerService.showToast(EnumLevelMessage.WARNING, 'Tipo de archivo no válido');
      }
      photo.clear();
    }
  }

  applyOpportunity(): Promise<any> {
    this.buttonFormActioned = true;
    if (this.uploadedFiles.length > 0) {
      return new Promise((resolve) => {
        if (resolve) {
          this.goToApplyOpportunityService();
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, this.utilitiesString.msgToastError);
          this.buttonFormActioned = false;
        }
      });
    }
  }

  private goToApplyOpportunityService(): void {
    for (const file of this.uploadedFiles) {
      this.opportunityService.applyOpportunity(this.opportunityAdapter.applyOpportunityAdapter(file, this.user, this.opportunity))
        .then(res => {
          if (res.status) {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Hoja de vida enviada');
            this.viewPdf = false;
            this.applydisplay = false;
          } else {
            this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
          }
        })
        .finally(() => {
          this.updateList.emit();
          this.buttonFormActioned = false;
        });
    }
  }

}
