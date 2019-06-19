import { BehaviorSubject } from 'rxjs';

export interface BasicElementTemplateOptions {
  label?: string;
  placeholder?: string;
  description?: string;
}

export class BasicElementModel {
  key: string;
  type: string;

  mode?: BehaviorSubject<string>;
  hidden?: BehaviorSubject<boolean>;

  default?: any;
  read_only?: boolean;
  value?: any;
  hide?: boolean;

  templateOptions: BasicElementTemplateOptions;

  contructor(key: string, type: string, label: string) {
    this.key = key;
    this.type = type;
    this.templateOptions = {
      label
    };
  }

  updateModel(config: BasicElementModel) {
    Object.assign(this, config);
  }

  updateTemplate(config: BasicElementTemplateOptions) {
    Object.assign(this.templateOptions, config);
  }
}
