import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { components } from './components';

import { services } from './services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Angular2FontawesomeModule,
    ToastModule.forRoot(),
    FormsModule,
  ],
  exports: [
    ...components
  ],
  declarations: [
    ...components,
  ],
  providers: [
    ...services
  ],
})
export class SharedModule { }
