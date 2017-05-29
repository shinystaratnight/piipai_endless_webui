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
    let response = {
      results: [
        {
          key: '123',
          value: 'Home'
        }
      ]
    };
    let mockGenericFormService = {
      getAll() {
        return Observable.of(response);
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
                  company_date: {
                    query: 'from=20-03-17&to=27-03-17',
                    value: undefined
                  }
                }
              }
            ];
            expect(s.queries).toEqual(result);
            query = 'company=12324&company=12312';
            result = [
              {
                list: 'company',
                keys: {
                  company_date: {
                    query: 'from=20-03-17&to=27-03-17',
                    value: undefined
                  },
                  company_name: {
                    query: 'company=12324&company=12312',
                    value: undefined
                  }
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
                  company_date: {
                    query: 'from=20-03-17&to=27-03-17'
                  },
                  company_name: {
                    query: 'company=12324&company=12312',
                  },
                  company_status: {
                    query: 'active=true'
                  }
                }
              }
            ];
            let result = `from=20-03-17&to=27-03-17&company=12324&company=12312&active=true`;
            s.queries = queries;
            expect(s.parseQueries(s.queries, 'company')).toEqual(result);
          })
      );
    });

    describe('parseFilters method', () => {
      it('should update related filters',
          inject([FilterService], (s: FilterService) => {
            s.filters = list;
            s.parseFilters(s.filters, {}, list.list);
            expect(s.filters[0].options).toEqual(response.results);
          })
      );

      it('should parse params from URL', inject([FilterService], (s: FilterService) => {
        let params = {
          param: 'company',
          value: 'true'
        };
        s.paramsOfFilters = params;
        params = {
          param: 'from',
          value: '2017-03-08'
        };
        s.paramsOfFilters = params;
        s.filters = list;
        spyOn(s, 'generateQuery');
        s.parseFilters(s.filters, s.paramsOfFilters, list.list);
        expect(s.generateQuery).toHaveBeenCalled();
      }));
    });

    describe('getQueries method', () => {
      it('should return queries data of filter',
          inject([FilterService], (s: FilterService) => {
            s.filters = list;
            s.queries.push({
              list: 'company',
              keys: {
                company_status: {
                  value: 'active=true'
                }
              }
            });
            let result = s.getQueries('company', 'company_status');
            expect(result).toEqual('active=true');
          })
      );

      it('should return query by URL',
          inject([FilterService], (s: FilterService) => {
            s.filters = list;
            s.queries.push({
              list: 'company',
              keys: {
                company_status: {
                  query: 'active=true'
                }
              }
            });
            let result = s.getQueries('company', 'company_status');
            expect(result).toEqual({
              byQuery: true,
              query: 'active=true'
            });
          })
      );
    });

    describe('resetQueries method', () => {
      it('should reset quries of list',
          inject([FilterService], (s: FilterService) => {
            s.filters = list;
            s.queries.push({
              list: 'company',
              keys: {
                company_status: {
                  value: 'active=true'
                }
              }
            });
            s.resetQueries('company');
            expect(s.queries).toEqual([]);
          })
      );
    });

});
