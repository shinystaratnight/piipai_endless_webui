import { BasicFormElement, BasicElementTemplateOptions } from './basic-form-element';

export const Textarea = 'textarea';

export class TextareaElement extends BasicFormElement {

  templateOptions: BasicElementTemplateOptions;

  constructor(key: string, label: string) {
    super(key, label, Textarea);
  }
}
