import { Injectable } from '@angular/core';

export type FilterType =
  | 'date'
  | 'checkbox'
  | 'related'
  | 'select'
  | 'text'
  | 'multiple'
  | 'range';

@Injectable()
export class FilterQueryService {
  public generateQueryOf(type: FilterType, filter): string {
    if (filter.hasOwnProperty('default')) {
      switch (type) {
        case 'checkbox':
          return this.parseCheckboxQuery(filter);

        default:
          return '';
      }
    }
  }

  private parseCheckboxQuery(config) {
    if (config.default) {
      return `${config.query}=${config.default}`;
    }
  }
}
