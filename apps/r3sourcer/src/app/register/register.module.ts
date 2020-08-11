import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DynamicFormModule } from '@webui/dynamic-form';
import { routes } from './register.routing';
import { RegisterComponent } from './register.component';
import { TranslateModule, TranslateLoader, TranslateCompiler, MissingTranslationHandler } from '@ngx-translate/core';

@NgModule({
  declarations: [RegisterComponent],
  imports: [CommonModule, DynamicFormModule, RouterModule.forChild(routes), TranslateModule.forChild()]
})
export class RegisterModule {}
