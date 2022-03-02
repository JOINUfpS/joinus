import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutUsComponent} from './about-us.component';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {Location} from '@angular/common';

describe('AboutUsComponent', () => {
  let component: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutUsComponent],
      providers: [UtilitiesConfigString,
        Location]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
