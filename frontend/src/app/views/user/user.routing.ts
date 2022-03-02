import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {ListCommunityComponent} from './community/list-community/list-community.component';
import {ListRoleComponent} from './role/list-role/list-role.component';
import {ListUserComponent} from './user/list-user/list-user.component';
import {ListInviteRoleComponent} from './role/invite-role/list-invite-role/list-invite-role.component';
import {ViewCommunityComponent} from './community/view-community/view-community.component';
import {RoleGuard} from '../../guards/permissions/role.guard';
import {InviteRoleGuard} from '../../guards/permissions/invite-role.guard';


export const routes: Routes = [
  {path: '', component: ListUserComponent},
  {path: 'roles', component: ListRoleComponent, canActivate: [RoleGuard]},
  {path: 'comunidades', component: ListCommunityComponent},
  {path: 'comunidad/:commId', component: ViewCommunityComponent},
  {path: 'comunidad/:action/:commId', component: ViewCommunityComponent},
  {path: 'invitacion-de-rol', component: ListInviteRoleComponent, canActivate: [InviteRoleGuard]}

];

export const UserRoutes: ModuleWithProviders<any> = RouterModule.forChild(routes);
