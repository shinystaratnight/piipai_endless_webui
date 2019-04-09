import { RangeFilter, RangeFilterOptions, Range } from './range-filter';
import { RelatedFilter, RelatedFilterOptions, Related } from './related-filter';
import { DateFilter, DateFilterOptions, Date } from './date-filter';

export * from './range-filter';
export * from './related-filter';

export type Filter = RangeFilter | RelatedFilter | DateFilter;
export enum Type { Range, Relared, Date }
export type FilterOptions = RangeFilterOptions | RelatedFilterOptions | DateFilterOptions;

export function createFilter(type: Type, options: FilterOptions): Filter {
  switch (type) {
    case Type.Range:
      return new RangeFilter(options as RangeFilterOptions);

    case Type.Relared:
      return new RelatedFilter(options as RelatedFilterOptions);

    case Type.Date:
      return new DateFilter(options as DateFilterOptions);

    default:
      break;
  }
}
