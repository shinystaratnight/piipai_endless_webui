import { ContactRegistrationFormComponent }
  from './components/contact-registration-form/contact-registration-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home';
import { NoContentComponent } from './pages/no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: ContactRegistrationFormComponent },
  { path: '**', component: NoContentComponent },
];
