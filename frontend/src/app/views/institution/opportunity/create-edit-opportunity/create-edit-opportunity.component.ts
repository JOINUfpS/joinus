import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OpportunityModel} from '../../../../models/institutions/opportunity.model';
import {CategoryService} from '../../../../services/utility/category.service';
import {CategoryAdapter} from '../../../../adapters/implementation/utility/category.adapter';
import {CategoryModel} from '../../../../models/utility/category.model';
import {Status} from '../../../../utilities/status';
import {OpportunityService} from '../../../../services/institution/opportunity.service';
import {OpportunityAdapter} from '../../../../adapters/implementation/institutions/opportunity.adapter';
import {GeographicalLocationService} from '../../../../services/utility/geographical-location.service';
import {categoryTypes} from '../../../../utilities/types';
import {FileService} from '../../../../services/file/file.service';
import {SendAttachments} from '../../../../utilities/send-attachments.service';
import {UserModel} from '../../../../models/user/user.model';
import {MessagerService} from '../../../../messenger/messager.service';
import {UtilitiesList} from '../../../../utilities/utilities-list';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/es';
import {UtilityRichText} from '../../../../utilities/utility-rich-text';
import {ConstString} from '../../../../utilities/string/const-string';


@Component({
  selector: 'app-create-edit-opportunity',
  templateUrl: './create-edit-opportunity.component.html'
})
export class CreateEditOpportunityComponent implements OnInit {

  @Output()
  updateList: EventEmitter<OpportunityModel> = new EventEmitter();
  @Output()
  updateOpportunity = new EventEmitter<OpportunityModel>();
  display: boolean;
  opportunity: OpportunityModel;
  form: FormGroup;
  showEditBtn: boolean;
  typeContract: CategoryModel[];
  statusOptions: any = Object.keys(Status).map(key => ({id: key, name: Status[key]}));
  imgChange: any;
  uploadedFiles: any[];
  dateOpportunity: Date;
  user: UserModel;
  buttonFormActioned = false;
  countriesOpportunity: Array<any>;
  departmentOpportunity: Array<any>;
  municipalitiesOpportunity: Array<any>;
  hiddenMunicipalitiesOpportunity = false;
  hiddenDepartmentOpportunity = false;
  preDeparmentOpportunity: Array<any>;
  editor = ClassicEditor;
  errorClassApplicationUrl = 'ui-inputtext';
  errorClassEmployerEmail = 'ui-inputtext';
  errorClassExpirationDate = 'error-date-field';

  constructor(
    public utilityRichText: UtilityRichText,
    public utilitiesString: UtilitiesConfigString,
    private categoryService: CategoryService,
    private categoryAdapter: CategoryAdapter,
    private opportunityService: OpportunityService,
    private opportunityAdapter: OpportunityAdapter,
    private geographicalLocationService: GeographicalLocationService,
    private fileService: FileService,
    private messagerService: MessagerService) {
    this.display = false;
    this.uploadedFiles = [];
    this.typeContract = [];
    this.user = this.utilitiesString.ls.get('user');
  }

  ngOnInit(): void {
    this.getCountriesOpportunity();
  }

  setData(opportunity: OpportunityModel): void {
    this.form.reset();
    this.getAllTypeContract(opportunity);
    if (opportunity !== null) {
      if (opportunity.oppoAttachments.length > 0 && opportunity.oppoAttachments[0].fileType === 'image/png') {
        this.imgChange = this.utilitiesString.getImage(opportunity.oppoAttachments[0].id);
      }
      this.setDataBasic(opportunity);
      this.setFieldOppoDepartmentInForm(opportunity);
      this.setFieldOppoMunicipalityInForm(opportunity);

    }
  }

  private setDataBasic(opportunity: OpportunityModel): void {
    this.form.get('oppoTitle').setValue(opportunity ? opportunity.oppoTitle : '');
    this.form.get('oppoDescription').setValue(opportunity ? opportunity.oppoDescription : '');
    this.form.get('oppoEmployerEmail').setValue(opportunity ? opportunity.oppoEmployerEmail : '');
    this.form.get('oppoApplicationUrl').setValue(opportunity ? opportunity.oppoApplicationUrl : '');
    this.form.get('oppoSimpleRequest').setValue(opportunity ? opportunity.oppoSimpleRequest : false);
    this.form.get('oppoCountry').setValue(opportunity.oppoCountry.name !== undefined ? opportunity.oppoCountry : undefined);
    this.form.get('oppoRemuneration').setValue(opportunity ? opportunity.oppoRemuneration.replace(/,/gi, '') : 0);
  }

