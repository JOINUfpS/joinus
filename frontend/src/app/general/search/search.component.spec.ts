import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {SearchComponent} from './search.component';
import {ActivatedRoute} from '@angular/router';
import {UsersService} from '../../services/user/user.service';
import {UserAdapter} from '../../adapters/implementation/user/user.adapter';
import {PublicationService} from '../../services/publication/publication.service';
import {PublicationAdapter} from '../../adapters/implementation/publication/publication.adapter';
import {OpportunityService} from '../../services/institution/opportunity.service';
import {OpportunityAdapter} from '../../adapters/implementation/institutions/opportunity.adapter';
import {CommunityService} from '../../services/user/community.service';
import {CommunityAdapter} from '../../adapters/implementation/user/community.adapter';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ProjectAdapter} from '../../adapters/implementation/user/project.adapter';
import {DatePipe} from '@angular/common';

xdescribe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  const fakeActivatedRoute = {
    snapshot: {params : {}}
  } as ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [SearchComponent],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute},
        UsersService,
        UserAdapter,
        ProjectAdapter,
        DatePipe,
        PublicationService,
        PublicationAdapter,
        OpportunityService,
        OpportunityAdapter,
        CommunityService,
        CommunityAdapter,
        UtilitiesConfigString]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show skeleton', () => {
    component.showSkeleton();
    expect(( component as any).isLoading).toEqual(true);
  });


});
