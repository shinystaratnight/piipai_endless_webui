import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './settings.routing';
import { PermissionsComponent } from './permissions/permissions.component';
import { PermissionsService } from './permissions/permissions.service';

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [PermissionsComponent],
  providers: [PermissionsService]
})
export class SettingsModule { }
