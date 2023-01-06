import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { components } from './components';
import { directives } from './directives';
import { pipes } from './pipes';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    TranslateModule,
    FontAwesomeModule
  ],
  providers: [DecimalPipe, TranslatePipe],
  exports: [...components, ...pipes, ...directives],
  declarations: [...components, ...pipes, ...directives],
})
export class SharedModule {}
