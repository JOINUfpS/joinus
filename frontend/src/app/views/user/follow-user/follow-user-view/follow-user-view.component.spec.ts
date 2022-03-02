import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FollowUserViewComponent} from './follow-user-view.component';
import {UniversityCareerAdapter} from '../../../../adapters/implementation/utility/universityCareer.adapter';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('FollowUserViewComponent', () => {
  let component: FollowUserViewComponent;
  let fixture: ComponentFixture<FollowUserViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ FollowUserViewComponent ],
      providers: [
        UniversityCareerAdapter,
        UtilitiesConfigString]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
