import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ListUserComponent} from './list-user.component';
import {ConfirmationService} from 'primeng/api';
import {UsersService} from '../../../../services/user/user.service';
import {UserAdapter} from '../../../../adapters/implementation/user/user.adapter';
import {ConstPermissions} from '../../../../utilities/string/security/const-permissions';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {ProjectAdapter} from '../../../../adapters/implementation/user/project.adapter';
import {DatePipe} from '@angular/common';
import {ConstString} from '../../../../utilities/string/const-string';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ListUserComponent', () => {
  let component: ListUserComponent;
  let fixture: ComponentFixture<ListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ListUserComponent],
      providers: [ConfirmationService,
        UsersService,
        UserAdapter,
        ProjectAdapter,
        ConstString,
        DatePipe,
        ConstPermissions,
        UtilitiesConfigString]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
