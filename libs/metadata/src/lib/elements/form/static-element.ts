import { BasicFormElement, BasicElementTemplateOptions } from './basic-form-element';

export const Static = 'static';

export interface StaticElementTemplateOptions extends BasicElementTemplateOptions {
  color?: string;
  inline?: boolean;
}

export class StaticElement extends BasicFormElement {

  templateOptions: StaticElementTemplateOptions;

  constructor(key: string, label: string) {
    super(key, label, Static);
  }

  setColor(color: string) {
    this.templateOptions.color = color;

    return this;
  }

  inlineValue() {
    this.templateOptions.inline = true;

    return this;
  }
}
