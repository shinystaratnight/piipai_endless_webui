import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

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
            schemas: [ NO_ERRORS_SCHEMA ]
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
        comp.ngOnInit();
        expect(comp.tables[0].endpoint).toEqual(endpoint);
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
        comp.getMetadata(endpoint, table);
        expect(table.metadata).toEqual(metadata);
        expect(table.list).toEqual('companies');
        expect(table.id).toEqual(1);
        expect(comp.existingIds).toEqual([1]);
        expect(comp.tableId).toEqual(2);
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

    });

    describe('eventHandler method', () => {

      it('should be defined', async(() => {
        expect(comp.eventHandler).toBeDefined();
      }));

      it('should update queries of list', async(() => {
        spyOn(comp, 'getData');
        let event = {
          type: 'sort',
          list: 'company',
          query: 'company.name=Home'
        };
        comp.tables = [];
        comp.tables.push({ list: event.list });
        comp.eventHandler(event);
        expect(comp.getData).toHaveBeenCalled();
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
        spyOn(comp, 'getData');
        let result = comp.createTableData(endpoint);
        expect(comp.getMetadata).toHaveBeenCalled();
        expect(comp.getData).toHaveBeenCalled();
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
        comp.listHandler(event);
        expect(comp.tables.length).toEqual(2);
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

});
