import { Injectable } from '@angular/core';
import { Sort } from '../helpers';

interface SortData {
  [param: string]: Sort;
}

@Injectable()
export class SortService {
  data: {[list: string]: SortData};

  updateSortParams(exist: SortData, param: string): SortData {
    const sorted = exist[param];

    if (sorted === undefined) {
      exist[param] = Sort.ASC;
    } else if (sorted === Sort.ASC) {
      exist[param] = Sort.DESC;
    } else if (sorted === Sort.DESC) {
      delete exist[param];
    }

    return { ...exist };
  }

  getSortQuery(params: SortData): string {
    const entries = Object.entries(params);

    const queryMap = entries.map(entry => {
      const [name, sort] = entry;
      const prefix = sort === Sort.DESC ? '-' : '';
      return `${prefix}${name}`;
    });

    return queryMap.length ? `ordering=${queryMap.join(',')}` : '';
  }

  getSortedFields(columns) {
    const result = {};
    let exist = false;

    columns.forEach(el => {
      if (el.sort && el.sorted) {
        exist = true;
        result[el.sort_field] = el.sorted;
      }
    });

    return { result, exist };
  }
}
