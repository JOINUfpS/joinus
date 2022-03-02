import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CommunityUserCardComponent} from './community-user-card.component';
import {UniversityCareerAdapter} from '../../../../adapters/implementation/utility/universityCareer.adapter';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {MessageService} from 'primeng/api';
import {HttpClientTestingModule} from '@angular/common/http/testing';

xdescribe('CommunityUserCardComponent', () => {
  let component: CommunityUserCardComponent;
  let fixture: ComponentFixture<CommunityUserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ CommunityUserCardComponent ],
      providers: [
        UniversityCareerAdapter,
        UtilitiesConfigString,
        MessagerService,
        MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityUserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
