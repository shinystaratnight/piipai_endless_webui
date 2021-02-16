import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '@webui/dynamic-form';
import { UiModule } from '@webui/ui';

import { LoginComponent } from './login.component';
import { SharedModule } from '../shared/shared.module';
import { SharedModule as LibSharedModule } from '@webui/shared';

import { routes } from './login.routes';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule,

    DynamicFormModule,
    SharedModule,
    LibSharedModule,
    UiModule
  ]
})
export class LoginModule { }
