import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PublicationService} from '../../../../services/publication/publication.service';
import {PublicationAdapter} from '../../../../adapters/implementation/publication/publication.adapter';
import {UsersService} from '../../../../services/user/user.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../../../utilities/string/const-string';
import {MessageService} from 'primeng/api';
import {CardUserSharePublicationComponent} from './card-user-share-publication.component';
import {FollowUserAdapter} from '../../../../adapters/implementation/user/follow-user.adapter';
import {UserAdapter} from '../../../../adapters/implementation/user/user.adapter';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CardUserSharePublicationComponent', () => {
  let component: CardUserSharePublicationComponent;
  let fixture: ComponentFixture<CardUserSharePublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CardUserSharePublicationComponent],
      providers: [PublicationAdapter,
        PublicationService,
        FollowUserAdapter,
        UserAdapter,
        DatePipe,
        ConstString,
        UsersService,
        MessagerService,
        MessageService,
        UtilitiesConfigString]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardUserSharePublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
