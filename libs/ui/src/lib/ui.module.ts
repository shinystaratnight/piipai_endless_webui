import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CloseButtonComponent, TimeComponent, BackLinkComponent, CheckboxComponent } from './components';

@NgModule({
  declarations: [CloseButtonComponent, TimeComponent, BackLinkComponent, CheckboxComponent],
  imports: [CommonModule, RouterModule, TranslateModule, FontAwesomeModule],
  exports: [CloseButtonComponent, TimeComponent, BackLinkComponent, CheckboxComponent]
})
export class UiModule {}
