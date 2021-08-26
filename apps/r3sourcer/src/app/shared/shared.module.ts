import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NavigationComponent } from './components/navigation/navigation.component';
import { UiModule } from '@webui/ui';

@NgModule({
  declarations: [NavigationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    FontAwesomeModule,
    UiModule
  ],
  exports: [NavigationComponent]
})
export class SharedModule {}