  getAllTypeContract(data): void {
    this.categoryService.listAllCategoryByType(categoryTypes.TIPO_CONTRATO)
      .then(res => {
        this.typeContract = this.categoryAdapter.adaptList(res.data);
        let typeOfContract = null;
        if (data !== null) {
          typeOfContract = this.typeContract.filter(contract => contract.cateName === data.oppoTypeContract);
        }
        this.form.get('oppoTypeContract').setValue(typeOfContract !== null ? typeOfContract[0] : this.typeContract[0]);
      }).finally(() => {
      this.form.get('oppoExpirationDate').setValue(data?.oppoExpirationDate);
    });
  }

  async addOrEditOpportunity(): Promise<void> {
    this.buttonFormActioned = true;
    const opportunityForm = this.form.value;
    const today = new Date();
    this.clearErrorClassApplicationUrl();
    this.clearErrorClassEmployerEmail();
    if (typeof this.dateOpportunity === ConstString.TYPE_OBJECT && this.dateOpportunity.getTime() <= today.getTime()) {
      this.errorClassExpirationDate = 'error-date-field';
      this.form.get('oppoExpirationDate').setErrors({noValidDate: true});
      this.messagerService.showToast(EnumLevelMessage.ERROR, 'La fecha para aplicar debe ser mayor a hoy.');
      this.buttonFormActioned = false;
    } else if (this.form.get('oppoSimpleRequest').value && (this.form.get('oppoEmployerEmail').value === null || this.form.get('oppoEmployerEmail').value === '')) {
      this.errorClassEmployerEmail = 'ui-inputtext class-error';
      this.clearErrorClassApplicationUrl();
      this.messagerService.showToastLarge(EnumLevelMessage.ERROR, 'Al seleccionar aplicar a una ' +
        'oportunidad por solicitud via correo electrónico, es necesario que se agregue un correo del empleador.');
      this.buttonFormActioned = false;
    } else if (!this.form.get('oppoSimpleRequest').value && (this.form.get('oppoApplicationUrl').value === null || this.form.get('oppoApplicationUrl').value === '')) {
      this.errorClassApplicationUrl = 'ui-inputtext class-error';
      this.clearErrorClassEmployerEmail();
      this.buttonFormActioned = false;
      this.messagerService.showToastLarge(EnumLevelMessage.ERROR, 'SÍ la solicitud no es via correo debe agregar un sitio web valido.');
    } else if (this.form.get('oppoSimpleRequest').value === null && this.form.get('oppoApplicationUrl').value === null
      && this.form.get('oppoEmployerEmail').value === null) {
      this.errorClassEmployerEmail = 'ui-inputtext class-error';
      this.clearErrorClassApplicationUrl();
      this.messagerService.showToastLarge(EnumLevelMessage.WARNING, 'Es necesario que indique un correo ' +
        'electrónico o una url para aplicar');
      this.buttonFormActioned = false;
    } else {
      await this.addAttachmentsOfOpportunity(opportunityForm);
      if (this.opportunity) {
        this.editOpportunity(opportunityForm);
      } else {
        this.createOpportunity(opportunityForm);
      }
    }
  }


  show(data: OpportunityModel): void {
    this.initForm();
    this.setData(data);
    this.opportunity = data;
    this.display = true;
    this.showEditBtn = data !== null;
  }

  getCountriesOpportunity(): void {
    if (this.countriesOpportunity === undefined) {
      this.geographicalLocationService.getCountries()
        .then(res => {
          this.countriesOpportunity = res;
        });
    }
  }

