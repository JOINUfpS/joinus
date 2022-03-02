import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PageNotFoundComponent} from './page-not-found.component';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {ConstString} from '../../utilities/string/const-string';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent],
      providers: [UtilitiesConfigString,
        ConstString]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
