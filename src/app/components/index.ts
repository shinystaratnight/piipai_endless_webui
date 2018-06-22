import { ContactRegistrationFormComponent } from './contact-registration-form/contact-registration-form.component'; //tslint:disable-line
import { LoginFormComponent } from './login-form/login-form.component';
import { SiteComponent } from './site/site.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FillInComponent } from './fill-in/fill-in.component';
import { VerifyEmailComponent } from './varify-email/varify-email.component';

export * from './contact-registration-form/contact-registration-form.component';
export * from './dashboard/dashboard.component';
export * from './fill-in/fill-in.component';
export * from './form-builder/form-builder.component';
export * from './login-form/login-form.component';
export * from './site/site.component';
export * from './varify-email/varify-email.component';

export const components = [
  LoginFormComponent,
  ContactRegistrationFormComponent,
  SiteComponent,
  DashboardComponent,
  FormBuilderComponent,
  FillInComponent,
  VerifyEmailComponent
];
