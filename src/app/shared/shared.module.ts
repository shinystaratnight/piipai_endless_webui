import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { NavigationComponent } from '../components/navigation/navigation.component';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { ToastComponent } from './components/toast.component';

import { ErrorsService } from './services/errors.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Angular2FontawesomeModule,
    ToastModule.forRoot()
  ],
  exports: [
    NavigationComponent,
    BreadcrumbComponent,
    ToastComponent
  ],
  declarations: [
    NavigationComponent,
    BreadcrumbComponent,
    ToastComponent
  ],
  providers: [ErrorsService],
})
export class SharedModule { }
