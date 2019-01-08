import { RangeFilter, RangeFilterOptions, Range } from './range-filter';
import { RelatedFilter, RelatedFilterOptions, Related } from './related-filter';

export * from './range-filter';
export * from './related-filter';

export type Filter = RangeFilter | RelatedFilter;
export enum Type { Range, Relared }
export type FilterOptions = RangeFilterOptions | RelatedFilterOptions;

export function createFilter(type: Type, options: FilterOptions): Filter {
  switch (type) {
    case Type.Range:
      return new RangeFilter(options as RangeFilterOptions);

    case Type.Relared:
      return new RelatedFilter(options as RelatedFilterOptions);

    default:
      break;
  }
}
