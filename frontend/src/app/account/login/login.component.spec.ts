import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {
  ChildrenOutletContexts,
  NoPreloading,
  PreloadingStrategy,
  Router,
  ROUTER_CONFIGURATION,
  RouteReuseStrategy,
  ROUTES,
  UrlHandlingStrategy,
  UrlSerializer
} from '@angular/router';
import {SocialAuthService} from 'angularx-social-login';
import {SecurityService} from '../../services/security/security.service';
import {SecurityAdapter} from '../../adapters/implementation/security/security.adapter';
import {ModulesAdapter} from '../../adapters/implementation/user/modules.adapter';
import {MessagerService} from '../../messenger/messager.service';
import {UtilitiesConfigString} from '../../utilities/utilities-config-string.service';
import {UserAdapter} from '../../adapters/implementation/user/user.adapter';
import {Compiler, CUSTOM_ELEMENTS_SCHEMA, Injector} from '@angular/core';
import {MockLocationStrategy, SpyLocation} from '@angular/common/testing';
import {LocationStrategy} from '@angular/common';
import {RouterTestingModule, setupTestingRouter} from '@angular/router/testing';
import {ContainerComponent} from '../../views/container/container.component';
import {DashboardComponent} from '../../views/dashboard/dashboard.component';

xdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(
          [{path: 'iniciar-sesion', component: LoginComponent}, {
            path: '', component: ContainerComponent,
            children: [{path: '', component: DashboardComponent}]
          }]
        )
      ],
      declarations: [LoginComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: Location, useClass: SpyLocation},
        {provide: LocationStrategy, useClass: MockLocationStrategy},
        {
          provide: Router,
          useFactory: setupTestingRouter,
          deps: [
            UrlSerializer, ChildrenOutletContexts, Location, Compiler, Injector, ROUTES,
            ROUTER_CONFIGURATION, [UrlHandlingStrategy, new Option()],
            [RouteReuseStrategy, new Option()]
          ]
        },
        {provide: PreloadingStrategy, useExisting: NoPreloading},
        SocialAuthService,
        SecurityService,
        SecurityAdapter,
        ModulesAdapter,
        MessagerService,
        UtilitiesConfigString,
        UserAdapter]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
