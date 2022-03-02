import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {RippleModule} from 'primeng/ripple';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {TooltipModule} from 'primeng/tooltip';
import {ToolbarModule} from 'primeng/toolbar';
import {ViewEditInstitutionComponent} from './institution/view-edit-institution/view-edit-institution.component';
import {ListOpportunityComponent} from './opportunity/list-opportunity/list-opportunity.component';

import {InstitutionRoutes} from './institution.routing';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {FileUploadModule} from 'primeng/fileupload';
import {SharedModule} from '../../shared/shared.module';
import {CardOpportunitySavedComponent} from './opportunity/card-opportunity-saved/card-opportunity-saved.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {NgxSkeletonModule} from 'ngx-skeleton';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InstitutionRoutes,
    TableModule,
    RippleModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    CardModule,
    TooltipModule,
    ToolbarModule,
    MultiSelectModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    FileUploadModule,
    SharedModule,
    InfiniteScrollModule,
    NgxSkeletonModule,
    CKEditorModule
  ],

  declarations: [
    ViewEditInstitutionComponent,
    ListOpportunityComponent,
    CardOpportunitySavedComponent,
  ],
})
export class InstitutionModule {

}