  private initForm(): void {
    this.form = new FormGroup({
      oppoTitle: new FormControl({value: ''}, [Validators.required, Validators.maxLength(100)]),
      oppoDescription: new FormControl({value: null, disable: false}),
      oppoTypeContract: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      oppoExpirationDate: new FormControl('', [Validators.required]),
      oppoEmployerEmail: new FormControl({value: ''}, [Validators.maxLength(100),
        Validators.pattern(ConstString.PATTERN_EMAIL)]),
      oppoApplicationUrl: new FormControl({value: ''}, [Validators.maxLength(100),
        Validators.pattern(ConstString.PATTERN_URL)]),
      oppoSimpleRequest: new FormControl({value: false}, [Validators.maxLength(100)]),
      oppoCountry: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      oppoDepartment: new FormControl('', [Validators.minLength(3), Validators.maxLength(100)]),
      oppoMunicipality: new FormControl('', [Validators.minLength(3), Validators.maxLength(100)]),
      oppoRemuneration: new FormControl([Validators.pattern(ConstString.PATTERN_SALARY)]),
    });
  }

  reseatDropdownStatesAndCities(): void {
    this.form.get('oppoMunicipality').setValue(undefined);
    this.form.get('oppoDepartment').setValue(undefined);
    this.hiddenMunicipalitiesOpportunity = true;
    this.hiddenDepartmentOpportunity = true;
    this.preDeparmentOpportunity = undefined;
    this.hasStates();
  }

  reseatDropdownCities(): void {
    if (this.opportunity === null || this.form.value.oppoDepartment.iso2 !== this.opportunity.oppoDepartment.iso2) {
      this.municipalitiesOpportunity = undefined;
      this.form.get('oppoMunicipality').setValue(undefined);
      this.getMunicipalityOpportunity();
    }
  }

  getMunicipalityOpportunity(): void {
    if (this.municipalitiesOpportunity === undefined || this.municipalitiesOpportunity.length <= 1) {
      this.geographicalLocationService.getCities(this.form.value.oppoCountry.iso2, this.form.value.oppoDepartment.iso2)
        .then(res => {
          if (res.length > 0) {
            this.municipalitiesOpportunity = res;
            this.hiddenMunicipalitiesOpportunity = false;
          } else {
            this.hiddenMunicipalitiesOpportunity = true;
          }
        });
    }
  }

  public getDepartmentOpportunities(): void {
    this.geographicalLocationService.getStates(this.form.value.oppoCountry.iso2)
      .then(res => {
        if (res.length > 0) {
          this.preDeparmentOpportunity = res;
          this.formatDeparment();
        } else {
          this.hiddenDepartmentOpportunity = true;
        }
      });
  }

  public formatDeparment(): void {
    if (this.preDeparmentOpportunity.length > 0) {
      if (this.preDeparmentOpportunity[0].name.indexOf('Department') >= 0) {
        this.departmentOpportunity = UtilitiesList.replaceTextFieldArrayAny(this.preDeparmentOpportunity, 'name', ' Department', '');
      } else if (this.preDeparmentOpportunity[0].name.indexOf('District') >= 0) {
        this.departmentOpportunity = UtilitiesList.replaceTextFieldArrayAny(this.preDeparmentOpportunity, 'name', ' District', '');
      } else if (this.preDeparmentOpportunity[0].name.indexOf('Province') >= 0) {
        this.departmentOpportunity = UtilitiesList.replaceTextFieldArrayAny(this.preDeparmentOpportunity, 'name', ' Province', '');
      } else if (this.preDeparmentOpportunity[0].name.indexOf('Region') >= 0) {
        this.departmentOpportunity = UtilitiesList.replaceTextFieldArrayAny(this.preDeparmentOpportunity, 'name', ' Region', '');
      } else {
        this.departmentOpportunity = this.preDeparmentOpportunity;
      }
    }
  }

