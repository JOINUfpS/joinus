import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListCategoryComponent} from './category/list-category/list-category.component';
import {CreateEditCategoryComponent} from './category/create-edit-category/create-edit-category.component';
import {CategoryRoutes} from './utility.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {TabViewModule} from 'primeng/tabview';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ProgressSpinnerModule} from 'primeng/progressspinner';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        ConfirmDialogModule,
        InputTextModule,
        CardModule,
        ReactiveFormsModule,
        TabViewModule,
        TieredMenuModule,
        ToolbarModule,
        TooltipModule,
        MultiSelectModule,
        DropdownModule,
        TableModule,
        CategoryRoutes,
        CheckboxModule,
        InputTextareaModule,
        ProgressSpinnerModule
    ],
  declarations: [
    ListCategoryComponent,
    CreateEditCategoryComponent
  ],
  exports: [
    ListCategoryComponent,
    CreateEditCategoryComponent]
})
export class UtilityModule {
}
