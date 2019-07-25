import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { DynamicFormModule } from '@webui/dynamic-form';
import { SharedModule } from '@webui/shared';
import { routes } from './login.routing';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    DynamicFormModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
})
export class LoginModule { }
