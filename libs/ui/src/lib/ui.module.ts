import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseButtonComponent, TimeComponent } from './components';

@NgModule({
  declarations: [CloseButtonComponent, TimeComponent],
  imports: [CommonModule],
  exports: [CloseButtonComponent, TimeComponent]
})
export class UiModule {}
