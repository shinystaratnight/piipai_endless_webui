import {
  BasicFormElement,
  BasicElementTemplateOptions,
} from './basic-form-element';

export const Input = 'input';

export enum InputType {
  Text = 'text',
  Picture = 'picture',
  Number = 'number',
}

export interface InputElementTemplateOptions
  extends BasicElementTemplateOptions {
  max?: number;
  type: InputType;
  step?: number;
  min?: number;
  display?: string;
  icon?: string;
  required: boolean;
}

export class InputElement extends BasicFormElement {
  override templateOptions!: InputElementTemplateOptions;

  constructor(key: string, label: string, type: InputType) {
    super(key, label, Input);

    this.templateOptions.type = type;
    this.templateOptions.required = false;
  }

  setNumberOptions(step: number, min?: number, max?: number) {
    this.templateOptions.step = step;
    this.templateOptions.min = min;
    this.templateOptions.max = max;

    return this;
  }

  setFormatOfValue(format: string) {
    this.templateOptions.display = format;

    return this;
  }

  setIcon(icon?: string) {
    this.templateOptions.icon = icon;

    return this;
  }

  setRequired() {
    this.templateOptions.required = true;

    return this;
  }
}
