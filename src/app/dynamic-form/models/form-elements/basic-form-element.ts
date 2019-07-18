import { BehaviorSubject } from 'rxjs';

import { Field } from '..';

export interface BasicElementTemplateOptions {
  label?: string;
  placeholder?: string;
  description?: string;
}

export class BasicFormElement {
  key: string;
  type: string;

  mode?: BehaviorSubject<string>;
  hidden?: BehaviorSubject<boolean>;
  formData?: BehaviorSubject<{ data: any}>;

  default?: any;
  read_only?: boolean;
  value?: any;
  hide?: boolean;

  templateOptions: BasicElementTemplateOptions;

  constructor(key: string, label: string, type: string) {
    this.key = key;
    this.type = type;
    this.templateOptions = {
      label
    };
  }

  update(config: Field) {
    Object.assign(this, config);

    return this;
  }

  updateTemplate(config: any) {
    Object.assign(this.templateOptions, config);

    return this;
  }
}
