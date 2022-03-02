import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpComponent } from './help.component';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {Location} from '@angular/common';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpComponent ],
      providers: [UtilitiesConfigString,
        Location]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
