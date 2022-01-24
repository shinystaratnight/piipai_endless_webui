import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { StepperComponent } from './stepper/stepper.component';
import { StepperIndicatorComponent } from './stepper-indicator/stepper-indicator.component';
import { StepperItemComponent } from './stepper-item/stepper-item.component';

@NgModule({
  imports: [CommonModule, CdkStepperModule],
  declarations: [
    StepperComponent,
    StepperIndicatorComponent,
    StepperItemComponent
  ],
  exports: [StepperComponent, StepperIndicatorComponent, StepperItemComponent]
})
export class StepperModule {}
