import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './account/login/login.component';
import {ModuleWithProviders} from '@angular/core';
import {RegisterComponent} from './account/register/register.component';
import {ContainerComponent} from './views/container/container.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {PageNotFoundComponent} from './general/page-not-found/page-not-found.component';
import {UserProfileComponent} from './account/user-profile/user-profile.component';
import {SearchComponent} from './general/search/search.component';
import {ConfirmAccountComponent} from './account/confirm-account/confirm-account.component';
import {ConfirmForgotPasswordComponent} from './account/confirm-forgot-password/confirm-forgot-password.component';
import {AuthenticationGuard} from './guards/authentication/authentication.guard';
import {AboutUsComponent} from './general/about-us/about-us.component';
import {HelpComponent} from './general/help/help.component';

const routes: Routes = [
  {path: 'iniciar-sesion', component: LoginComponent},
  {path: 'registrarse', component: RegisterComponent},
  {path: 'confirmar-cuenta', component: ConfirmAccountComponent},
  {path: 'recuperar-clave', component: ConfirmForgotPasswordComponent},
  {
    path: '', component: ContainerComponent,
    children: [
      {path: '', component: DashboardComponent, canActivate: [AuthenticationGuard]},
      {path: 'perfil/:idUserToShow', component: UserProfileComponent, canActivate: [AuthenticationGuard]},
      {
        path: 'perfil/:typeNotification/:idUserToShow',
        component: UserProfileComponent,
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'institucion', canActivate: [AuthenticationGuard],
        loadChildren: () => import('./views/institution/institution.module').then(m => m.InstitutionModule)
      },
      {
        path: 'publicaciones', canActivate: [],
        loadChildren: () => import('./views/publication/publication.module').then(m => m.PublicationModule)
      },
      {
        path: 'usuarios',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('./views/user/user.module').then(m => m.UserModule)
      },
      {
        path: 'utilidades',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('./views/utility/utility.module').then(m => m.UtilityModule)
      },
      {
        path: 'chat',
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('./views/chat/chat.module').then(m => m.ChatModule)
      },
      {path: 'buscar/:stringToSearch', canActivate: [AuthenticationGuard], component: SearchComponent}
    ]
  },
  {path: 'acerca-de-nosotros', component: AboutUsComponent},
  {path: 'ayuda', component: HelpComponent},
  {path: 'pagina-no-encontrada', component: PageNotFoundComponent},
  {path: 'pagina-no-encontrada/:cause', component: PageNotFoundComponent},
  {path: '**', redirectTo: `pagina-no-encontrada`}
];

export const AppRoutes: ModuleWithProviders<any> = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
