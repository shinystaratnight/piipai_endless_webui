import { BasicFormElement, BasicElementTemplateOptions } from './basic-form-element';
import { generateOptions } from './utils';

export const Select = 'select';

export interface SelectElementTemplateOptions extends BasicElementTemplateOptions {
  options: { value: any, label: any }[];
}

export class SelectElement extends BasicFormElement {

  templateOptions: SelectElementTemplateOptions;

  constructor(key: string, label: string) {
    super(key, label, Select);
  }

  addOptions(options: { [value: string]: any }) {
    this.templateOptions.options = generateOptions(options);

    return this;
  }
}
