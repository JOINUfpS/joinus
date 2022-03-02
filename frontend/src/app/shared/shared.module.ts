import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuModule} from 'primeng/menu';
import {ButtonModule} from 'primeng/button';
import {CardPublicationComponent} from '../views/publication/publication/card-publication/card-publication.component';
import {CardCommentComponent} from '../views/publication/comment/card-comment/card-comment.component';
import {CardModule} from 'primeng/card';
import {ApplyOpportunityComponent} from '../views/institution/opportunity/apply-opportunity/apply-opportunity.component';
import {TableModule} from 'primeng/table';
import {RippleModule} from 'primeng/ripple';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InputTextModule} from 'primeng/inputtext';
import {TooltipModule} from 'primeng/tooltip';
import {ToolbarModule} from 'primeng/toolbar';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {FileUploadModule} from 'primeng/fileupload';
import {CardOpportunityComponent} from '../views/institution/opportunity/card-opportunity/card-opportunity.component';
import {CardNotificationComponent} from '../views/notification/card-notification/card-notification.component';
import {CardUserComponent} from '../views/user/user/card-user/card-user.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CreateEditOpportunityComponent} from '../views/institution/opportunity/create-edit-opportunity/create-edit-opportunity.component';
import {NgxCurrencyModule} from 'ngx-currency';
import {CreateEditPublicationComponent} from '../views/publication/publication/create-edit-publication/create-edit-publication.component';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {NgxSkeletonModule} from 'ngx-skeleton';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {CardUserSharePublicationComponent} from '../views/publication/publication/card-user-share-publication/card-user-share-publication.component';
import {CarouselModule} from 'primeng/carousel';
import {SkeletonUserComponent} from './skeleton/skeleton-user/skeleton-user.component';
import {SkeletonCommunityComponent} from './skeleton/skeleton-community/skeleton-community.component';
import {SkeletonPublicationComponent} from './skeleton/skeleton-publication/skeleton-publication.component';
import {SkeletonNotificationComponent} from './skeleton/skeleton-notification/skeleton-notification.component';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {SkeletonOpportunityComponent} from './skeleton/skeleton-opportunity/skeleton-opportunity.component';
import {FooterComponent} from '../general/footer/footer.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {ProjectComponent} from '../views/user/project/project.component';
import {EditProfileComponent} from '../account/edit-profile/edit-profile.component';
import {ChipsModule} from 'primeng/chips';
import {CardPublicationRelatedComponent} from '../views/publication/publication/card-publication-related/card-publication-related.component';


@NgModule({
  declarations: [
    CardOpportunityComponent,
    CreateEditOpportunityComponent,
    ApplyOpportunityComponent,
    CreateEditPublicationComponent,
    CardPublicationComponent,
    CardPublicationRelatedComponent,
    CardCommentComponent,
    CardNotificationComponent,
    CardUserComponent,
    CardUserSharePublicationComponent,
    SkeletonUserComponent,
    SkeletonCommunityComponent,
    SkeletonPublicationComponent,
    SkeletonNotificationComponent,
    SkeletonOpportunityComponent,
    FooterComponent,
    ProjectComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TableModule,
    RippleModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    InputTextModule,
    CardModule,
    TooltipModule,
    ToolbarModule,
    MultiSelectModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    FileUploadModule,
    NgxCurrencyModule,
    InputTextareaModule,
    NgxSkeletonModule,
    ProgressSpinnerModule,
    CarouselModule,
    NgbDropdownModule,
    CKEditorModule,
    ChipsModule,
  ],
  exports: [
    CardOpportunityComponent,
    CreateEditOpportunityComponent,
    ApplyOpportunityComponent,
    CardPublicationComponent,
    CardPublicationRelatedComponent,
    CreateEditPublicationComponent,
    CardCommentComponent,
    CardNotificationComponent,
    CardUserComponent,
    CardUserSharePublicationComponent,
    SkeletonUserComponent,
    SkeletonCommunityComponent,
    SkeletonPublicationComponent,
    SkeletonNotificationComponent,
    SkeletonOpportunityComponent,
    FooterComponent,
    ProjectComponent,
    EditProfileComponent
  ]
})
export class SharedModule {
}
