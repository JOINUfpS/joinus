import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CardUserComponent} from './card-user.component';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';


xdescribe('CardUserComponent', () => {
  let component: CardUserComponent;
  let fixture: ComponentFixture<CardUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardUserComponent],
      providers: [UtilitiesConfigString]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
