import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommunityCardComponent} from './community-card.component';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {CommunityService} from '../../../../services/user/community.service';
import {CategoryAdapter} from '../../../../adapters/implementation/utility/category.adapter';
import {CommunityAdapter} from '../../../../adapters/implementation/user/community.adapter';
import {CategoryService} from '../../../../services/utility/category.service';
import {CommunityUserAdapter} from '../../../../adapters/implementation/user/community-user.adapter';
import {StringCommunity} from '../../../../utilities/string/community/string-community';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('CommunityCardComponent', () => {
  let component: CommunityCardComponent;
  let fixture: ComponentFixture<CommunityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ CommunityCardComponent ],
      providers: [UtilitiesConfigString,
        MessagerService,
        MessageService,
        CommunityService,
        Router,
        Function,
        CategoryAdapter,
        CommunityAdapter,
        CategoryService,
        CommunityUserAdapter,
        StringCommunity]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
