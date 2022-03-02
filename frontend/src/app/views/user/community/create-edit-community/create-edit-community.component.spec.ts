import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CreateEditCommunityComponent} from './create-edit-community.component';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {CommunityService} from '../../../../services/user/community.service';
import {CategoryAdapter} from '../../../../adapters/implementation/utility/category.adapter';
import {CommunityAdapter} from '../../../../adapters/implementation/user/community.adapter';
import {CategoryService} from '../../../../services/utility/category.service';
import {CommunityUserAdapter} from '../../../../adapters/implementation/user/community-user.adapter';
import {StringCommunity} from '../../../../utilities/string/community/string-community';
import {MessageService} from 'primeng/api';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CommunityModel} from '../../../../models/user/community.model';


describe('CreateEditCommunityComponent', () => {
  let component: CreateEditCommunityComponent;
  let fixture: ComponentFixture<CreateEditCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ CreateEditCommunityComponent ],
      providers: [UtilitiesConfigString,
        MessagerService,
        MessageService,
        CommunityService,
        CategoryAdapter,
        CommunityAdapter,
        CategoryService,
        CommunityUserAdapter,
        StringCommunity]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form to create and edit community', () => {
    component.ngOnInit();
    const createEditForm = component.form;
    const createEditFormValues = {
      commName: Object({ value: null, disable: false }),
      commDescription: Object({ value: null, disable: false }),
      commCategory: null,
      commPrivacy: ''
    };
    expect(createEditForm.value).toEqual(createEditFormValues);
  });

  it('should show dialog edit', () => {
    component.categoriesOptions = [
        {
          id: '2399359e-e6b4-48c4-90ab-26334866ae04',
          instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          cateName: 'Emprendimiento',
          cateDescription: 'Un grupo de personas que esta interesada en emprender.',
          cateType: 'Comunidad',
          cateStatus: 'Activo'
        },
        {
          id: '8884f889-52ae-40c1-a273-7d7dac26bf2c',
          instId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          cateName: 'Grupo de Afinidades',
          cateDescription: 'Un grupo de personas que comparten los mismos intereses sobre un tema.',
          cateType: 'Comunidad',
          cateStatus: 'Activo'
        }
        ];
    component.optionsPrivacy = [
      {name: 'Pública', code: false},
      {name: 'Privada', code: true},
    ];
    const data = new CommunityModel('1312beb0-fdb4-4e16-ba0a-b735f76c4252',
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      null,
      'cf5e1370-c389-4cbf-a42c-8977354e8fe3',
      'Joinufps',
      'Publicar todo lo relacionado a la plataforma, dudas, preguntas y reporte de errores encontrados.',
      'b2fc6670-1758-4e8b-a2cb-2a68cc6bc739',
      'Grupo de estudio',
      true,
      2);
    component.show(data, '3fa85f64-5717-4562-b3fc-2c963f66afa6');
    expect(component.communityDialogDisplay).toEqual(true);
    expect(component.uploadedFiles).toEqual([]);
    expect(component.showEditBtn).toEqual(true);
  });

});
