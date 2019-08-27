import { BasicFormElement, BasicElementTemplateOptions } from './basic-form-element';

export const Input = 'input';

export enum InputType {
  Text = 'text'
}

export interface InputElementTemplateOptions extends BasicElementTemplateOptions {
  max?: number;
  type: InputType;
}

export class InputElement extends BasicFormElement {

  templateOptions: InputElementTemplateOptions;

  constructor(key: string, label: string, type: InputType) {
    super(key, label, Input);

    this.templateOptions.type = type;
  }
}
