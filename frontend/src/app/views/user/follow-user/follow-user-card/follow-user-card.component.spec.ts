import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FollowUserCardComponent} from './follow-user-card.component';
import {UniversityCareerAdapter} from '../../../../adapters/implementation/utility/universityCareer.adapter';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {MessageService} from 'primeng/api';
import {HttpClientTestingModule} from '@angular/common/http/testing';

xdescribe('FollowUserCardComponent', () => {
  let component: FollowUserCardComponent;
  let fixture: ComponentFixture<FollowUserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ FollowUserCardComponent ],
      providers: [
        UniversityCareerAdapter,
        UtilitiesConfigString,
        MessagerService,
        MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
