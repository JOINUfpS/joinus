import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {PublicationRoutes} from './publication.routing';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FileUploadModule} from 'primeng/fileupload';
import {MatInputModule} from '@angular/material/input';
import {CheckboxModule} from 'primeng/checkbox';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ViewPublicationComponent} from './publication/view-publication/view-publication.component';
import {TabViewModule} from 'primeng/tabview';
import {TooltipModule} from 'primeng/tooltip';
import {SharedModule} from '../../shared/shared.module';
import {ChartModule} from 'primeng/chart';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {CarouselModule} from 'primeng/carousel';
import {MenuModule} from 'primeng/menu';
import {CalendarModule} from 'primeng/calendar';
import {NgxSkeletonModule} from 'ngx-skeleton';

@NgModule({
  imports: [
    CommonModule,
    PublicationRoutes,
    CardModule,
    DialogModule,
    ButtonModule,
    RippleModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FileUploadModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    AutoCompleteModule,
    TabViewModule,
    TooltipModule,
    SharedModule,
    ChartModule,
    PdfViewerModule,
    CarouselModule,
    MenuModule,
    CalendarModule,
    NgxSkeletonModule
  ],

  declarations: [
    ViewPublicationComponent,
  ],
})
export class PublicationModule {
}
