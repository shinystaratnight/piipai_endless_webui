import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { services } from './services';

@NgModule({
  imports: [CommonModule],
  providers: [ ...services ]
})
export class CoreModule {}
