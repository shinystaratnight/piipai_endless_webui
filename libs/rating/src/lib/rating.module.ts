import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingControlComponent } from './rating-control/rating-control.component';
import { IconModule } from '@webui/icon';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, IconModule, ReactiveFormsModule],
  declarations: [RatingControlComponent],
  exports: [RatingControlComponent]
})
export class RatingModule {}
