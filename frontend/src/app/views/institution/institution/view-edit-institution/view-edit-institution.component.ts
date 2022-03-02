import {Component, OnInit} from '@angular/core';
import {InstitutionModel} from '../../../../models/institutions/institution.model';
import {InstitutionService} from '../../../../services/institution/institution.service';
import {InstitutionAdapter} from '../../../../adapters/implementation/institutions/institution.adapter';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {UserModel} from '../../../../models/user/user.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SendAttachments} from '../../../../utilities/send-attachments.service';
import {FileService} from '../../../../services/file/file.service';
import {MessagerService} from '../../../../messenger/messager.service';
import {ConstModules} from '../../../../utilities/string/security/const-modules';
import {ConstPermissions} from '../../../../utilities/string/security/const-permissions';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';
import {ConstString} from '../../../../utilities/string/const-string';


@Component({
  selector: 'app-view-edit-institution',
  templateUrl: './view-edit-institution.component.html'
})
export class ViewEditInstitutionComponent implements OnInit {

  public institution: InstitutionModel;
  public user: UserModel;
  public form: FormGroup;
  public updatePhoto: boolean;
  public validFile: boolean;
  public uploadedFiles: any[];
  public imgChange: any;
  public errors = new Map();
  public permissions: string[];
  public errorClassInstName = 'ui-inputtext';

  constructor(
    private institutionAdapter: InstitutionAdapter,
    private institutionService: InstitutionService,
    private constModules: ConstModules,
    public utilitiesConfigString: UtilitiesConfigString,
    public constPermissions: ConstPermissions,
    public fileService: FileService,
    private messagerService: MessagerService) {
    this.user = utilitiesConfigString.ls.get('user');
    this.permissions = utilitiesConfigString.ls.get('permissions')
      .find(element => element.moduName === constModules.INSTITUTIONS).moduPermissions;
  }

  ngOnInit(): void {
    this.getInstitution();
    this.buildForm();
    this.setData();
  }

  buildForm(): void {
    this.form = new FormGroup({
      instName: new FormControl({value: null}, [Validators.required, Validators.maxLength(100)]),
      instAddress: new FormControl({value: null}, [Validators.maxLength(100)]),
      instHead: new FormControl({value: null}, [Validators.maxLength(100)]),
      instCountry: new FormControl({value: null}, [Validators.required, Validators.maxLength(100)]),
      instDepartment: new FormControl({value: null}, [Validators.required, Validators.maxLength(100)]),
      instMunicipality: new FormControl({value: null}, [Validators.maxLength(100)]),
      instWebsite: new FormControl({value: null}, [Validators.required, Validators.maxLength(100),
        Validators.pattern(/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/)]),
      instPhone: new FormControl({value: null}, [Validators.required, Validators.maxLength(10)]),
      instFax: new FormControl({value: null}, [Validators.required, Validators.maxLength(10)]),
    });
  }

  setData(): void {
    this.form.get('instName').setValue(this.institution ? this.institution?.instName : 'Desconocido');
    this.form.get('instAddress').setValue(this.institution ? this.institution?.instAddress : 'Desconocida');
    this.form.get('instHead').setValue(this.institution ? this.institution?.instHead : 'Desconocido');
    this.form.get('instCountry').setValue(this.institution ? this.institution?.instCountry : 'Desconocido');
    this.form.get('instDepartment').setValue(this.institution ? this.institution?.instDepartment : 'Desconocido');
    this.form.get('instMunicipality').setValue(this.institution ? this.institution?.instMunicipality : 'Desconocido');
    this.form.get('instWebsite').setValue(this.institution ? this.institution?.instWebsite : 'Desconocido');
    this.form.get('instPhone').setValue(this.institution ? this.institution?.instPhone : 'Desconocido');
    this.form.get('instFax').setValue(this.institution ? this.institution?.instFax : 'Desconocido');
    this.form.disable();
  }

  getInstitution(): void {
    this.institutionService.getInfoInstitution(this.user.instId)
      .then(resp => {
        this.institution = this.institutionAdapter.adaptObjectReceive(resp.data);
        this.setData();
      });
  }

  formEnable(): void {
    this.form.enable();
  }

  updateInstitution(): void {
    const institutionForm = this.form.value;
    institutionForm.id = this.institution.id;
    this.institutionService.updateInstitution(this.institutionAdapter.adaptObjectSend(institutionForm))
      .then(res => {
        if (res.status) {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Institución creada');
          this.form.disable();
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      })
      .catch(err => {
        this.errors = this.utilitiesConfigString.catchValidationErrors(err);
        this.errorClassInstName = this.errors.has('inst_name') ? 'ui-inputtext class-error' : '';
      });
  }

  showToUpdatePhoto(): void {
    this.updatePhoto = true;
  }

  onSelectFile(event, photo): void {
    this.uploadedFiles = [];
    for (const file of event.files) {
      if (file.size <= 1024000) {
        if (file.type.includes('image')) {
          this.uploadedFiles.push(file);
          if (event.files && event.files[0]) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imgChange = e.target.result;
            };
            reader.readAsDataURL(event.files[0]);
          }
          this.validFile = true;
        } else {
          this.validFile = false;
          this.messagerService.showToast(EnumLevelMessage.WARNING, 'Tipo de archivo no válido');
        }
      } else {
        this.messagerService.showToast(EnumLevelMessage.ERROR, ConstString.MESSAGE_FILE_1MB);
      }
      photo.clear();
    }

  }

  async updateUserPhoto(): Promise<void> {
    if (this.uploadedFiles != null && this.uploadedFiles.length !== 0) {
      const uploadAttachments = new SendAttachments(this.fileService);
      await uploadAttachments.sendAttachments(this.uploadedFiles, this.institution.id).then(response => {
        if (response.status) {
          this.institution.instPhoto = response.data.id;
          this.institutionService.updateInstitution(this.institutionAdapter.adaptObjectSend(this.institution))
            .then(res => {
              if (res.status) {
                this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Imagen actualizada con éxito.');
                this.imgChange = this.utilitiesConfigString.getImage(this.institution.instPhoto);
                this.updatePhoto = false;
              }
            });
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, response.message);
        }
      });
    }
  }

  changeErrorClassInstName(): void {
    this.errorClassInstName = 'ui-inputtext';
  }

}
