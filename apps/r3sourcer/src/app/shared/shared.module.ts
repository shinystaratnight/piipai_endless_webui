import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NavigationComponent } from './components/navigation/navigation.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TimeComponent } from './components/time/time.component';

@NgModule({
  declarations: [NavigationComponent, SpinnerComponent, TimeComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule, FormsModule, FontAwesomeModule],
  exports: [NavigationComponent, SpinnerComponent]
})
export class SharedModule {}
