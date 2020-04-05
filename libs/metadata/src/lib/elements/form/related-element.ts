import { BasicFormElement, BasicElementTemplateOptions } from './basic-form-element';

export const Related = 'related';

export interface RelatedElementTemplateOptions extends BasicElementTemplateOptions {
  values: string[];
  add?: boolean;
  edit?: boolean;
  delete?: boolean;
  param?: string;
}

export class RelatedElement extends BasicFormElement {

  endpoint: string;
  many?: boolean;
  useOptions?: boolean;
  options?: any[];
  doNotChoice?: boolean;
  visibleMode?: boolean;
  send?: boolean;
  withoutIdField?: boolean;

  relatedObjects?: {
    field: string;
    data: any;
    endpoint: string;
  };

  prefilled?: { [key: string]: string };
  query?: { [key: string]: any; }

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

  updateValues(values: string[]) {
    this.templateOptions.values.push(...values);

    return this;
  }

  setPerfilledFields(config: { [key: string]: string }) {
    this.prefilled = { ...config };

    return this;
  }

  setQuery(query: { [key: string]: any }) {
    this.query = { ...query };

    return this;
  }

  updateTemplateOptions(key: string, value: any) {
    this.templateOptions[key] = value;

    return this;
  }
}
