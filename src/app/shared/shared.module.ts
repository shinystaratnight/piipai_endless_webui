import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { ToastNoAnimationModule } from 'ngx-toastr';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { components } from './components';

import { services } from './services';

import { pipes } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Angular2FontawesomeModule,
    ToastNoAnimationModule.forRoot(),
    FormsModule,
    NgbTooltipModule,
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
