import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { NavigationComponent } from '../components/navigation/navigation.component';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { ToastComponent } from './components/toast.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

import { ErrorsService } from './services/errors.service';
import { CheckPermissionService } from './services/check-permission';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Angular2FontawesomeModule,
    ToastModule.forRoot(),
    FormsModule,
  ],
  exports: [
    NavigationComponent,
    BreadcrumbComponent,
    ToastComponent,
    SpinnerComponent,
  ],
  declarations: [
    NavigationComponent,
    BreadcrumbComponent,
    ToastComponent,
    SpinnerComponent,
  ],
  providers: [ErrorsService, CheckPermissionService],
})
export class SharedModule { }
