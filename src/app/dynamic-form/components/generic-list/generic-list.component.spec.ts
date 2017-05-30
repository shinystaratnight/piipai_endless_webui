import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { GenericListComponent } from './generic-list.component';
import { GenericFormService } from './../../services/generic-form.service';
import { FilterService } from './../../services/filter.service';

describe('GenericListComponent', () => {
    let fixture: ComponentFixture<GenericListComponent>;
    let comp: GenericListComponent;
    let el;
    let metadata = {};
    let data;
    let mockGenericFormService = {
      getMetadata() {
        return Observable.of(metadata);
      },
      getAll() {
        return Observable.of(data);
      },
      getByQuery() {
        return Observable.of(data);
      },
      callAction() {
        return Observable.of(data);
      }
    };
    let mockFilterService = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                GenericListComponent
            ],
            providers: [
              {provide: GenericFormService, useValue: mockGenericFormService},
              {provide: FilterService, useValue: mockFilterService}
            ],
            schemas: [ NO_ERRORS_SCHEMA ],
            imports: [ RouterTestingModule.withRoutes([]) ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GenericListComponent);
            comp = fixture.componentInstance;
        });
    }));

    describe('ngOnInit method', () => {

      it('should be defined', async(() => {
        expect(comp.ngOnInit).toBeDefined();
      }));

      it('should create first table', async(() => {
        let endpoint = 'endpoint';
        metadata = {
          list: {
            list: 'company'
          }
        };
        comp.endpoint = endpoint;
        comp.tables = [];
        spyOn(comp, 'createTableData');
        comp.ngOnInit();
        expect(comp.createTableData).toHaveBeenCalledWith(endpoint);
      }));

    });

    describe('getMetadata method', () => {

      it('should be defined', async(() => {
        expect(comp.getMetadata).toBeDefined();
      }));

      it('should update metadata property', async(() => {
        let table: any = {};
        metadata = {
          list: {
            list: 'companies'
          },
          fields: [
            {
              type: 'checkbox',
              key: 'is_available',
              templateOptions: {
                label: 'test',
                type: 'checkbox',
                required: true
              }
            }
          ]
        };
        let endpoint = 'endpoint';
        spyOn(comp, 'parseUrl');
        comp.getMetadata(endpoint, table);
        expect(table.metadata).toEqual(metadata);
        expect(table.list).toEqual('companies');
        expect(table.id).toEqual(1);
        expect(comp.existingIds).toEqual([1]);
        expect(comp.tableId).toEqual(2);
        expect(comp.parseUrl).toHaveBeenCalledWith({}, table.list);
      }));

    });

    describe('getData method', () => {

      it('should be defined', async(() => {
        expect(comp.getData).toBeDefined();
      }));

      it('should update data property', async(() => {
        let table: any = {};
        data = {
          results: [
            {
              name: 'Home LTD',
              id: 123
            }
          ]
        };
        let endpoint = 'endpoint';
        comp.getData(endpoint, null, table);
        expect(table.data).toEqual(data);
      }));

      it('should update data by query', async(() => {
        let table: any = {};
        let query: '?active=true';
        data = {
          results: [
            {
              name: 'Home',
              id: 125
            }
          ]
        };
        let endpoint = 'endpoint';
        comp.getData(endpoint, query, table);
        expect(table.data).toEqual(data);
      }));

    });

    describe('eventHandler method', () => {

      it('should be defined', async(() => {
        expect(comp.eventHandler).toBeDefined();
      }));

      it('should update queries of list', async(() => {
        spyOn(comp, 'updateUrl');
        let event = {
          type: 'sort',
          list: 'company',
          query: 'company.name=Home'
        };
        comp.tables = [];
        comp.tables.push({ list: event.list });
        comp.eventHandler(event);
        expect(comp.updateUrl).toHaveBeenCalled();
        expect(comp.getTable(event.list).query).toEqual({ [event.type]: event.query});
      }));

      it('should remove table', async(() => {
        let event = {
          type: 'close',
          list: 'company'
        };
        let table = {
          list: 'company',
          endpoint: 'endpoint',
          first: true
        };
        comp.tables = [];
        comp.tables.push(table);
        comp.eventHandler(event);
        expect(comp.tables).toEqual([]);
      }));

      it('should set active table', async(() => {
        let event = {
          type: 'active',
          list: 'company'
        };
        let table = {
          list: 'company',
          endpoint: 'endpoint',
          first: true,
          active: false
        };
        comp.tables = [];
        comp.tables.push(table);
        spyOn(comp, 'resetActiveTable');
        comp.eventHandler(event);
        expect(table.active).toBeTruthy();
        expect(comp.resetActiveTable).toHaveBeenCalled();
      }));

      it('should call action', async(() => {
        let event = {
          type: 'action',
          list: 'company',
          data: [123, 124],
          action: {
            endpoint: 'some endpoint'
          }
        };
        let table = {
          list: 'company',
          endpoint: 'endpoint',
          first: true,
          active: false
        };
        comp.tables = [];
        comp.tables.push(table);
        spyOn(comp, 'callAction');
        comp.eventHandler(event);
        expect(comp.callAction).toHaveBeenCalledWith(event.data, event.action.endpoint);
      }));

    });

    describe('generateQuery method', () => {

      it('should be defined', async(() => {
        expect(comp.generateQuery).toBeDefined();
      }));

      it('should generate query', async(() => {
        let table = {
          list: 'company',
          query: {
            sort: 'company.name=Home',
            pagination: 'limit=2&offset=2'
          }
        };
        let result = comp.generateQuery(table.query);
        expect(result).toEqual(`?${table.query.sort}&${table.query.pagination}`);
      }));

    });

    describe('createTableData method', () => {

      it('should be defined', async(() => {
        expect(comp.createTableData).toBeDefined();
      }));

      it('should create table', async(() => {
        let endpoint = 'endpoint';
        spyOn(comp, 'getMetadata');
        let result = comp.createTableData(endpoint);
        expect(comp.getMetadata).toHaveBeenCalled();
        expect(result.endpoint).toEqual('endpoint');
        expect(result['first']).toBeTruthy();
      }));

    });

    describe('getTable method', () => {

      it('should return table from tables', async(() => {
        let table = {
          list: 'company',
          endpoint: 'endpoint',
          first: true
        };
        comp.tables.push(table);
        let result = comp.getTable('company');
        expect(result).toEqual(table);
      }));

    });

    describe('resetActiveTable method', () => {

      it('should reset active property of all tables', async(() => {
        let table = {
          list: 'company',
          endpoint: 'endpoint',
          first: true,
          active: true
        };
        comp.tables.push(table);
        comp.resetActiveTable(comp.tables);
        expect(comp.tables[0].active).toBeFalsy();
      }));

    });

    describe('listHandler method', () => {

      it('should reset active property of all tables', async(() => {
        let event = {
          endpoint: 'another endpoint'
        };
        let table = {
          list: 'company',
          endpoint: 'endpoint',
          first: true,
          active: true
        };
        comp.tables.push(table);
        spyOn(comp, 'createTableData');
        comp.listHandler(event);
        expect(comp.createTableData).toHaveBeenCalledWith(event.endpoint);
      }));

    });

    describe('checkList method', () => {

      it('should check if table allready exist', async(() => {
        let endpoint = 'endpoint';
        let table = {
          list: 'company',
          endpoint: 'endpoint',
          first: true,
          active: true
        };
        comp.tables.push(table);
        let result = comp.checkList(endpoint);
        expect(result).toBeFalsy();
      }));

    });

    describe('callAction method', () => {

      it('should call action for list', async(() => {
        data = {
          status: 'ok'
        };
        let endpoint = 'endpoint';
        let selectedElements = {
          123: true,
          124: true,
          125: false
        };
        comp.callAction(selectedElements, endpoint);
        expect(comp.res).toEqual(data);
      }));

    });

    describe('updateUrl method', () => {

      it('should update query on URL',
        async(inject([ActivatedRoute, Router],
          (route: ActivatedRoute, router: Router) => {
        let query = {
          filter: 'company=1c80c973-1c9e-4392-b044-da9c450c631b&company__type=master',
          pagination: 'limit=2&offset=2',
          sort: 'ordering=-company.name'
        };
        let list = 'companyaddress';
        let queryParams = {
          'companyaddress.f.company': '1c80c973-1c9e-4392-b044-da9c450c631b',
          'companyaddress.f.company__type': 'master',
          'companyaddress.p.page': 2,
          'companyaddress.s.ordering': '-company.name'
        };
        spyOn(router, 'navigate');
        comp.updateUrl(query, list);
        expect(router.navigate).toHaveBeenCalledWith([], { queryParams });
      })));

    });

    describe('parseUrl method', () => {

      it('should parse query params on URL', async() => {
        let table = {
          list: 'companyaddress',
          endpoint: 'endpoint',
          first: true,
          active: false
        };
        comp.tables = [];
        comp.tables.push(table);
        let query = {
          filter: 'company=1c80c973-1c9e-4392-b044-da9c450c631b&company__type=master',
          sort: 'ordering=-company.name',
          pagination: 'limit=1&offset=0'
        };
        let list = 'companyaddress';
        let queryParams = {
          'companyaddress.f.company': '1c80c973-1c9e-4392-b044-da9c450c631b',
          'companyaddress.f.company__type': 'master',
          'companyaddress.p.page': 1,
          'companyaddress.s.ordering': '-company.name'
        };
        spyOn(comp, 'getData');
        spyOn(comp, 'generateQuery');
        comp.count = 1;
        comp.limit = 1;
        comp.parseUrl(queryParams, list);
        let target = comp.getTable(list);
        expect(target.query).toEqual(query);
        expect(target.limit).toEqual(1);
        expect(target.offset).toEqual(0);
        expect(target.sorted).toEqual({
          'company.name': 'desc'
        });
        expect(comp.getData)
          .toHaveBeenCalledWith(table.endpoint, comp.generateQuery(target.query), target);
        expect(comp.generateQuery).toHaveBeenCalledWith(target.query);
      });

    });

    describe('setPage method', () => {

      it('should calculate page by query', async() => {
        let params = {
          limit: 2,
          offset: 2
        };
        comp.pagination = {};
        let result;
        Object.keys(params).forEach((elem, i , arr) => {
          result = comp.setPage(elem, params[elem]);
        });
        expect(comp.pagination).toEqual(params);
        expect(result).toEqual(2);
      });

    });

});
