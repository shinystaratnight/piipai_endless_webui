import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FilterService } from './../../services/filter.service';

import { FilterRelatedComponent } from './filter-related.component';

describe('FilterRelatedComponent', () => {
  let fixture: ComponentFixture<FilterRelatedComponent>;
  let comp: FilterRelatedComponent;
  let el;
  let config = {
    type: 'related',
    key: 'key of filter',
    label: 'Company',
    data: {
      endpoint: ''
    },
    query: 'company',
    param: 'id',
    many: true,
  };
  let mockFilterValue = {
    generateQuery() {
      return true;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterRelatedComponent
      ],
      providers: [{provide: FilterService, useValue: mockFilterValue}],
      imports: [],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FilterRelatedComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', async() => {
    comp.config = config;
    fixture.detectChanges();
    expect(comp.config).toBeDefined();
  });

  describe('ngOnInit method', () => {

    it('should initial elements', async(() => {
      comp.config = config;
      let element = {
        id: 1,
        data: ''
      };
      comp.ngOnInit();
      expect(comp.elements[0]).toEqual(element);
    }));

  });

  describe('deleteValue method', () => {

    it('should delete value', async(() => {
      let value = 'Home LTD';
      let element = {
        id: 1,
        data: value
      };
      comp.deleteValue(element);
      expect(element.data).toBeNull();
    }));

  });

  describe('addElement method', () => {

    it('should parse phone number', async(() => {
      let id = 2;
      let data = {
        id,
        data: ''
      };
      comp.count = id;
      comp.addElement();
      expect(comp.elements.pop()).toEqual(data);
    }));

  });

  describe('delete method', () => {

    it('should element', async(() => {
      let id = 2;
      let data = {
        id,
        data: ''
      };
      comp.count = id;
      comp.addElement();
      expect(comp.elements.pop()).toEqual(data);
      comp.deleteElement(data);
      expect(comp.elements.filter((elem) => elem.id === id)).toEqual([]);
    }));

  });

  describe('createElement method', () => {

    it('should create element', async(() => {
      let id = 2;
      let data = {
        id,
        data: ''
      };
      let result = comp.createElement(id);
      expect(result).toEqual(data);
    }));

  });

});
