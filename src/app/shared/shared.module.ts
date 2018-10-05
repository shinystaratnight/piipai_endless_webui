import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { ToastrModule } from 'ngx-toastr';

import { components } from './components';

import { services } from './services';

import { pipes } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Angular2FontawesomeModule,
    ToastrModule.forRoot(),
    FormsModule,
  ],
  exports: [
    ...components,
    ...pipes
  ],
  declarations: [
    ...components,
    ...pipes
  ],
  providers: [
    ...services
  ],
})
export class SharedModule { }
