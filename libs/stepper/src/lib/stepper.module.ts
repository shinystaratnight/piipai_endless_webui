import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { StepperComponent } from './stepper/stepper.component';
import { StepperIndicatorComponent } from './stepper-indicator/stepper-indicator.component';

@NgModule({
  imports: [CommonModule, CdkStepperModule],
  declarations: [StepperComponent, StepperIndicatorComponent],
  exports: [StepperComponent, StepperIndicatorComponent]
})
export class StepperModule {}
