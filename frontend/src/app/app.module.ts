import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {AppComponent} from './app.component';
import {LoginComponent} from './account/login/login.component';
import {RegisterComponent} from './account/register/register.component';
import {ContainerComponent} from './views/container/container.component';
import {NavbarComponent} from './general/navbar/navbar.component';
import {UserProfileComponent} from './account/user-profile/user-profile.component';

import {UtilitiesConfigString} from './utilities/utilities-config-string.service';
import {UsersService} from './services/user/user.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {FollowUserViewComponent} from './views/user/follow-user/follow-user-view/follow-user-view.component';
import {ListCommunityComponent} from './views/user/community/list-community/list-community.component';
import {CreateEditCommunityComponent} from './views/user/community/create-edit-community/create-edit-community.component';
import {ViewCommunityComponent} from './views/user/community/view-community/view-community.component';
import {CommunityCardComponent} from './views/user/community/community-card/community-card.component';
import {FollowUserCardComponent} from './views/user/follow-user/follow-user-card/follow-user-card.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {CardModule} from 'primeng/card';
import {TabViewModule} from 'primeng/tabview';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutes} from './app.routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {ToolbarModule} from 'primeng/toolbar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {MultiSelectModule} from 'primeng/multiselect';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {FileUploadModule} from 'primeng/fileupload';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TableModule} from 'primeng/table';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from './shared/shared.module';
import {SearchComponent} from './general/search/search.component';
import {ChartModule} from 'primeng/chart';
import {NotificationModule} from './views/notification/notification.module';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import {ConstString} from './utilities/string/const-string';
import {TooltipModule} from 'primeng/tooltip';
import {StringCommunity} from './utilities/string/community/string-community';
import {RadioButtonModule} from 'primeng/radiobutton';
import {MenuModule} from 'primeng/menu';
import {StringNotification} from './utilities/string/notification/string-notification';
import {ConfirmAccountComponent} from './account/confirm-account/confirm-account.component';
import {CommunityUserCardComponent} from './views/user/community-user/community-user-card/community-user-card.component';
import {ToastModule} from 'primeng/toast';
import {LoadingInterceptor} from './interceptors/error/loading.interceptor';
import {LoadingService} from './services/loading/loading.service';
import {NgxSkeletonModule} from 'ngx-skeleton';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {PageNotFoundComponent} from './general/page-not-found/page-not-found.component';
import {ChipsModule} from 'primeng/chips';
import {GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from 'angularx-social-login';
import {UtilitiesList} from './utilities/utilities-list';
import {ChangePasswordComponent} from './account/change-password/change-password.component';
import {ForgotPasswordComponent} from './account/forgot-password/forgot-password.component';
import {ConfirmForgotPasswordComponent} from './account/confirm-forgot-password/confirm-forgot-password.component';
import {AccordionModule} from 'primeng/accordion';
import {HttpErrorInterceptor} from './interceptors/error/http-error.interceptor';
import {AuthenticationInterceptor} from './interceptors/authentication/authentication.interceptor';
import {ConstModules} from './utilities/string/security/const-modules';
import {ConstPermissions} from './utilities/string/security/const-permissions';
import {MessagerService} from './messenger/messager.service';
import {HelpComponent} from './general/help/help.component';
import {AboutUsComponent} from './general/about-us/about-us.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutes,
    HttpClientModule,
    NgbModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    CardModule,
    InputTextModule,
    RippleModule,
    ToolbarModule,
    CommonModule,
    BrowserAnimationsModule,
    TieredMenuModule,
    ButtonModule,
    TabViewModule,
    DropdownModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    CalendarModule,
    CheckboxModule,
    AutoCompleteModule,
    FileUploadModule,
    InputTextareaModule,
    SharedModule,
    ChartModule,
    NotificationModule,
    TooltipModule,
    VirtualScrollerModule,
    MenuModule,
    RadioButtonModule,
    ToastModule,
    InfiniteScrollModule,
    NgxSkeletonModule,
    ProgressSpinnerModule,
    SocialLoginModule,
    ChipsModule,
    AccordionModule,
    CKEditorModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ContainerComponent,
    NavbarComponent,
    PageNotFoundComponent,
    UserProfileComponent,
    FollowUserViewComponent,
    ListCommunityComponent,
    CreateEditCommunityComponent,
    ViewCommunityComponent,
    CommunityCardComponent,
    FollowUserCardComponent,
    DashboardComponent,
    SearchComponent,
    ConfirmAccountComponent,
    CommunityUserCardComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    ConfirmForgotPasswordComponent,
    HelpComponent,
    AboutUsComponent,
  ],
  providers: [UsersService,
    ConfirmationService,
    UtilitiesConfigString,
    ConstString,
    ConstModules,
    ConstPermissions,
    StringNotification,
    StringCommunity,
    MessagerService,
    MessageService,
    UtilitiesList,
    DatePipe,
    LoadingService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '628448076989-gvibo3kvri1oqf0omjlepdcp59chv5g8.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig
    }
  ],
  exports: [
    FollowUserCardComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
