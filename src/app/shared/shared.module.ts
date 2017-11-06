import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

import { NavigationComponent } from '../components/navigation/navigation.component';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Angular2FontawesomeModule
  ],
  exports: [
    NavigationComponent,
    BreadcrumbComponent
  ],
  declarations: [
    NavigationComponent,
    BreadcrumbComponent
  ],
  providers: [],
})
export class SharedModule { }
