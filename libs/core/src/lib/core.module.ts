import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { services, ENV } from './services';
import { guards } from './guards';
import { interceptors } from './interceptors';

@NgModule({
  imports: [CommonModule],
  providers: [
    ...services,
    ...guards,
    ...interceptors
  ]
})
export class CoreModule {

  static forRoot(environment: any): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: ENV, useValue: environment }
      ]
    };
  }
}
