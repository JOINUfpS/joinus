import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {ListCategoryComponent} from './category/list-category/list-category.component';
import {CategoryGuard} from '../../guards/permissions/category.guard';


export const routes: Routes = [
  {path: 'categorias', component: ListCategoryComponent, canActivate: [CategoryGuard]},

];

export const CategoryRoutes: ModuleWithProviders<any> = RouterModule.forChild(routes);
