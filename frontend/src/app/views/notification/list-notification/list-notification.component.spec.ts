import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MessageService} from 'primeng/api';
import {NotificationService} from '../../../services/notification/notification.service';
import {NotificationAdapter} from '../../../adapters/implementation/notification/notification.adapter';
import {WebsocketService} from '../../../services/websocket_service/websocket-service';
import {LoadingService} from '../../../services/loading/loading.service';
import {ListNotificationComponent} from './list-notification.component';
import {UtilitiesConfigString} from '../../../utilities/utilities-config-string.service';
import {MessagerService} from '../../../messenger/messager.service';
import {
  SkeletonNotificationComponent
} from '../../../shared/skeleton/skeleton-notification/skeleton-notification.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('ListNotificationComponent', () => {
  let component: ListNotificationComponent;
  let fixture: ComponentFixture<ListNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ListNotificationComponent, SkeletonNotificationComponent],
      providers: [UtilitiesConfigString,
        NotificationService,
        NotificationAdapter,
        WebsocketService,
        LoadingService,
        MessagerService,
        MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark notification as read', () => {
    component.ngOnInit();
    component.numberNotificationsNoRead = 1;
    component.markNotificationAsUnRead();
    expect((component as any).numberNotificationsNoRead).toEqual(0);
  });

  it('should remove notification', () => {
    component.ngOnInit();
    component.removeNotification(0);
    expect((component as any).cardNotification).toEqual(undefined);
  });

});
