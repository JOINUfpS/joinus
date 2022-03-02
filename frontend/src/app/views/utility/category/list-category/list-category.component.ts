import {Component, OnInit, ViewChild} from '@angular/core';
import {CreateEditCategoryComponent} from '../create-edit-category/create-edit-category.component';
import {UtilitiesConfigString} from '../../../../utilities/utilities-config-string.service';
import {ConfigTables} from '../../../../utilities/config-tables.service';
import {ConfirmationService} from 'primeng/api';
import {CategoryService} from '../../../../services/utility/category.service';
import {CategoryAdapter} from '../../../../adapters/implementation/utility/category.adapter';
import {CategoryModel} from '../../../../models/utility/category.model';
import {MessagerService} from '../../../../messenger/messager.service';
import {ConstModules} from '../../../../utilities/string/security/const-modules';
import {ConstPermissions} from '../../../../utilities/string/security/const-permissions';
import {EnumLevelMessage} from '../../../../messenger/enum-level-message.enum';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html'
})
export class ListCategoryComponent implements OnInit {

  categories: CategoryModel[];
  cols: any[];
  selectedCheckbox;
  originalCategories: CategoryModel[];
  permissions: string[];
  paginator: any;
  totalRecords = 0;
  @ViewChild('dt', {static: false}) dt: any;
  @ViewChild('modalCategory', {static: false}) modalCategory: CreateEditCategoryComponent;


  constructor(
    private constModules: ConstModules,
    private confirmationService: ConfirmationService,
    public utilitiesString: UtilitiesConfigString,
    public constPermissions: ConstPermissions,
    public categoryService: CategoryService,
    public categoryAdapter: CategoryAdapter,
    public configTables: ConfigTables,
    private messagerService: MessagerService) {
    this.categories = [];
    this.initPermissions();
    this.initColumns();
  }

  ngOnInit(): void {
    this.getCategories();
  }

  private initPermissions(): void {
    this.permissions = this.utilitiesString.ls.get('permissions')
      .find(element => element.moduName === this.constModules.CATEGORIES).moduPermissions;
  }

  private initColumns(): void {
    this.cols = [
      {field: 'cateName', header: 'Nombre'},
      {field: 'cateDescription', header: 'Descripción'},
      {field: 'cateType', header: 'Tipo'},
      {field: 'actions', header: 'Acciones'}
    ];
  }

  getCategories(): void {
    this.categoryService.listAllCategories()
      .then(res => {
        this.categories = this.categoryAdapter.adaptList(res.data);
        this.originalCategories = this.categories;
        this.paginator = res.paginator;
        this.totalRecords = res.paginator.count;
      }).finally(() => {
      this.bringPaginatedCategories();
      this.eventCheck();
    });
  }

  private bringPaginatedCategories(): void {
    if (this.paginator.next !== null && this.paginator.next !== undefined) {
      this.categoryService.listCategoriesWithPagination(this.paginator).then(res => {
        this.categories = this.categories.concat(this.categoryAdapter.adaptList(res.data));
        this.paginator = res.paginator;
      }).finally(() => {
        this.bringPaginatedCategories();
      });
    }
  }

  eventCheck(): void {
    if (this.selectedCheckbox.length === 0 || this.selectedCheckbox.length === 3) {
      this.categories = this.originalCategories;
    } else {
      this.categories = [];
      this.selectedCheckbox.forEach(item => {
        this.categories = this.categories.concat(this.originalCategories.filter(cate =>
          cate.cateType === item));
      });
    }
  }

  addOrEdit(data): void {
    if (data !== null) {
      this.modalCategory.show(data);
    } else {
      this.modalCategory.show(null);
    }
  }

  delete(category: CategoryModel): void {
    this.confirmationService.confirm({
      message: this.utilitiesString.msgConfirmDelete + 'la categoria ' + category.cateName + '?',
      accept: () => {
        this.categoryService.deleteCategory(category.id)
          .then(_ => {
            this.messagerService.showToast(EnumLevelMessage.SUCCESS, 'Categoria eliminada');
            this.getCategories();
          });
      }
    });
  }

}
