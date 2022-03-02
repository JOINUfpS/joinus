import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {EditUserComponent} from './user/edit-user/edit-user.component';
import {ListUserComponent} from './user/list-user/list-user.component';
import {ListRoleComponent} from './role/list-role/list-role.component';

import {UserRoutes} from './user.routing';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {TabViewModule} from 'primeng/tabview';
import {ListInviteRoleComponent} from './role/invite-role/list-invite-role/list-invite-role.component';
import {CreateEditInivteRoleComponent} from './role/invite-role/create-edit-inivte-role/create-edit-inivte-role.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {ToolbarModule} from 'primeng/toolbar';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {MultiSelectModule} from 'primeng/multiselect';
import {ConfigTables} from '../../utilities/config-tables.service';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {SharedModule} from '../../shared/shared.module';
import {ListboxModule} from 'primeng/listbox';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import {ChipsModule} from 'primeng/chips';
import {CheckboxModule} from 'primeng/checkbox';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';


@NgModule({
    imports: [
        CommonModule,
        UserRoutes,
        SharedModule,
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
      InputTextareaModule,
      ListboxModule,
      VirtualScrollerModule,
      ChipsModule,
      CheckboxModule,
      ProgressSpinnerModule,
      InfiniteScrollModule
    ],

  declarations: [
    ListRoleComponent,
    EditUserComponent,
    ListUserComponent,
    ListInviteRoleComponent,
    CreateEditInivteRoleComponent
  ],
  providers: [
    ConfigTables,
  ]
})
export class UserModule {
}
