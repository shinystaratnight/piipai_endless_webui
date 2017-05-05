import { GenericFormService } from './generic-form.service';
import { GenericListComponent } from './../components/generic-list/generic-list.component';
import { TestBed, async, inject } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { Observable } from 'rxjs/Observable';

describe('FilterService', () => {
    let service;
    let list = {
      list: 'company',
      filters: [
        {
          type: 'related',
          key: 'company_name',
          label: 'Company',
          data: {
            endpoint: ''
          },
          query: 'company',
          param: 'id',
          many: true,
          options: [
            {
              key: '12324',
              value: 'Home LTD'
            },
            {
              key: '12312',
              value: 'Widjet LTD & CO'
            }
          ]
        },
        {
          type: 'date',
          key: 'company_date',
          label: 'Date',
          list: [
            {
              label: 'Today',
              query: 'created_at=20-03-17'
            },
            {
              label: 'Last week',
              query: 'from=20-03-17&to=27-03-17'
            },
            {
              label: 'Last month',
              query: 'from=20-03-17&to=20-04-17'
            }
          ],
          input: [
            {
              query: 'from',
              label: 'From date'
            },
            {
              query: 'to',
              label: 'To date'
            }
          ]
        },
        {
          type: 'choice',
          key: 'company_status',
          label: 'Status of company',
          query: 'company',
          list: [
            {
              label: 'Active',
              value: 'active=true'
            },
            {
              label: 'Deactivated',
              value: 'active=false'
            }
          ]
        }
      ]
    };
    let mockGenericFormService = {
      getAll() {
        return Observable.of([1, 3, 4]);
      }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FilterService,
                {provide: GenericFormService, useValue: mockGenericFormService}
            ]
        });
    });

    describe('getFiltersOfList method', () => {
      it('should return filters of list',
          inject(
            [FilterService], (s: FilterService) => {
            spyOn(s, 'deleteFilters');
            s.filters = list;
            let result = s.getFiltersOfList('company');
            expect(result).toEqual(list.filters);
            expect(s.deleteFilters).toHaveBeenCalled();
          })
      );
    });

    describe('deleteFilters method', () => {
      it('should delete filters of list',
          inject([FilterService], (s: FilterService) => {
            s.filters = list;
            s.deleteFilters(s.filters, 'company');
            expect(s.filters).toEqual([]);
          })
      );
    });

    describe('getQuery method', () => {
      it('should delete filters of list',
          inject([FilterService], (s: FilterService) => {
            spyOn(s, 'parseQueries');
            s.filters = list;
            s.getQuery('company');
            expect(s.parseQueries).toHaveBeenCalled();
          })
      );
    });

    describe('generateQuery method', () => {
      it('should generate queries object',
          inject([FilterService], (s: FilterService) => {
            let query = 'from=20-03-17&to=27-03-17';
            s.filters = list;
            s.generateQuery(query, 'company_date', 'company');
            let result: any = [
              {
                list: 'company',
                keys: {
                  company_date: 'from=20-03-17&to=27-03-17'
                }
              }
            ];
            expect(s.queries).toEqual(result);
            query = 'company=12324&company=12312';
            result = [
              {
                list: 'company',
                keys: {
                  company_date: 'from=20-03-17&to=27-03-17',
                  company_name: 'company=12324&company=12312'
                }
              }
            ];
            s.generateQuery(query, 'company_name', 'company');
            expect(s.queries).toEqual(result);
          })
      );
    });

    describe('parseQueries method', () => {
      it('should generate queries object',
          inject([FilterService], (s: FilterService) => {
            s.filters = list;
            let queries: any;
            queries = [
              {
                list: 'company',
                keys: {
                  company_date: 'from=20-03-17&to=27-03-17',
                  company_name: 'company=12324&company=12312',
                  company_status: 'active=true'
                }
              }
            ];
            let result = `?from=20-03-17&to=27-03-17&company=12324&company=12312&active=true`;
            s.queries = queries;
            expect(s.parseQueries(s.queries, 'company')).toEqual(result);
          })
      );
    });

});
