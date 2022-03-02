import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListConversationComponent} from './list-conversation/list-conversation.component';
import {ChatRoutes} from './chat.routing';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CardConversationComponent} from './card-conversation/card-conversation.component';
import {ViewConversationComponent} from './view-conversation/view-conversation.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {NgxSkeletonModule} from 'ngx-skeleton';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {SharedModule} from '../../shared/shared.module';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TooltipModule} from 'primeng/tooltip';
import {MenuModule} from 'primeng/menu';
import {PickerModule} from '@ctrl/ngx-emoji-mart';


@NgModule({
  declarations: [ListConversationComponent, CardConversationComponent, ViewConversationComponent],
    imports: [
        CommonModule,
        ChatRoutes,
        InputTextModule,
        ButtonModule,
        FormsModule,
        DialogModule,
        AutoCompleteModule,
        ReactiveFormsModule,
        InfiniteScrollModule,
        NgxSkeletonModule,
        ProgressSpinnerModule,
        SharedModule,
        InputTextareaModule,
        TooltipModule,
        MenuModule,
        PickerModule
    ]
})
export class ChatModule {
}
