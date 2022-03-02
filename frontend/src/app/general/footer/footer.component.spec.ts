import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create constants', () => {
    expect(( component as any).urlConductNorms).toEqual('https://studentsprojects.cloud.ufps.edu.co/asn_balancing/api_gateway/asn_file/files/api/file/get_object/d156117d-9353-4aad-ac9b-1d03e9965526/');
  });
});
