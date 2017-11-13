import { ContactRegistrationFormComponent }
  from './components/contact-registration-form/contact-registration-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SiteComponent } from './components/site/site.component';
import { AuthGuard } from './services/auth-guard';
import { NotAuthorizedGuard } from './services/not-authorized-guard';

import { UserService } from './services/user.service';
import { NavigationService } from './services/navigation.service';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'login',
    component: LoginFormComponent,
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'login/:token',
    component: LoginFormComponent,
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'registration',
    component: ContactRegistrationFormComponent,
    canActivate: [NotAuthorizedGuard]
  },
  {
    path: 'registration/password',
    component: ContactRegistrationFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule',
    resolve: {
      user: UserService,
      pagesList: NavigationService
    },
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: SiteComponent,
    canActivate: [AuthGuard],
  }
];
