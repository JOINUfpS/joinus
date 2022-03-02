import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PublicationModel} from '../../../../models/publication/publication.model';
import {CategoryModel} from '../../../../models/utility/category.model';
import {CategoryAdapter} from '../../../../adapters/implementation/utility/category.adapter';
import {CategoryService} from '../../../../services/utility/category.service';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {PublicationService} from '../../../../services/publication/publication.service';
import {PublicationAdapter} from '../../../../adapters/implementation/publication/publication.adapter';
import {UserModel} from '../../../../models/user/user.model';
import {UsersService} from '../../../../services/user/user.service';
import {CommunityModel} from '../../../../models/user/community.model';
import {SendAttachments} from '../../../../utilities/send-attachments.service';
import {FileService} from '../../../../services/file/file.service';
import {v4 as uuid} from 'uuid';
import {MessagerService} from '../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';
import {extensionFileTypes, fileTypes} from '../../../../utilities/types';
import {ConstString} from '../../../../utilities/string/const-string';
import {AuthorPublicationModel} from '../../../../models/publication/author-publication.model';
import {AuthorPublicationAdapter} from '../../../../adapters/implementation/publication/author-publication.adapter';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/es';
import {UtilityRichText} from '../../../../utilities/utility-rich-text';


@Component({
  selector: 'app-create-edit-publication',
  templateUrl: './create-edit-publication.component.html',
  styleUrls: ['./create-edit-publication.component.css']
})
export class CreateEditPublicationComponent {

  readonly colorChooseIcon = 'color-icon-fill';
  readonly notColorChooseIcon = '';
  public filteredUser: AuthorPublicationModel[] = [];
  public publication: PublicationModel;
  public categoriesPublications: CategoryModel[];
  public checked = false;
  public authorsSelected: AuthorPublicationModel[] = [];
  public form: FormGroup;
  public publicationDialogDisplay: boolean;
  public showEditBtn = false;
  public submitted: boolean;
  public isLoading = false;
  public userSession: UserModel;
  public date = new Date();
  public uploadedFiles = [];
  public imgChange: any;
  public pdfUpload = null;
  public videoUpload = null;
  public typePublications: boolean;
  public publStandard: boolean;
  public errors = new Map();
  public buttonFormActioned = false;
  public optionsPrivacy: any[];
  disabledChooseIconDocument = false;
  disabledChooseIconVideo = false;
  disabledChooseIconImage = false;
  @Input() public showCreateEditButton: boolean;
  @Input() public community: CommunityModel;
  @Output() updateList = new EventEmitter<PublicationModel>();
  @Output() communicationWithDadViewCommunity = new EventEmitter<uuid>();
  @Output() updatePublication = new EventEmitter<PublicationModel>();
  @ViewChild('fileUpload') fileUpload: any;
  @ViewChild('mediaUpload') mediaUpload: any;
  editor = ClassicEditor;

  constructor(
    private categoryService: CategoryService,
    private adapterCategory: CategoryAdapter,
    private publicationService: PublicationService,
    private publicationAdapter: PublicationAdapter,
    private userServices: UsersService,
    private messagerService: MessagerService,
    public utilitiesConfigString: UtilitiesConfigString,
    private fileService: FileService,
    private authorPublicationAdapter: AuthorPublicationAdapter,
    public utilityRichText: UtilityRichText) {
    this.userSession = this.utilitiesConfigString.ls.get('user');
    this.typePublications = false;
    this.uploadedFiles = [];
    this.optionsPrivacy = [
      {name: 'Pública', code: false},
      {name: 'Privada', code: true},
    ];
  }

  showTypePublication(): void {
    this.typePublications = true;
  }

  show(publication: PublicationModel, publStandard: boolean): void {
    this.buttonFormActioned = undefined;
    if (publication !== null) {
      this.publication = PublicationModel.newPublicationModel(publication);
    }
    this.createForm(publStandard);
    this.setDataForm(publStandard);
    this.showEditBtn = this.publication !== undefined;
  }

  getCategoryAvailable(data): void {
    this.categoryService.listAllCategoryByType('Documento')
      .then(res => {
        this.categoriesPublications = this.adapterCategory.adaptList(res.data);
        const category = this.findCategory(data);
        this.form.get('publCategory').setValue(category ? category : this.categoriesPublications[0]);
      }).finally(() => {
      this.setPublAuthors(data);
    });
  }

  private createForm(publStandard: boolean): void {
    this.publStandard = null;
    this.form = undefined;
    const dicPublication: any = {};
    dicPublication.publTitle = new FormControl({
      value: null, disable: false
    }, [Validators.required, Validators.minLength(1), Validators.pattern(ConstString.PATTERN_NO_EMPTY_STRING)]);
    dicPublication.publDescription = new FormControl({value: null, disable: false});
    dicPublication.publPrivacy = new FormControl({value: null, disable: false}, [Validators.required]);
    dicPublication.publCategory = new FormControl({value: null, disable: false}, [Validators.required]);
    dicPublication.publProject = new FormControl({value: null});
    if (publStandard) {
      dicPublication.publAuthors = new FormControl({value: null, disable: false}, [Validators.required]);
      dicPublication.publFullText = new FormControl({value: null, disable: false});
      dicPublication.publLinkDoi = new FormControl({value: null, disable: false}, [
        Validators.pattern(ConstString.PATTERN_URL)]);
      dicPublication.publDate = new FormControl({value: null, disable: false});
    }
    this.form = new FormGroup(dicPublication);
  }

