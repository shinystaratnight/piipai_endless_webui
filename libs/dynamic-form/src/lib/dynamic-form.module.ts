import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  NgbAccordionModule,
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbPopoverModule,
  NgbRatingModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { AgmCoreModule } from '@agm/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';
import { SignaturePadModule } from 'angular2-signaturepad';
import { WebcamModule } from 'ngx-webcam';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { MetadataModule } from '@webui/metadata';
import { UiModule } from '@webui/ui';

import { services, METADATA } from './services';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { modals, components as modalComponents } from './modals';
import { directives } from './directives';

import { SharedModule } from '@webui/shared';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@webui/icon';
import { DialogModule } from '@webui/dialog';
import { FormControlsModule } from '@webui/form-controls';
import { StepperModule } from '@webui/stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { RatingModule } from '@webui/rating';
import { GoogleMapsModule } from '@angular/google-maps';
import { EmailPreviewComponent } from './modals/email-preview/email-preview.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // NgbModule,
    FontAwesomeModule,
    FormsModule,
    RouterModule,
    // AgmCoreModule,
    InfiniteScrollModule,
    SharedModule,
    ButtonsModule.forRoot(),
    GooglePlaceModule,
    QuillModule,
    SignaturePadModule,
    DragDropModule,

    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxIntlTelInputModule,

    MetadataModule,

    TranslateModule,

    UiModule,
    WebcamModule,
    NgxDropzoneModule,
    IconModule,
    DialogModule,
    FormControlsModule,
    StepperModule,
    CdkStepperModule,
    RatingModule,
    GoogleMapsModule,
    NgbPopoverModule,
    NgbPaginationModule,
    NgbRatingModule,
    NgbNavModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgbTooltipModule,
    NgbDatepickerModule,
  ],
  exports: [
    fromComponents.GenericFormComponent,
    fromComponents.GenericListComponent,
    fromContainers.DynamicFormComponent,
    fromContainers.DynamicListComponent,
    fromContainers.FilterBlockComponent,
    fromComponents.WorkflowComponent,
    fromComponents.TestGeneratorComponent,
    fromContainers.FormBuilderFormComponent,
    fromComponents.FilterRelatedComponent,
    fromComponents.ImageUploaderComponent,
  ],
  declarations: [
    // fromComponents.WebcamComponent,

    ...fromComponents.components,
    ...directives,
    ...fromContainers.components,
    ...modals,
    ...modalComponents,
    EmailPreviewComponent,
  ],
  providers: [...services],
  entryComponents: [
    ...fromComponents.entryComponents,
    ...fromContainers.entryComponents,
    ...modals,
    ...modalComponents,
  ],
})
export class DynamicFormModule {
  static forRoot(data: {
    metadata: any;
  }): ModuleWithProviders<DynamicFormModule> {
    return {
      ngModule: DynamicFormModule,
      providers: [{ provide: METADATA, useClass: data.metadata }],
    };
  }

  static forChild(data: {
    metadata: any;
  }): ModuleWithProviders<DynamicFormModule> {
    return {
      ngModule: DynamicFormModule,
      providers: [{ provide: METADATA, useClass: data.metadata }],
    };
  }
}
