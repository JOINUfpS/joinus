import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListNotificationComponent} from './list-notification/list-notification.component';
import {SharedModule} from '../../shared/shared.module';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {NgxSkeletonModule} from 'ngx-skeleton';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [ListNotificationComponent],
  exports: [
    ListNotificationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VirtualScrollerModule,
    InfiniteScrollModule,
    NgxSkeletonModule,
    NgbDropdownModule
  ]
})
export class NotificationModule {
}
