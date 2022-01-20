import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from './dialog.service';
import { IconModule } from '@webui/icon';

@NgModule({
  imports: [CommonModule, NgbModule, IconModule],
  declarations: [DialogComponent],
  providers: [DialogService],
  exports: [DialogComponent]
})
export class DialogModule {}
