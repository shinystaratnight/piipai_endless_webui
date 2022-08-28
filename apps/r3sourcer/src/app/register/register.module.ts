import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DynamicFormModule } from '@webui/dynamic-form';
import { routes } from './register.routing';
import { RegisterComponent } from './register.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [RegisterComponent],
  imports: [CommonModule, DynamicFormModule, RouterModule.forChild(routes), FontAwesomeModule]
})
export class RegisterModule {}
