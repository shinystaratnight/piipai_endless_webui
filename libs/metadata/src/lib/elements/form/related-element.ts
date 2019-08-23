import { BasicFormElement, BasicElementTemplateOptions } from './basic-form-element';

export const Related = 'related';

export interface RelatedElementTemplateOptions extends BasicElementTemplateOptions {
  values: string[];
  add?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export class RelatedElement extends BasicFormElement {

  endpoint: string;
  many?: boolean;
  useOptions?: boolean;
  options?: any[];
  doNotChoice?: boolean;
  visibleMode?: boolean;
  send?: boolean;

  relatedObjects?: {
    field: string;
    data: any;
    endpoint: string;
  };

  prefilled?: { [key: string]: string };

  templateOptions: RelatedElementTemplateOptions;

  constructor(key: string, label: string, endpoint: string) {
    super(key, label, Related);

    this.endpoint = endpoint;

    this.templateOptions.values = ['__str__', '__id__'];
  }

  setRelatedObjects(field: string, data: any, endpoint: string) {
    this.relatedObjects = {
      field,
      data,
      endpoint
    }

    return this;
  }

  setActions(addObject: boolean, editObject: boolean, deleteObject: boolean) {
    this.templateOptions.add = addObject;
    this.templateOptions.edit = editObject;
    this.templateOptions.delete = deleteObject;

    return this;
  }

  doNotSend() {
    this.send = false;

    return this;
  }

  updateValues(values: string[]) {
    this.templateOptions.values.push(...values);

    return this;
  }

  setPerfilledFields(config: { [key: string]: string }) {
    this.prefilled = { ...config };

    return this;
  }
}
