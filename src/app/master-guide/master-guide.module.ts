import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';

import {
  MasterGuideComponent,
  MasterGuideContentComponent,
  MasterGuideIconComponent
} from './components';

import { MasterGuideService } from './services';

@NgModule({
  imports: [CommonModule, RouterModule, Angular2FontawesomeModule, FormsModule],
  declarations: [
    MasterGuideComponent,
    MasterGuideContentComponent,
    MasterGuideIconComponent,
  ],
  providers: [MasterGuideService],
  exports: [MasterGuideComponent]
})
export class MasterGuideModule {}
