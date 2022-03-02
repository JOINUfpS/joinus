import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {ListOpportunityComponent} from './opportunity/list-opportunity/list-opportunity.component';
import {ViewEditInstitutionComponent} from './institution/view-edit-institution/view-edit-institution.component';

export const routes: Routes = [
  {path: '', component: ViewEditInstitutionComponent},
  {path: 'oportunidades', component: ListOpportunityComponent},
];

export const InstitutionRoutes: ModuleWithProviders<any> = RouterModule.forChild(routes);
