import { BasicFormElement, BasicElementTemplateOptions } from './basic-form-element';

export const Checkbox = 'checkbox';

export enum CheckboxType {
  Checkbox = 'checkbox'
}

export interface CheckboxElementTemplateOptions extends BasicElementTemplateOptions {
  type: CheckboxType
}

export class CheckboxElement extends BasicFormElement {

  templateOptions: CheckboxElementTemplateOptions;

  constructor(key: string, label: string, type: CheckboxType) {
    super(key, label, Checkbox);

    this.templateOptions.type = type;
  }
}