  private setDataForm(publStandard: boolean): void {
    this.date = new Date();
    this.form.get('publTitle').setValue(this.publication ? this.publication.publTitle : '');
    this.form.get('publDescription').setValue(this.publication ? this.publication.publDescription : '');
    this.form.get('publProject').setValue(this.publication?.publProject);
    if (this.publication?.publPrivacy !== undefined && this.publication?.publPrivacy) {
      this.form.get('publPrivacy').setValue(this.optionsPrivacy[1]);
    } else {
      this.form.get('publPrivacy').setValue(this.optionsPrivacy[0]);
    }
    if (publStandard) {
      this.form.get('publDate').setValue(this.publication ? this.publication.publDate : null);
      this.form.get('publFullText').setValue(this.publication ? this.publication.publFullText : false);
      this.form.get('publLinkDoi').setValue(this.publication ? this.publication.publLinkDoi : '');
      this.getCategoryAvailable(this.publication);
    }
    this.publStandard = publStandard;
    this.reseatFieldsUpload();
    if (this.publication !== null && this.publication?.publAttachments[0]?.fileType) {
      this.displayUploadFiles();
    }

    this.publicationDialogDisplay = true;
  }

  private findCategory(data): CategoryModel {
    let categorySelected = null;
    if (data?.cateId !== undefined) {
      this.categoriesPublications.forEach(category => {
        if (category.id === data.cateId) {
          categorySelected = category;
        }
      });
    }
    return categorySelected;
  }

  private setPublAuthors(data): void {
    this.authorsSelected = [];
    this.authorsSelected.push({
      id: this.userSession.id,
      authorName: this.userSession.userName,
      authorPhoto: this.userSession.userPhoto
    });
    this.form.get('publAuthors').setValue(data ? data.publAuthors : this.authorsSelected);
  }

  private displayUploadFiles(): void {
    this.disabledChooseIconDocument = true;
    this.disabledChooseIconImage = true;
    this.disabledChooseIconVideo = true;
    switch (this.publication?.publAttachments[0]?.fileType) {
      case extensionFileTypes.PDF:
        this.pdfUpload = this.publication.publAttachments[0];
        this.disabledChooseIconDocument = false;
        break;
      case extensionFileTypes.MP4:
        this.videoUpload = this.publication.publAttachments[0];
        this.disabledChooseIconVideo = false;
        break;
      case extensionFileTypes.PNG:
        this.disabledChooseIconImage = false;
        break;
    }
  }

