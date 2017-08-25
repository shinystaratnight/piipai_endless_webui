import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FilterService } from './../../services/filter.service';
import { RouterTestingModule } from '@angular/router/testing';

import { FilterRelatedComponent } from './filter-related.component';

describe('FilterRelatedComponent', () => {
  let fixture: ComponentFixture<FilterRelatedComponent>;
  let comp: FilterRelatedComponent;
  let el;
  let config = {
    type: 'related',
    key: 'key of filter',
    label: 'Company',
    listName: 'copmany',
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
  let queries;
  let mockFilterValue = {
    generateQuery() {
      return true;
    },
    getQueries() {
      return queries;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterRelatedComponent
      ],
      providers: [{provide: FilterService, useValue: mockFilterValue}],
      imports: [ RouterTestingModule ],
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
        data: '',
        lastElement: 0,
        hideAutocomplete: true
      };
      comp.ngOnInit();
      expect(comp.elements[0]).toEqual(element);
      expect(comp.count).toEqual(2);
    }));

    it ('should fill in filter', () => {
      comp.config = config;
      queries = [
        {
          data: 'some id',
          id: 1
        },
        {
          data: 'another id',
          id: 5
        }
      ];
      spyOn(comp, 'updateFilter');
      comp.ngOnInit();
      expect(comp.elements).toEqual(queries);
      expect(comp.count).toEqual(5);
      expect(comp.query).toEqual('company=some id&company=another id&');
      expect(comp.updateFilter).toHaveBeenCalled();
      expect(comp.isCollapsed).toBeFalsy();
    });

    it('should update filter by query from URL', async(() => {
      comp.config = config;
      queries = {
        byQuery: true,
        query: 'company=Home'
      };
      spyOn(comp, 'parseQuery');
      comp.ngOnInit();
      expect(comp.parseQuery).toHaveBeenCalled();
    }));

  });

  describe('genericList method', () => {
    it('generate list from options', () => {
      let item = {
        id: 1,
        data: ''
      };
      config.options = [
        {
          [config.data.key]: '124',
          [config.data.value]: 'Second Value'
        },
        {
          [config.data.key]: '123',
          [config.data.value]: 'First Value'
        }
      ];
      comp.config = config;
      spyOn(comp, 'generatePreviewList');
      comp.generateList(item);
      expect(comp.list).toEqual(config.options);
      expect(comp.generatePreviewList).toHaveBeenCalledWith(comp.list, item);
    });
  });

  describe('generatePreviewList method', () => {
    it('should generate preview list', () => {
      let item  = {
        id: 1,
        lastElement: 0
      };
      let list = [
        {
          [config.data.key]: '123',
          [config.data.value]: 'First Value'
        }
      ];
      comp.limit = 10;
      comp.generatePreviewList(list, item);
      expect(item.lastElement).toEqual(10);
      expect(comp.previewList).toEqual(list);
    });
  });

  describe('openAutocomplete method', () => {
    it('should open autocomplete element and add focus on input', fakeAsync(() => {
      let searchElement = {
        children: [
          {
            focus() {
              return true;
            }
          }
        ]
      };
      let event = {
        target: {
          classList: {
            contains() {
              return true;
            }
          },
          offsetHeight: 25,
          nextElementSibling: searchElement
        }
      };
      let item = {
        id: 1,
        hideAutocomplete: true
      };
      config.options = [
        {
          [config.data.key]: '123',
          [config.data.value]: 'First Value'
        }
      ];
      comp.config = config;
      comp.searchValue = 'a';
      spyOn(comp, 'generateList');
      spyOn(searchElement.children[0], 'focus');
      comp.openAutocomplete(event, item);
      expect(comp.searchValue).toBeNull();
      expect(item.hideAutocomplete).toBeFalsy();
      expect(comp.topHeight).toEqual(25);
      expect(comp.generateList).toHaveBeenCalledWith(item);
      tick(100);
      expect(searchElement.children[0].focus).toHaveBeenCalled();
    }));
  });

  describe('resetList method', () => {
    it('should reset properties after autocomplete element was closed', fakeAsync(() => {
      let item = {
        id: 1,
        hideAutocomplete: false,
        lastElement: 20
      };
      comp.list = [];
      comp.previewList = [];
      comp.resetList(item);
      tick(200);
      expect(comp.list).toBeNull();
      expect(comp.previewList).toBeNull();
      expect(item.hideAutocomplete).toBeTruthy();
      expect(item.lastElement).toEqual(0);
    }));
  });

  describe('filter method', () => {
    it('should call generateList method', () => {
      let item = {
        id: 1,
        lastElement: 10
      };
      spyOn(comp, 'generateList');
      comp.filter(false, item);
      expect(item.lastElement).toEqual(0);
      expect(comp.generateList).toHaveBeenCalled();
    });

    it('should filter options by some value', () => {
      let value = 'an';
      let item = {
        id: 1
      };
      config.options = [
        {
          [config.data.key]: '123',
          [config.data.value]: 'Anna'
        },
        {
          [config.data.key]: '124',
          [config.data.value]: 'Tom'
        }
      ];
      comp.config = config;
      spyOn(comp, 'generatePreviewList');
      comp.filter(value, item);
      expect(comp.list).toEqual([config.options[0]]);
      expect(comp.generatePreviewList).toHaveBeenCalled();
    });
  });

  describe('onModalScrollDown method', () => {
    it('should call generatePreviewList', () => {
      let item = {
        id: 1
      };
      comp.list = [];
      spyOn(comp, 'generatePreviewList');
      comp.onModalScrollDown(item);
      expect(comp.generatePreviewList).toHaveBeenCalledWith(comp.list, item);
    });
  });

  describe('setValue method', () => {
    it('should set value from autocomplete element', () => {
      let item = {
        id: 1,
        data: ''
      };
      let value = {
        [config.data.key]: '124',
        [config.data.value]: 'Tom'
      };
      comp.config = config;
      comp.list = [];
      comp.previewList = [];
      comp.searchValue = 'om';
      spyOn(comp, 'onChange');
      comp.setValue(value, item);
      expect(comp.list).toBeNull();
      expect(comp.previewList).toBeNull();
      expect(comp.searchValue).toBeNull();
      expect(item.data).toEqual('124');
      expect(comp.onChange).toHaveBeenCalled();
    });
  });

  describe('deleteValue method', () => {

    it('should delete value', async(inject([FilterService], (fs: FilterService) => {
      comp.config = config;
      spyOn(fs, 'generateQuery');
      spyOn(comp, 'genericQuery');
      spyOn(comp, 'changeQuery');
      let value = 'Home LTD';
      let element = {
        id: 1,
        data: value
      };
      comp.deleteValue(element);
      expect(element.data).toEqual('');
      expect(comp.genericQuery).toHaveBeenCalled();
      expect(comp.changeQuery).toHaveBeenCalled();
      expect(fs.generateQuery).toHaveBeenCalled();
    })));

  });

  describe('getValueByKey method', () => {
    it('should return value by some property', () => {
      let key = '124';
      config.options = [
        {
          [config.data.key]: '124',
          [config.data.value]: 'Tom'
        }
      ];
      comp.config = config;
      let result = comp.getValueByKey(key);
      expect(result).toEqual('Tom');
    });
  });

  describe('addElement method', () => {

    it('should add new element', () => {
      comp.count = 1;
      comp.elements = [
        {
          id: 1
        }
      ];
      config.options = [
        {
          [config.data.key]: '123',
          [config.data.value]: 'Anna'
        },
        {
          [config.data.key]: '124',
          [config.data.value]: 'Tom'
        }
      ];
      comp.config = config;
      spyOn(comp, 'createElement').and.returnValue({
        id: 2
      });
      comp.addElement();
      expect(comp.elements.length).toEqual(2);
      expect(comp.elements[1]).toEqual({ id: 2 });
    });

  });

  describe('deleteElement method', () => {

    it('should delete element', async(inject([FilterService], (fs: FilterService) => {
      comp.config = config;
      spyOn(fs, 'generateQuery');
      spyOn(comp, 'genericQuery');
      spyOn(comp, 'changeQuery');
      let data = {
        id: 1,
        data: ''
      };
      let elements = [
        data,
        {
          id: 2,
          data: ''
        }
      ];
      comp.elements = elements;
      comp.deleteElement(data);
      expect(comp.elements).toEqual([{id: 2, data: ''}]);
      expect(comp.genericQuery).toHaveBeenCalled();
      expect(fs.generateQuery).toHaveBeenCalled();
      expect(comp.changeQuery).toHaveBeenCalled();
    })));

  });

  describe('createElement method', () => {

    it('should create element', () => {
      let id = 2;
      let data = {
        id,
        data: '',
        lastElement: 0,
        hideAutocomplete: true
      };
      let result = comp.createElement(id);
      expect(result).toEqual(data);
    });

  });

  describe('onChange method', () => {

    it('should update query', async(inject([FilterService], (fs: FilterService) => {
      comp.config = config;
      spyOn(fs, 'generateQuery');
      spyOn(comp, 'genericQuery');
      spyOn(comp, 'changeQuery');
      comp.addElement();
      comp.onChange();
      expect(comp.genericQuery).toHaveBeenCalled();
      expect(fs.generateQuery).toHaveBeenCalled();
      expect(comp.changeQuery).toHaveBeenCalled();
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

  describe('parseQuery method', () => {

    it('should parse query', async() => {
      let query = 'company=123&company=124';
      comp.config = config;
      comp.count = 1;
      let result = [
        {
          id: 1,
          data: '123',
          lastElement: 0,
          hideAutocomplete: true
        },
        {
          id: 2,
          data: '124',
          lastElement: 0,
          hideAutocomplete: true
        }
      ];
      comp.parseQuery(query);
      expect(comp.elements.length).toEqual(2);
      expect(comp.elements).toEqual(result);
    });

  });

  describe('updateFilter method', () => {
    it('should reset filter from empty query',
      async(inject([FilterService], (fs: FilterService) => {
        let elements = [
          {
            id: 1,
            data: '123'
          },
          {
            id: 2,
            data: '124'
          }
        ];
        comp.elements = elements;
        comp.config = config;
        spyOn(fs, 'getQueries').and.returnValue(false);
        comp.updateFilter();
        expect(comp.query).toEqual('');
        expect(comp.elements.length).toEqual(1);
        expect(comp.elements[0].data).toEqual('');
    })));

    it('should update filter by query', async(inject([FilterService], (fs: FilterService) => {
      comp.elements = [
        {
          id: 1,
          data: '125'
        }
      ];
      spyOn(fs, 'getQueries').and.returnValue({
        byQuery: true,
        query: 'company=123'
      });
      comp.config = config;
      spyOn(comp, 'parseQuery');
      comp.updateFilter();
      expect(comp.elements).toEqual([]);
      expect(comp.parseQuery).toHaveBeenCalledWith('company=123');
    })));

    it('should update filter by data', async(inject([FilterService], (fs: FilterService) => {
      let data = [
        {
          id: 1,
          data: '124'
        },
        {
          id: 2,
          data: '125'
        }
      ];
      comp.config = config;
      spyOn(fs, 'getQueries').and.returnValue(data);
      spyOn(comp, 'genericQuery');
      comp.updateFilter();
      expect(comp.count).toEqual(2);
      expect(comp.elements).toEqual(data);
      expect(comp.genericQuery).toHaveBeenCalledWith(comp.elements, config.query);
    })));
  });

  describe('resetFilter method', () => {

    it('should reset query', async(inject([FilterService], (fs: FilterService) => {
      comp.elements = [
        {
          id: 1,
          data: '123'
        },
        {
          id: 2,
          data: '124'
        }
      ];
      comp.config = config;
      spyOn(fs, 'generateQuery');
      spyOn(comp, 'deleteValue');
      spyOn(comp, 'changeQuery');
      comp.resetFilter();
      expect(comp.elements.length).toEqual(1);
      expect(comp.deleteValue).toHaveBeenCalled();
      expect(comp.changeQuery).toHaveBeenCalled();
      expect(fs.generateQuery).toHaveBeenCalled();
    })));

  });

});
