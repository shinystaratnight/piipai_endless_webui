import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './crm.routes';
import { CrmComponent } from './crm.component';

console.log('`Crm` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    CrmComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class CrmModule {
  public static routes = routes;
}
