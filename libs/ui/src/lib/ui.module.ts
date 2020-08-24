import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseButtonComponent } from './components';

@NgModule({
  declarations: [CloseButtonComponent],
  imports: [CommonModule],
  exports: [CloseButtonComponent]
})
export class UiModule {}
