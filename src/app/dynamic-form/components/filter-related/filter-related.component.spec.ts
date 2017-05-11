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
      endpoint: '',
      key: 'id',
      value: 'name'
    },
    query: 'company',
    param: 'id',
    many: true,
    options: []
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

    it('should delete value', async(inject([FilterService], (fs: FilterService) => {
      comp.config = config;
      spyOn(fs, 'generateQuery');
      spyOn(comp, 'genericQuery');
      let value = 'Home LTD';
      let element = {
        id: 1,
        data: value
      };
      comp.deleteValue(element);
      expect(element.data).toBeNull();
      expect(comp.genericQuery).toHaveBeenCalled();
      expect(fs.generateQuery).toHaveBeenCalled();
    })));

  });

  describe('addElement method', () => {

    it('should add new element', async(() => {
      let id = 2;
      let data = {
        id,
        data: ''
      };
      let options = [
        {
          [config.data.key]: 213,
          value: 'some value'
        }
      ];
      comp.config = config;
      comp.config.options = options;
      comp.count = id;
      comp.elements = [];
      comp.addElement();
      expect(comp.elements.pop()).toEqual(data);
    }));

  });

  describe('delete method', () => {

    it('should delete element', async(inject([FilterService], (fs: FilterService) => {
      comp.config = config;
      spyOn(fs, 'generateQuery');
      spyOn(comp, 'genericQuery');
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
      expect(comp.genericQuery).toHaveBeenCalled();
      expect(fs.generateQuery).toHaveBeenCalled();
    })));

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

  describe('onChange method', () => {

    it('should update query', async(inject([FilterService], (fs: FilterService) => {
      comp.config = config;
      spyOn(fs, 'generateQuery');
      spyOn(comp, 'genericQuery');
      comp.addElement();
      comp.onChange();
      expect(comp.genericQuery).toHaveBeenCalled();
      expect(fs.generateQuery).toHaveBeenCalled();
    })));

  });

  describe('genericQuery method', () => {

    it('should generate query', async(inject([FilterService], (fs: FilterService) => {
      let data = [{
        id: 1,
        data: 4567931
      }];
      let query = 'company';
      let result = comp.genericQuery(data, query);
      expect(result).toEqual(`${query}=4567931`);
    })));

  });

  describe('changeQuery method', () => {

    it('should emit event', () => {
      comp.config = config;
      spyOn(comp.event, 'emit');
      comp.changeQuery();
      expect(comp.event.emit).toHaveBeenCalled();
    });

  });

  describe('updateOptions method', () => {

    it('should update config.options property', () => {
      let options = [
        {
          [config.data.key]: 213,
          value: 'some value'
        },
        {
          [config.data.key]: 125,
          value: 'another value'
        },
        {
          [config.data.key]: 1225,
          value: 'super value'
        }
      ];
      let elements = [
        {
          id: 1,
          data: 125,
        },
        {
          id: 2,
          data: 213
        }
      ];
      let result = [
        {
          [config.data.key]: 213,
          value: 'some value',
          disabled: true
        },
        {
          [config.data.key]: 125,
          value: 'another value',
          disabled: true
        },
        {
          [config.data.key]: 1225,
          value: 'super value'
        }
      ];
      config.options = options;
      comp.config = config;
      comp.elements = elements;
      spyOn(comp, 'refreshOptions');
      comp.updateOptions(comp.config.options);
      expect(comp.refreshOptions).toHaveBeenCalled();
      expect(comp.config.options).toEqual(result);
    });

  });

  describe('refreshOptions method', () => {

    it('should refresh config.options property', () => {
      let options = [
        {
          [config.data.key]: 213,
          value: 'some value',
          disabled: true
        },
        {
          [config.data.key]: 125,
          value: 'another value',
          disabled: true
        }
      ];
      let result = [
        {
          [config.data.key]: 213,
          value: 'some value',
          disabled: false
        },
        {
          [config.data.key]: 125,
          value: 'another value',
          disabled: false
        }
      ];
      config.options = options;
      comp.config = config;
      comp.refreshOptions(comp.config.options);
      expect(comp.config.options).toEqual(result);
    });

  });

  describe('resetFilter method', () => {

    it('should reset query', async(inject([FilterService], (fs: FilterService) => {
      comp.config = config;
      spyOn(fs, 'generateQuery');
      spyOn(comp, 'addElement');
      spyOn(comp, 'changeQuery');
      comp.resetFilter();
      expect(comp.addElement).toHaveBeenCalled();
      expect(comp.changeQuery).toHaveBeenCalled();
      expect(fs.generateQuery).toHaveBeenCalled();
    })));

  });

});
