import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NavigationComponent } from './components/navigation/navigation.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [NavigationComponent, SpinnerComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  exports: [NavigationComponent, SpinnerComponent]
})
export class SharedModule {}
