import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ListOpportunityComponent} from './list-opportunity.component';
import {ContainerComponent} from '../../../container/container.component';
import {OpportunityService} from '../../../../services/institution/opportunity.service';
import {OpportunityAdapter} from '../../../../adapters/implementation/institutions/opportunity.adapter';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../../../utilities/string/const-string';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ListOpportunityComponent', () => {
  let component: ListOpportunityComponent;
  let fixture: ComponentFixture<ListOpportunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ListOpportunityComponent],
      providers: [ContainerComponent,
        OpportunityService,
        OpportunityAdapter,
        ConstString,
        DatePipe,
        UtilitiesConfigString]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
