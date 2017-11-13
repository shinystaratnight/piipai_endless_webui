import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormRelatedComponent } from './form-related.component';
import { GenericFormService } from './../../services/generic-form.service';

import { Observable } from 'rxjs/Observable';

describe('FormRelatedComponent', () => {
  let fixture: ComponentFixture<FormRelatedComponent>;
  let comp: FormRelatedComponent;
  let el;
  let config = {
    type: 'select',
    key: 'country',
    read_only: false,
    many: undefined,
    value: undefined,
    metadata: [],
    templateOptions: {
      label: 'Country',
      required: true,
      description: 'country text',
      placeholder: 'Country',
      display: undefined,
      param: undefined,
      options: [{
          key: 'mr',
          value: 'Mr.',
        }, {
          key: 'mrs',
          value: 'Mrs',
        }]
    }
  };
  let errors = {};
  let response;

  const mockGenericFormService = {
    delete() {
      return Observable.of(true);
    },
    getByQuery() {
      return Observable.of(response);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormRelatedComponent
      ],
      providers: [
        FormBuilder,
        { provide: GenericFormService, useValue: mockGenericFormService }
      ],
      imports: [ReactiveFormsModule, FormsModule, NgbModule.forRoot()],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormRelatedComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', async(inject([FormBuilder], (fb: FormBuilder) => {
    comp.config = config;
    comp.group = fb.group({});
    comp.errors = errors;
    fixture.detectChanges();
    expect(comp.errors).toBeDefined();
    expect(comp.config).toBeDefined();
  })));

  describe('ngOnInit method', () => {

    it('should called addControl method', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.config.query = '?country=';
      comp.config.id = 2;
      comp.key = comp.config.key;
      comp.group = fb.group({});
      comp.group.addControl(comp.key, fb.control(''));
      spyOn(comp, 'addControl');
      spyOn(comp, 'generateDataForList');
      comp.ngOnInit();
      expect(comp.display).toEqual('__str__');
      expect(comp.param).toEqual('id');
      expect(comp.results).toEqual([]);
      expect(comp.addControl).toHaveBeenCalledWith(comp.config, fb);
      expect(comp.generateDataForList).toHaveBeenCalledWith(comp.config);
      expect(comp.config.currentQuery).toEqual('?country=2');
    })));

    it('should update value if it a object', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.config.options = [{
        name: 'First',
        number: 1
      }];
      let value = {
        name: 'First',
        number: 1
      };
      comp.group = fb.group({});
      comp.group.addControl(config.key, fb.control(''));
      comp.config.value = value;
      comp.config.many = false;
      comp.key = config.key;
      comp.config.templateOptions.display = 'name';
      comp.config.templateOptions.param = 'number';
      comp.ngOnInit();
      expect(comp.group.get(comp.key).value).toEqual(1);
      expect(comp.displayValue).toEqual('First');
    })));

    it('should update value if it a string', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.config.options = [{
        number: 2,
        name: 'First'
      }];
      let display = 'name';
      let param = 'number';
      config.templateOptions.display = display;
      config.templateOptions.param = param;
      let value = 2;
      spyOn(comp, 'addControl');
      comp.group = fb.group({});
      comp.group.addControl(config.key, fb.control(''));
      comp.config.value = value;
      comp.key = config.key;
      comp.ngOnInit();
      expect(comp.group.get(comp.key).value).toEqual(value);
      expect(comp.displayValue).toEqual('First');
    })));

    it('should update value if many property equal true',
      async(inject([FormBuilder], (fb: FormBuilder) => {
      let value = [1, 2, {number: 3}];
      let options = [
        {
          number: 1,
          name: 'First'
        },
        {
          number: 2,
          name: 'Second'
        },
        {
          number: 3,
          name: 'Third'
        }
      ];
      let display = 'name';
      let param = 'number';
      config.templateOptions.display = display;
      config.templateOptions.param = param;
      config.many = true;
      config.value = value;
      comp.config = config;
      comp.config.options = options;
      spyOn(comp, 'addControl');
      spyOn(comp, 'updateData');
      comp.ngOnInit();
      expect(comp.display).toEqual(display);
      expect(comp.param).toEqual(param);
      expect(comp.results).toEqual([
        {number: 1, name: 'First'},
        {number: 2, name: 'Second'},
        {number: 3, name: 'Third'}
      ]);
      expect(comp.updateData).toHaveBeenCalledWith();
      expect(comp.addControl).toHaveBeenCalledWith(comp.config, fb);
      comp.config.options = null;
      comp.ngOnInit();
      expect(comp.results).toEqual(config.value);
    })));

  });

  describe('ngAfterContentChecked method', () => {
    it('should call checkOverflow method', () => {
      comp.config = config;
      comp.tableWrapper = {};
      spyOn(comp, 'checkOverfow');
      comp.ngAfterContentChecked();
      expect(comp.checkOverfow).toHaveBeenCalled();
    });
  });

  describe('checkOverflow method', () => {
    it('should set overflow auto', () => {
      comp.tableWrapper = {
        nativeElement: {
          style: {
            overflowX: 'visible'
          },
          offsetWidth: 100
        }
      };
      comp.config = config;
      comp.config.metadata = [{}];
      comp.checkOverfow();
      expect(comp.tableWrapper.nativeElement.style.overflowX).toEqual('auto');
    });

    it('should set overflow visible', () => {
      comp.tableWrapper = {
        nativeElement: {
          style: {
            overflowX: 'auto'
          },
          offsetWidth: 200
        }
      };
      comp.config = config;
      comp.config.metadata = [{}];
      comp.checkOverfow();
      expect(comp.tableWrapper.nativeElement.style.overflowX).toEqual('visible');
    });
  });

  describe('generateDataForList method', () => {
    it('should create empty list', () => {
      comp.config = config;
      comp.config.metadata = [];
      comp.config.list = true;
      comp.config.value = undefined;
      spyOn(comp, 'createObject').and.returnValue({});
      comp.generateDataForList(comp.config);
      expect(comp.createObject).toHaveBeenCalled();
      expect(comp.dataOfList).toEqual([{}]);
    });

    it('should create list by value', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.config.metadata = [];
      comp.config.list = true;
      comp.config.value = [
        {
          id: 1
        }
      ];
      comp.key = comp.config.key;
      comp.group = fb.group({});
      comp.group.addControl(comp.config.key, fb.control(''));
      spyOn(comp, 'createObject').and.returnValue({
        id: 1,
        data: {
          value: {
            id: 1
          }
        }
      });
      spyOn(comp, 'fillingForm');
      comp.generateDataForList(comp.config);
      expect(comp.createObject).toHaveBeenCalled();
      expect(comp.fillingForm).toHaveBeenCalled();
      expect(comp.dataOfList).toEqual([
        {
          id: 1,
          data: {
            value: {
              id: 1
            }
          }
        }
      ]);
      expect(comp.group.get(comp.config.key).value).toEqual(comp.config.value);
    })));
  });

  describe('createObject method', () => {
    it('create new object of list', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.config.metadata = [{}];
      let result = comp.createObject();
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.metadata).toEqual([{}]);
    })));
  });

  describe('addObject method', () => {
    it('should add new empty object into list', () => {
      let event = {
        preventDefault() {
          return true;
        },
        stopPropagation() {
          return true;
        }
      };
      comp.config = config;
      comp.dataOfList = [];
      spyOn(comp, 'createObject').and.returnValue({});
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      comp.addObject(event);
      expect(comp.createObject).toHaveBeenCalled();
      expect(comp.dataOfList.length).toEqual(1);
    });
  });

  describe('deleteObject method', () => {
    it('should delete objectfrom list', () => {
      let object = {
        id: 2
      };
      comp.config = config;
      comp.dataOfList = [];
      comp.dataOfList.push(object);
      spyOn(comp, 'updateValue');
      comp.deleteObject(object);
      expect(comp.dataOfList.length).toEqual(0);
      expect(comp.updateValue).toHaveBeenCalled();
    });
  });

  describe('updateValue method', () => {
    it('should update value of element', async(inject([FormBuilder], (fb: FormBuilder) => {
      let event = {};
      comp.config = config;
      comp.key = comp.config.key;
      comp.group = fb.group({});
      comp.group.addControl(comp.config.key, fb.control(''));
      comp.dataOfList = [
        {
          id: 1,
          data: {
            value: {
              first_name: 'Tom',
              last_name: 'Smith'
            }
          }
        }
      ];
      comp.updateValue(event);
      expect(comp.group.get(comp.config.key).value).toEqual([
        {
          first_name: 'Tom',
          last_name: 'Smith',
          id: 1
        }
      ]);
    })));
  });

  describe('fillingForm method', () => {
    it('should filling form by data', async(inject([FormBuilder], (fb: FormBuilder) => {
      let metadata = [
        {
          children: [
            {
              key: 'address.city'
            }
          ]
        }
      ];
      let data = {
        address: {
          city: 'Sydney'
        }
      };
      let group = fb.group({});
      comp.fillingForm(metadata, data, group);
      expect(group.get('address').get('city').value).toEqual('Sydney');
    })));
  });

  describe('getValueOfData method', () => {

    it('should set value by key from Object', async(inject([FormBuilder], (fb: FormBuilder) => {
      let data = {
        address: {
          city: {
            name: 'Sydney',
            id: 123
          }
        }
      };
      let object = <any> {};
      let key = 'address.city';
      let group = fb.group({});
      comp.getValueOfData(data, key, group);
      expect(group.get('address').get('city').value).toEqual({
        name: 'Sydney',
        id: 123
      });
    })));
  });

  describe('onModalScrollDown method', () => {

    it('should called generateList method', async(() => {
      comp.config = config;
      comp.searchValue = 'query';
      spyOn(comp, 'generateList');
      comp.onModalScrollDown();
      expect(comp.generateList).toHaveBeenCalledWith(comp.searchValue, true);
    }));

  });

  describe('deleteElement method', () => {

    it('should emit event for delete related object',
      async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.modalData = {
        endpoint: 'some endpont',
        id: 123
      };
      let test = {
        closeModal() {
          return true;
        }
      };
      let event = {
        type: 'delete',
        endpoint: comp.modalData.endpoint,
        id: comp.modalData.id
      };
      comp.group = fb.group({});
      comp.key = 'key';
      comp.config.value = 'some';
      comp.displayValue = 'some';
      comp.group.addControl(comp.key, fb.control('some value'));
      spyOn(test, 'closeModal');
      spyOn(comp.event, 'emit');
      comp.deleteElement(test.closeModal);
      expect(comp.event.emit).toHaveBeenCalledWith(event);
      expect(test.closeModal).toHaveBeenCalledWith();
      expect(comp.group.get(comp.key).value).toEqual('');
      expect(comp.config.value).toBeUndefined();
      expect(comp.displayValue).toBeNull();
    })));

  });

  describe('open method', () => {

    it('should set data for modal window', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.group = fb.group({});
      comp.key = 'key';
      comp.modalData = {};
      comp.group.addControl(comp.key, fb.control(''));
      let type = 'add';
      let event = {
        preventDefault() {
          return true;
        },
        stopPropagation() {
          return true;
        }
      };
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      comp.open(type, event);
      expect(comp.modalData).toEqual({
        type,
        title: comp.config.templateOptions.label,
        endpoint: comp.config.templateOptions.endpoint
      });
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    })));

    it('should set data for edit object', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.group = fb.group({});
      comp.key = 'key';
      comp.modalData = {};
      comp.group.addControl(comp.key, fb.control(''));
      comp.group.get(comp.key).patchValue(123);
      comp.displayValue = 'Mr. Tom Smith';
      let type = 'edit';
      comp.open(type);
      expect(comp.modalData).toEqual({
        id: 123,
        type,
        title: comp.displayValue,
        endpoint: comp.config.templateOptions.endpoint
      });
    })));

  });

  describe('openAutocomplete method', () => {

    it('should open actocomplete element', fakeAsync(() => {
      comp.config = config;
      comp.search = {
        nativeElement: {
          focus() {
            return true;
          }
        }
      };
      comp.searchValue = 'query';
      spyOn(comp, 'generateList');
      spyOn(comp.search.nativeElement, 'focus');
      comp.openAutocomplete();
      expect(comp.searchValue).toBeNull();
      expect(comp.hideAutocomplete).toBeFalsy();
      expect(comp.generateList).toHaveBeenCalledWith(comp.searchValue);
      tick(100);
      expect(comp.search.nativeElement.focus).toHaveBeenCalled();
    }));

  });

  describe('generateList method', () => {

    it('should generate list property from data', async(() => {
      let value = 'query';
      comp.config = config;
      config['useOptions'] = true;
      comp.results = [];
      comp.display = 'name';
      comp.list = [];
      comp.hideAutocomplete = true;
      comp.config.options = [
        { name: 'Lilu'},
        { name: 'Bob' }
      ];
      spyOn(comp.config.options, 'filter').and.returnValue(comp.config.options);
      spyOn(comp.config.options, 'sort').and.returnValue([
        { name: 'Bob' },
        { name: 'Lilu'}
      ]);
      spyOn(comp, 'generatePreviewList');
      comp.generateList(value);
      expect(comp.list).toEqual([
        { name: 'Bob' },
        { name: 'Lilu'}
      ]);
      expect(comp.generatePreviewList).toHaveBeenCalledWith(comp.list);
      expect(comp.hideAutocomplete).toBeFalsy();
    }));

    it('should call filter method', async(() => {
      let value = 'as';
      comp.config = config;
      comp.results = [];
      comp.searchValue = 'as';
      comp.config.options = [
        { name: 'Lilu'},
        { name: 'Bob' }
      ];
      spyOn(comp, 'filter');
      comp.generateList(value);
      expect(comp.filter).toHaveBeenCalledWith(comp.searchValue);
      config['useOptions'] = undefined;
    }));

    it('should call getOptions method', async(() => {
      let value = 'query';
      comp.lastElement = 0;
      comp.config = config;
      spyOn(comp, 'getOptions');
      comp.generateList(value);
      expect(comp.getOptions).toHaveBeenCalledWith(value, 0, false);
    }));

  });

  describe('generatePreviewList method', () => {

    it('should generate priview list', async(() => {
      comp.lastElement = 0;
      comp.limit = 10;
      comp.list = [];
      spyOn(comp.list, 'slice').and.returnValue([]);
      comp.generatePreviewList(comp.list);
      expect(comp.list.slice).toHaveBeenCalledWith(0, 10);
      expect(comp.previewList).toEqual([]);
    }));

  });

  describe('resetList method', () => {

    it('should reset list property', fakeAsync(() => {
      comp.list = [{name: 'Bob'}];
      comp.previewList = [];
      comp.lastElement = 10;
      comp.hideAutocomplete = false;
      comp.searchValue = 'as';
      comp.config = config;
      comp.config.many = false;
      comp.resetList();
      tick(200);
      expect(comp.previewList).toBeNull();
      expect(comp.hideAutocomplete).toBeTruthy();
      expect(comp.searchValue).toBeNull();
      expect(comp.lastElement).toEqual(0);
      expect(comp.count).toBeNull();
      expect(comp.list).toBeNull();
    }));

  });

  describe('filter method', () => {

    it('should filter list for autocomplete', async(() => {
      let value = 'M';
      comp.config = config;
      comp.config.options = [
        { name: 'Bob' },
        { name: 'Sam' },
        { name: 'John' },
        { name: 'Bill' },
        { name: 'Tom' }
      ];
      comp.config.useOptions = true;
      comp.display = 'name';
      comp.results = [];
      spyOn(comp, 'generatePreviewList');
      comp.filter(value);
      expect(comp.list).toEqual([
        { name: 'Sam' },
        { name: 'Tom' }
      ]);
      expect(comp.count).toBeNull();
      expect(comp.previewList).toBeNull();
      expect(comp.generatePreviewList).toHaveBeenCalledWith(comp.list);
      comp.config.useOptions = undefined;
    }));

    it('should call generateList method', async(() => {
      let value = 'Tom';
      comp.config = config;
      spyOn(comp, 'generateList');
      comp.filter(value);
      expect(comp.generateList).toHaveBeenCalledWith(value);
    }));

  });

  describe('setValue method', () => {

    it('should add value if many values', async(() => {
      let options = [
        { name: 'Bob', id: '123' },
        { name: 'Sam', id: '124' },
        { name: 'John', id: '125' },
        { name: 'Bill', id: '126' },
        { name: 'Tom', id: '127' }
      ];
      let item = options[0];
      comp.config = config;
      comp.config.options = options;
      comp.config.many = true;
      comp.display = 'name';
      comp.param = 'id';
      comp.results = [];
      comp.searchValue = 'some value';
      comp.message = {};
      comp.errors = {};
      this.list = options;
      spyOn(comp, 'changeList');
      spyOn(comp, 'updateData');
      spyOn(comp, 'eventHandler');
      comp.setValue(item);
      expect(comp.results).toEqual([item]);
      expect(comp.changeList).toHaveBeenCalled();
      expect(comp.updateData).toHaveBeenCalled();
      expect(comp.eventHandler).toHaveBeenCalledWith({type: 'change'}, item[comp.param]);
      expect(comp.searchValue).toBeNull();
      expect(comp.list).toBeNull();
      expect(comp.count).toBeNull();
      expect(comp.previewList).toBeNull();
      expect(comp.message).toBeNull();
      expect(comp.errors).toBeNull();
    }));

    it('should add value if single value', async(inject([FormBuilder], (fb: FormBuilder) => {
      let options = [
        { name: 'Bob', id: 123 },
        { name: 'Sam', id: 124 },
        { name: 'John', id: 125 },
        { name: 'Bill', id: 126 },
        { name: 'Tom', id: 127 }
      ];
      let item = options[0];
      comp.config = config;
      comp.config.many = false;
      comp.key = 'manager';
      comp.group = fb.group({});
      comp.group.addControl(comp.key, fb.control(''));
      comp.config.options = options;
      comp.display = 'name';
      comp.param = 'id';
      comp.results = [];
      comp.searchValue = 'some value';
      comp.message = {};
      comp.errors = {};
      this.list = options;
      spyOn(comp, 'changeList');
      spyOn(comp, 'eventHandler');
      comp.setValue(item);
      expect(comp.group.get(comp.key).value).toEqual(123);
      expect(comp.displayValue).toEqual('Bob');
      expect(comp.changeList).toHaveBeenCalled();
      expect(comp.eventHandler).toHaveBeenCalledWith({type: 'change'}, item[comp.param]);
      expect(comp.searchValue).toBeNull();
      expect(comp.list).toBeNull();
      expect(comp.previewList).toBeNull();
      expect(comp.message).toBeNull();
      expect(comp.errors).toBeNull();
    })));

  });

  describe('deleteItem method', () => {

    it('should delete item from results', async(() => {
      let options = [
        { name: 'Bob' },
        { name: 'Sam' },
        { name: 'John' },
        { name: 'Bill' },
        { name: 'Tom' }
      ];
      let item = 2;
      comp.config = config;
      comp.results = options;
      spyOn(comp, 'changeList');
      spyOn(comp, 'updateData');
      comp.deleteItem(item);
      options.splice(item, 1);
      expect(comp.results).toEqual(options);
      expect(comp.changeList).toHaveBeenCalled();
      expect(comp.updateData).toHaveBeenCalled();
    }));

  });

  describe('eventHandler method', () => {

    it('should be emit event with value', async(inject([FormBuilder], (fb) => {
      let metadata = {
        key: 'title'
      };
      let event = { type: 'change' };
      let value = '123';
      comp.config = metadata;
      spyOn(comp.event, 'emit');
      comp.eventHandler(event, value);
      expect(comp.event.emit).toHaveBeenCalledWith({
        type: 'change',
        el: metadata,
        value
      });
    })));

  });

  describe('changeList method', () => {

    it('should emit event of change', async() => {
      let list = [
        { name: 'Bob' },
        { name: 'Sam' }
      ];
      comp.config = config;
      comp.results = list;
      spyOn(comp.event, 'emit');
      comp.changeList();
      expect(comp.event.emit).toHaveBeenCalledWith({list});
    });

  });

  describe('updateData method', () => {

    it('should update value of form', async(inject([FormBuilder], (fb: FormBuilder) => {
      let list = [
        { name: 'Bob', id: 1 },
        { name: 'Sam', id: 2 }
      ];
      let key = 'name';
      let form = fb.group({});
      form.addControl(key, fb.control(''));
      comp.group = form;
      comp.config = config;
      comp.key = key;
      comp.results = list;
      comp.param = 'id';
      comp.updateData();
      expect(comp.group.get(key).value).toEqual([1, 2]);
    })));

  });

  describe('formEvent method', () => {

    it('should close modal window and update value',
      async(inject([FormBuilder], (fb: FormBuilder) => {
      let test = {
        closeModal() {
          return true;
        }
      };
      let event = {
        type: 'sendForm',
        status: 'success',
        data: {
          id: 123,
          name: 'First'
        }
      };
      let type = 'add';
      let key = 'name';
      let form = fb.group({});
      form.addControl(key, fb.control(''));
      comp.group = form;
      comp.config = config;
      comp.config.currentQuery = 'some query';
      comp.param = 'id';
      comp.display = 'name';
      comp.key = key;
      spyOn(test, 'closeModal');
      spyOn(comp, 'eventHandler');
      comp.formEvent(event, test.closeModal, type);
      expect(test.closeModal).toHaveBeenCalled();
      expect(comp.group.get(comp.key).value).toEqual(123);
      expect(comp.config.value).toEqual(123);
      expect(comp.eventHandler).toHaveBeenCalledWith({type: 'change'}, 123);
    })));

  });

  describe('getOptions method', () => {
    it('should create new previewList', () => {
      let value: '123';
      comp.config = config;
      comp.limit = 10;
      response = {
        count: 25,
        results: [1, 2, 3]
      };
      comp.getOptions(value, 0, false);
      expect(comp.lastElement).toEqual(10);
      expect(comp.count).toEqual(25);
      expect(comp.previewList).toEqual([1, 2, 3]);
    });

    it('should add new elements into previewList', () => {
      let value: '123';
      comp.config = config;
      comp.limit = 10;
      comp.lastElement = 10;
      comp.previewList = [1, 2, 3];
      response = {
        count: 25,
        results: [4, 5, 6]
      };
      comp.getOptions(value, 10, true);
      expect(comp.lastElement).toEqual(20);
      expect(comp.count).toEqual(25);
      expect(comp.previewList).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

});