  onSelectFile(event, photo): void {
    const megaByte = 1024000;
    this.reseatFieldsUpload();
    for (const file of event.files) {
      if (file.size <= megaByte) {
        if (file.type.includes('image') || file.type === 'video/mp4' || file.type === 'application/pdf') {
          if (file.type === extensionFileTypes.PDF) {
            this.mediaUpload.clear();
            this.uploadedFiles.push(file);
            this.pdfUpload = file;
            this.fileUpload?.clear();
            this.disableOptionsUpload(fileTypes.DOCUMENT);
          } else if (file.type === extensionFileTypes.MP4) {
            this.uploadedFiles.push(photo.files[0]);
            this.pdfUpload = null;
            this.videoUpload = file;
            this.mediaUpload.clear();
            this.disableOptionsUpload(fileTypes.VIDEO);
          } else if (event.files) {
            this.pdfUpload = null;
            this.uploadedFiles.push(photo.files[0]);
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.imgChange = e.target.result;
              this.disableOptionsUpload(fileTypes.IMAGE);
            };
            reader.readAsDataURL(event.files[0]);
          }
        } else {
          this.messagerService.showToast(EnumLevelMessage.WARNING, 'Tipo de archivo no válido');
        }
      } else {
        this.messagerService.showToast(EnumLevelMessage.ERROR, ConstString.MESSAGE_FILE_1MB);
      }
      photo.clear();
    }
  }

  removeFieldUpload(): void {
    if (this.publication !== undefined) {
      this.publication.publAttachments = [];
    }
    this.reseatFieldsUpload();
  }

  reseatFieldsUpload(): void {
    this.imgChange = null;
    this.pdfUpload = null;
    this.videoUpload = null;
    this.uploadedFiles = [];
    this.enableOptionsUpload();
  }

  async addAttachments(publication): Promise<void> {
    if (this.uploadedFiles.length !== 0) {
      const uploadAttachments = new SendAttachments(this.fileService);
      await uploadAttachments.sendAttachments(this.uploadedFiles, this.userSession.instId).then(response => {
        if (response.status) {
          publication.publAttachments = [response.data];
          publication.publAttachments[0].name = this.uploadedFiles[0].name;
        } else {
          this.buttonFormActioned = false;
          this.messagerService.showToast(EnumLevelMessage.ERROR, response.message);
        }
      }).catch(_ => {
        this.buttonFormActioned = false;
      });
    }
  }

  createEditPublication(): void {
    this.buttonFormActioned = true;
    const publicationForm = this.form.value;
    publicationForm.publStandard = this.publStandard;
    const today = new Date();
    if (this.community !== undefined) {
      publicationForm.commId = this.community.id;
      publicationForm.commName = this.community.commName;
    }
    if (!this.publStandard && !publicationForm.publTitle?.trimEnd().endsWith('?')) {
      this.form.get('publTitle').setErrors({missingQuestionMark: true});
      this.buttonFormActioned = false;
    } else if (this.publication) {
      this.editPublicationOrQuestion(publicationForm).then();
    } else if (!this.publStandard || (this.publStandard && publicationForm.publDate.getTime() <= today.getTime())) {
      this.createPublicationOrQuestion(publicationForm).then();
    } else {
      this.form.get('publDate').setErrors({noValidDate: true});
      this.buttonFormActioned = false;
    }

  }

  private disableOptionsUpload(typeFile: string): void {
    if (typeFile !== fileTypes.DOCUMENT) {
      this.disabledChooseIconDocument = true;
    }
    if (typeFile !== fileTypes.VIDEO) {
      this.disabledChooseIconVideo = true;
    }
    if (typeFile !== fileTypes.IMAGE) {
      this.disabledChooseIconImage = true;
    }
  }

  filterUser(event): void {
    let authorsPublicationSuggest: AuthorPublicationModel[] = [];
    this.userServices.getUserByName(this.userSession.instId, event.query)
      .then(res => {
        authorsPublicationSuggest = this.authorPublicationAdapter.adaptResponseToListAuthorPublicationModel(res.data);
        const filtered = [];
        const query = event.query;
        authorsPublicationSuggest.forEach(authorPublicationSuggest => {
          if (authorPublicationSuggest.authorName.toLowerCase().indexOf(query.toLowerCase()) > -1) {
            filtered.push(authorPublicationSuggest);
          }
        });
        this.filteredUser = filtered;
      });

  }

  addAuthor(event): void {
    const authorName = event.target.value;
    this.authorsSelected.push(new AuthorPublicationModel(null, authorName, null));
    this.form.get('publAuthors').setValue(this.authorsSelected);
    event.target.value = '';
  }

  private enableOptionsUpload(): void {
    this.disabledChooseIconDocument = false;
    this.disabledChooseIconVideo = false;
    this.disabledChooseIconImage = false;
  }

  private async editPublicationOrQuestion(publicationForm): Promise<void> {
    await this.addAttachments(this.publication);
    publicationForm.id = this.publication.id;
    publicationForm.publComment = this.publication.publComment;
    publicationForm.publAttachments = this.publication.publAttachments;
    this.publicationService.updatePublication(this.publicationAdapter.adaptObjectSend(publicationForm))
      .then(res => {
        if (res.status) {
          const newPublicacionModel = this.publicationAdapter.adaptObjectReceive(res.data);
          this.updatePublication.emit(newPublicacionModel);
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, this.publStandard ? '¡Publicación actualizada!' : '¡Pregunta actualizada!');
          this.typePublications = false;
        } else {
          this.buttonFormActioned = false;
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
        this.uploadedFiles = [];
        this.imgChange = null;
        this.videoUpload = null;
        this.fileUpload = null;
        this.pdfUpload = null;
      })
      .finally(() => {
        this.publicationDialogDisplay = false;
        this.buttonFormActioned = false;
      });
  }

  private async createPublicationOrQuestion(publicationForm): Promise<void> {
    await this.addAttachments(publicationForm);
    this.publicationService.savePublication(this.publicationAdapter.adaptObjectSend(publicationForm))
      .then(res => {
        if (res.status) {
          const newPublicationModel = this.publicationAdapter.adaptObjectReceive(res.data);
          this.updateList.emit(newPublicationModel);
          let mensaje = this.publStandard ? '¡Publicación creada!' : '¡Pregunta creada!';
          if (newPublicationModel.publPrivacy) {
            mensaje += ' Posteriormente solo la veras en tu perfil.';
          }
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, mensaje);
          this.typePublications = false;
          if (res.data.comm_id != null) {
            this.notifyPostInCommunity(res.data.id);
          }
          this.publicationDialogDisplay = false;
        } else {
          this.buttonFormActioned = false;
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
        this.uploadedFiles = [];
        this.imgChange = null;
        this.videoUpload = null;
        this.fileUpload = null;
        this.pdfUpload = null;
      })
      .catch(err => {
        this.errors = this.utilitiesConfigString.catchValidationErrors(err);
      })
      .finally(() => {
        this.buttonFormActioned = false;
        this.pdfUpload = null;
      });
  }

  private notifyPostInCommunity(publId: uuid): void {
    this.communicationWithDadViewCommunity.emit(publId);
  }

}
