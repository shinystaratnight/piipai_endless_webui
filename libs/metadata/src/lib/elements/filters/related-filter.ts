import { FilterModel } from './filter.model';

export interface RelatedFilterOptions {
  key: string;
  label: string;
  endpoint: string;
  defaultValue?: any;
  multiple?: boolean;
  query?: string;
  display?: string | string[];
  parameter?: string;
}

export const Related = 'related';

export class RelatedFilter implements FilterModel {
  public type = Related;

  public default: any;
  public key: string;
  public label: string;
  public query: string;
  public multiple?: boolean;
  public data: {
    value: string | string[];
    endpoint: string;
    key: string;
  };

  constructor(options: RelatedFilterOptions) {
    const { key, label, query = key, endpoint, defaultValue = null, multiple, display = '__str__', parameter = 'id' } = options;

    this.key = key;
    this.label = label;
    this.query = query;
    this.default = defaultValue;
    this.multiple = multiple;
    this.data = {
      value: display,
      endpoint,
      key: parameter
    };
  }
}
