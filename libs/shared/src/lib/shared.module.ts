import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastNoAnimationModule } from 'ngx-toastr';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { components } from './components';
import { directives } from './directives';
import { pipes } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    ToastNoAnimationModule.forRoot(),
    NgbTooltipModule,
  ],
  exports: [
    ...components,
    ...pipes,
    ...directives,
  ],
  declarations: [
    ...components,
    ...pipes,
    ...directives,
  ],
})
export class SharedModule { }
