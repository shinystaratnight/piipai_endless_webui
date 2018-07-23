import { FilterService } from './filter.service';
import { GenericFormService } from './generic-form.service';
import { FormService } from './form.service';
import { WorkflowService } from './workflow.service';

export * from './filter.service';
export * from './generic-form.service';
export * from './form.service';
export * from './workflow.service';

export const services = [
  FilterService,
  GenericFormService,
  FormService,
  WorkflowService,
];
