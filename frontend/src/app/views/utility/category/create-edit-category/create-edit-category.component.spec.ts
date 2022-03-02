import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateEditCategoryComponent} from './create-edit-category.component';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {CategoryService} from '../../../../services/utility/category.service';
import {ConstPermissions} from '../../../../utilities/string/security/const-permissions';
import {CategoryAdapter} from '../../../../adapters/implementation/utility/category.adapter';
import {MessageService} from 'primeng/api';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CreateEditCategoryComponent', () => {
  let component: CreateEditCategoryComponent;
  let fixture: ComponentFixture<CreateEditCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CreateEditCategoryComponent],
      providers: [UtilitiesConfigString,
        MessagerService,
        CategoryService,
        ConstPermissions,
        CategoryAdapter,
        MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form to create and edit category', () => {
    component.ngOnInit();
    const createEditForm = component.form;
    const createEditFormValues = {
      cateName: null,
      cateDescription: null,
      cateType: null,
      cateStatus: null
    };

    expect(createEditForm.value).toEqual(createEditFormValues);
  });

  it('should be show create edit category dialog', () => {
    component.ngOnInit();
    const data = {
      id: '7837eb9f-91d0-4b6a-8bdb-7038ba82eeb1',
      instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      cateName: 'Articulo en revista',
      cateDescription: '',
      cateType: 'Documento',
      cateStatus: 'Activo'
    };
    component.show(data);
    expect(( component as any).display).toEqual( true);
    expect(( component as any).category).toEqual(data);
    expect(( component as any).showEditBtn).toEqual(true);

  });

  it('should be change error class cateName', () => {
    component.ngOnInit();
    component.classErrorCateName = 'ui-inputtext class-error';
    component.changeErrorClassCateName();
    expect(( component as any).classErrorCateName).toEqual('ui-inputtext');
  });

});
