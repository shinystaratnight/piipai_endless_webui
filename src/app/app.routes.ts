import { ContactRegistrationFormComponent }
  from './components/contact-registration-form/contact-registration-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home';
import { SiteComponent } from './components/site/site.component';
import { AuthGuard } from './services/auth-guard';
import { NotAuthorizedGuard } from './services/not-authorized-guard';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/'
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
    path: '**',
    component: SiteComponent,
    canActivate: [AuthGuard]
  }
];
