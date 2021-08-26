import {
  BasicFormElement,
  BasicElementTemplateOptions
} from './basic-form-element';

export const Textarea = 'textarea';

type TextareaTemplateOptions = {
  full?: boolean;
};

export class TextareaElement extends BasicFormElement {
  templateOptions: BasicElementTemplateOptions & TextareaTemplateOptions;

  constructor(key: string, label: string) {
    super(key, label, Textarea);
  }

  setFullWidth() {
    this.templateOptions.full = true;

    return this;
  }
}
