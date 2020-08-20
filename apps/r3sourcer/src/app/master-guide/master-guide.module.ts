import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  MasterGuideComponent,
  MasterGuideContentComponent,
  MasterGuideIconComponent
} from './components';

import { MasterGuideService } from './services';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule],
  declarations: [
    MasterGuideComponent,
    MasterGuideContentComponent,
    MasterGuideIconComponent
  ],
  providers: [MasterGuideService],
  exports: [MasterGuideComponent]
})
export class MasterGuideModule {}
