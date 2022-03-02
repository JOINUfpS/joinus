import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import {ViewPublicationComponent} from './publication/view-publication/view-publication.component';


export const routes: Routes = [
  {path: 'publicacion/:publId', component: ViewPublicationComponent},
];

export const PublicationRoutes: ModuleWithProviders<any> = RouterModule.forChild(routes);
