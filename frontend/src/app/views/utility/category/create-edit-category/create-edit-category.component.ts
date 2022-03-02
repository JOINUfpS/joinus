import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {CategoryService} from '../../../../services/utility/category.service';
import {CategoryAdapter} from '../../../../adapters/implementation/utility/category.adapter';
import {CategoryModel} from '../../../../models/utility/category.model';
import {categoryTypes} from '../../../../utilities/types';
import {Status} from '../../../../utilities/status';
import {MessagerService} from '../../../../messenger/messager.service';
import {ConstPermissions} from '../../../../utilities/string/security/const-permissions';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';

@Component({
  selector: 'app-create-edit-category',
  templateUrl: './create-edit-category.component.html'
})
export class CreateEditCategoryComponent implements OnInit {

  @Output()
  updateList: EventEmitter<any> = new EventEmitter();
  public display: boolean;
  public category: CategoryModel;
  public form: FormGroup;
  public showEditBtn: boolean;
  public errors = new Map();
  public typeOptions: any = Object.keys(categoryTypes).map(key => ({id: key, name: categoryTypes[key]}));
  public statusOptions: any = Object.keys(Status).map(key => ({id: key, name: Status[key]}));
  public classErrorCateName = 'ui-inputtext';
  public buttonCreateCategoryActioned = false;

  constructor(public utilitiesString: UtilitiesConfigString,
              private messagerService: MessagerService,
              private categoryService: CategoryService,
              public constPermissions: ConstPermissions,
              private categoryAdapter: CategoryAdapter) {
    this.display = false;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      cateName: new FormControl({value: null, disabled: false}, [Validators.required, Validators.maxLength(100)]),
      cateDescription: new FormControl({value: null, disabled: false}, [Validators.maxLength(300)]),
      cateType: new FormControl({value: null, disabled: false}, [Validators.required, Validators.maxLength(20)]),
      cateStatus: new FormControl({value: null, disabled: false}, [Validators.required, Validators.maxLength(10)]),
    });
  }

  show(data): void {
    this.display = true;
    this.category = data;
    this.setData(data);
    this.showEditBtn = data !== null;
  }

  setData(data): void {
    this.form.get('cateName').setValue(data ? data.cateName : null);
    this.form.get('cateDescription').setValue(data ? data.cateDescription : null);
    this.form.get('cateType').setValue(this.typeOptions.filter(type => type.name === data?.cateType)[0] ?
      this.typeOptions.filter(type => type.name === data?.cateType)[0] : this.typeOptions[0]);
    this.form.get('cateStatus').setValue(this.statusOptions.filter(status => status.name === data?.cateStatus)[0]
      ? this.statusOptions.filter(status => status.name === data?.cateStatus)[0] : this.statusOptions[0]);
  }

  save(): void {
    const category = this.form.value;
    this.buttonCreateCategoryActioned = true;
    if (this.category) {
      // is put
      category.id = this.category.id;
      this.categoryService.updateCategory(this.categoryAdapter.adaptObjectSend(category))
        .then(res => {
          if (res.status) {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Categoria actualizada');
            this.display = false;
          } else {
            this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
          }
        })
        .catch(err => {
          this.errors = this.utilitiesString.catchValidationErrors(err);
        })
        .finally(() => {
          this.buttonCreateCategoryActioned = false;
          this.updateList.emit();
        });
    } else {
      // is post
      this.categoryService.saveCategory(this.categoryAdapter.adaptObjectSend(category))
        .then(res => {
          if (res.status) {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Categoria creada');
            this.display = false;
          } else {
            this.messagerService.showToast(EnumLevelMessage.ERROR, res.message);
          }
        })
        .catch(err => {
          this.errors = this.utilitiesString.catchValidationErrors(err);
          this.classErrorCateName = this.errors.has('cate_name') ? 'ui-inputtext class-error' : '';
        })
        .finally(() => {
          this.buttonCreateCategoryActioned = false;
          this.updateList.emit();
        });
    }
  }

  changeErrorClassCateName(): void {
    this.classErrorCateName = 'ui-inputtext';
  }

}