  onSelectFile(event, photo): void {
    this.uploadedFiles = [];
    for (const file of event.files) {
      if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg') {
        if (file.size <= 1024000) {
          this.uploadedFiles.push(photo.files[0]);
          if (event.files && event.files[0]) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imgChange = e.target.result;
            };
            reader.readAsDataURL(event.files[0]);
          }
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, ConstString.MESSAGE_FILE_1MB);
        }
      } else {
        this.messagerService.showToast(EnumLevelMessage.WARNING, 'Tipo de archivo no válido');
      }
      photo.clear();
    }
  }

  private setFieldOppoDepartmentInForm(data): void {
    if (data !== null && data.oppoDepartment.name !== undefined) {
      this.form.get('oppoDepartment').setValue(data.oppoDepartment);
      this.departmentOpportunity = new Array<any>();
      this.departmentOpportunity.push(data.oppoDepartment);
      this.hiddenDepartmentOpportunity = false;
    } else {
      this.departmentOpportunity = new Array<any>();
      this.hiddenDepartmentOpportunity = true;
      this.form.get('oppoDepartment').setValue(undefined);
    }
  }

  private setFieldOppoMunicipalityInForm(data): void {
    if (data !== null && data.oppoMunicipality.name !== undefined) {
      this.form.get('oppoMunicipality').setValue(data.oppoMunicipality);
      this.municipalitiesOpportunity = [data.oppoMunicipality];
      this.hiddenMunicipalitiesOpportunity = false;
    } else {
      this.hiddenMunicipalitiesOpportunity = true;
      this.form.get('oppoMunicipality').setValue(undefined);
    }
  }

  private async addAttachmentsOfOpportunity(opportunityForm: any): Promise<void> {
    if (this.uploadedFiles.length !== 0) {
      const uploadAttachments = new SendAttachments(this.fileService);
      const attachments = [];
      await uploadAttachments.sendAttachments(this.uploadedFiles, this.user.instId)
        .then(response => {
          if (response.status) {
            attachments.push(response.data);
            opportunityForm.oppoAttachments = attachments;
          } else {
            this.messagerService.showToast(EnumLevelMessage.ERROR, response.message);
            this.buttonFormActioned = false;
          }
        }).catch(() => {
          this.buttonFormActioned = false;
        });
    }
  }

  private editOpportunity(opportunityForm: any): void {
    opportunityForm.id = this.opportunity.id;
    if (this.imgChange === null) {
      opportunityForm.oppoAttachments = [];
    } else if (opportunityForm.oppoAttachments === undefined) {
      opportunityForm.oppoAttachments = this.opportunity.oppoAttachments;
    }
    const opportunityRequest = this.opportunityAdapter.adaptObjectSend(opportunityForm);
    this.opportunityService.updateOpportunity(opportunityRequest)
      .then(res => {
        if (res.status) {
          this.dateOpportunity = null;
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Oportunidad actualizada!');
          this.updateOpportunity.emit(this.opportunityAdapter.adaptObjectReceive(res.data));
          this.display = false;
          this.uploadedFiles = [];
          this.imgChange = null;
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      })
      .finally(() => {
        this.updateList.emit();
        this.buttonFormActioned = false;
      });
  }

  private createOpportunity(opportunityForm: any): void {
    const OpportunityRequest = this.opportunityAdapter.adaptObjectSend(opportunityForm);
    this.opportunityService.saveOpportunity(OpportunityRequest)
      .then(res => {
        if (res.status) {
          this.dateOpportunity = null;
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, '¡Oportunidad creada!');
          this.updateList.emit(this.opportunityAdapter.adaptObjectReceive(res.data));
          this.display = false;
          this.uploadedFiles = [];
          this.imgChange = null;
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
          this.buttonFormActioned = false;
        }
      })
      .finally(() => {
        this.buttonFormActioned = false;
      });
  }

  private hasStates(): void {
    this.geographicalLocationService.getStates(this.form.value.oppoCountry.iso2)
      .then(res => {
        if (res.length > 0) {
          this.preDeparmentOpportunity = res;
          this.hiddenDepartmentOpportunity = false;
        } else {
          this.hiddenDepartmentOpportunity = true;
        }
      });
  }

  clearErrorClassEmployerEmail(): void {
    this.errorClassEmployerEmail = 'ui-inputtext';
  }

  clearErrorClassApplicationUrl(): void {
    this.errorClassApplicationUrl = 'ui-inputtext';
  }

  clearErrorExpirationDate(): void {
    this.errorClassExpirationDate = '';
  }

  clearFilesUpload(): void {
    this.imgChange = null;
  }
}
