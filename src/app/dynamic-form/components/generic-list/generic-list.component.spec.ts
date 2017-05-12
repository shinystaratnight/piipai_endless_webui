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
    let metadata = [];
    let data;
    let mockGenericFormService = {
      getMetadata() {
        return Observable.of(metadata);
      },
      getAll() {
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

    describe('getMetadata method', () => {

      it('should be defined', async(() => {
        expect(comp.getMetadata).toBeDefined();
      }));

      it('should update metadata property', async(() => {
        metadata = [{
          type: 'checkbox',
          key: 'is_available',
          templateOptions: {
            label: 'test',
            type: 'checkbox',
            required: true
          }
        }];
        let endpoint = 'endpoint';
        comp.getMetadata(endpoint);
        expect(comp.metadata).toEqual(metadata);
      }));

    });

    describe('getData method', () => {

      it('should be defined', async(() => {
        expect(comp.getData).toBeDefined();
      }));

      it('should update data property', async(() => {
        data = {
          results: [
            {
              name: 'Home LTD',
              id: 123
            }
          ]
        };
        let endpoint = 'endpoint';
        comp.getData(endpoint);
        expect(comp.data).toEqual(data.results);
      }));

    });

    describe('eventHandler method', () => {

      it('should be defined', async(() => {
        expect(comp.eventHandler).toBeDefined();
      }));

      it('should call sortTable method', async(() => {
        comp.queries = {};
        let event = {
          type: 'sort',
          list: 'company',
          sort: {
            primary_contact: 'asc'
          }
        };
        spyOn(comp, 'sortTable');
        comp.eventHandler(event);
        expect(comp.sortTable).toHaveBeenCalled();
      }));

    });

    describe('sortTable method', () => {

      it('should be defined', async(() => {
        expect(comp.sortTable).toBeDefined();
      }));

      it('should create query', async(() => {
        let event = {
          type: 'sort',
          list: 'company',
          sort: {
            primary_contact: 'desc'
          }
        };
        let result = comp.sortTable(event);
        expect(result).toEqual('o=-primary_contact');
      }));

    });

});
