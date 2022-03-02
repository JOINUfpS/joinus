import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {CommunityService} from '../../../../services/user/community.service';
import {CommunityAdapter} from '../../../../adapters/implementation/user/community.adapter';
import {CategoryService} from '../../../../services/utility/category.service';
import {CategoryAdapter} from '../../../../adapters/implementation/utility/category.adapter';
import {v4 as uuid} from 'uuid';
import {UserModel} from '../../../../models/user/user.model';
import {StringCommunity} from '../../../../utilities/string/community/string-community';
import {CommunityUserAdapter} from '../../../../adapters/implementation/user/community-user.adapter';
import {CategoryModel} from '../../../../models/utility/category.model';
import {MessagerService} from '../../../../messenger/messager.service';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';
import {CommunityModel} from '../../../../models/user/community.model';
import {ConstString} from '../../../../utilities/string/const-string';

@Component({
  selector: 'app-create-edit-community',
  templateUrl: './create-edit-community.component.html'
})
export class CreateEditCommunityComponent implements OnInit {

  public userSession: UserModel;
  community: any;
  form: FormGroup;
  communityDialogDisplay: boolean;
  categoriesOptions: CategoryModel[];
  url: string;
  @Output() updateList: EventEmitter<any> = new EventEmitter();
  @Output() updateCommunity = new EventEmitter<CommunityModel>();
  uploadedFiles: any[];
  showEditBtn: boolean;
  @Input()
  permissions: any;
  submitted: boolean;
  checked = false;
  instId: uuid;
  optionsPrivacy: any[];
  buttonCreateCommunityActioned = false;

  constructor(
    public utilitiesConfigString: UtilitiesConfigString,
    private messagerService: MessagerService,
    private communityService: CommunityService,
    private adapterCategory: CategoryAdapter,
    private adapterCommunity: CommunityAdapter,
    private categoryService: CategoryService,
    private adapterCommunityUser: CommunityUserAdapter,
    private stringCommunity: StringCommunity
  ) {
    this.showEditBtn = true;
    this.optionsPrivacy = [
      {name: 'Pública', code: false},
      {name: 'Privada', code: true},
    ];
    this.userSession = this.utilitiesConfigString.ls.get('user');
  }

  ngOnInit(): void {
    this.getCategoryAvailable();
    this.controlForm();
  }

  controlForm(): void {
    this.form = new FormGroup({
      commName: new FormControl({value: null, disable: false}, [Validators.required,
        Validators.maxLength(100), Validators.minLength(2), Validators.pattern(ConstString.PATTERN_NO_EMPTY_STRING)]),
      commDescription: new FormControl({value: null, disable: false}, [Validators.maxLength(10000)]),
      commCategory: new FormControl({value: null, disabled: false}, [Validators.required]),
      commPrivacy: new FormControl('', [Validators.required]),
    });
  }

  show(data, instId: uuid): void {
    this.instId = instId;
    this.communityDialogDisplay = true;
    this.community = data;
    this.uploadedFiles = [];
    this.setData(data);
    this.showEditBtn = data !== null;
  }

  setData(data): void {
    this.form.get('commName').setValue(data ? data.commName : '');
    this.form.get('commDescription').setValue(data ? data.commDescription : '');
    const commCategory = this.categoriesOptions.filter(c => c.id === data?.commCategory);
    this.form.get('commCategory').setValue(commCategory[0]);
    const commPrivacy = this.optionsPrivacy.filter(c => c.code === data?.commPrivacy);
    this.form.get('commPrivacy').setValue(commPrivacy[0]);
  }

  createOrEditCommunity(): void {
    this.buttonCreateCommunityActioned = true;
    const communityForm = this.form.value;
    communityForm.id = this.community?.id;
    communityForm.inst_id = this.instId;
    if (this.community) {
      this.editCommunity(communityForm);
    } else {
      const communityAdapted = this.adapterCommunity.adaptObjectSend(communityForm);
      this.createCommunity(communityAdapted, communityForm);
    }
  }

  private createCommunity(communityAdapted: any, communityForm: any): void {
    communityAdapted.community_user = this.adapterCommunityUser.adaptCommunityUser(this.userSession, communityForm);
    this.communityService.saveCommunity(communityAdapted)
      .then(res => {
        if (res.status) {
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Comunidad creada');
          this.communityDialogDisplay = false;
          this.updateList.emit();
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.errors);
        }
      })
      .finally(() => {
        this.buttonCreateCommunityActioned = false;
      });
  }

  private editCommunity(communityForm: any): void {
    communityForm.commAmountMember = this.community.commAmountMember;
    communityForm.commOwnerId = this.community.commOwnerId;
    communityForm.commPhotoId = this.community.commPhotoId;
    this.communityService.updateCommunity(this.adapterCommunity.adaptObjectSend(communityForm))
      .then(res => {
        if (res.status) {
          const communityUpdate = this.adapterCommunity.adaptObjectReceive(res.data);
          this.messagerService.showToast(EnumLevelMessage.SUCCESS, this.stringCommunity.COMMUNITY_UPDATE);
          this.communityDialogDisplay = false;
          this.updateCommunity.emit(communityUpdate);
        } else {
          this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
        }
      })
      .finally(() => {
        this.buttonCreateCommunityActioned = false;
      });
  }

  private getCategoryAvailable(): void {
    this.categoryService.listAllCategoryByType('Comunidad')
      .then(res => {
        this.categoriesOptions = this.adapterCategory.adaptList(res.data);
      });
  }
}
