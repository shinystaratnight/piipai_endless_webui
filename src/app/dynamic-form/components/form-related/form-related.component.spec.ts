import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { FormRelatedComponent } from './form-related.component';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormRelatedComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule, FormsModule],
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
      spyOn(comp, 'addControl');
      comp.ngOnInit();
      expect(comp.display).toEqual('__str__');
      expect(comp.param).toEqual('id');
      expect(comp.results).toEqual([]);
      expect(comp.addControl).toHaveBeenCalledWith(comp.config, fb);
    })));

    it('should update value if it a object', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
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
    })));

    it('should update value if it a string', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      let value = '2';
      spyOn(comp, 'addControl');
      comp.group = fb.group({});
      comp.group.addControl(config.key, fb.control(''));
      comp.config.value = value;
      comp.key = config.key;
      comp.ngOnInit();
      expect(comp.group.get(comp.key).value).toEqual(value);
    })));

    it('should update value if many property equal true',
      async(inject([FormBuilder], (fb: FormBuilder) => {
      let value = [
        {
          name: 'First',
          number: 1
        },
        {
          name: 'Second',
          number: 2
        },
      ];
      let display = 'name';
      let param = 'number';
      config.templateOptions.display = display;
      config.templateOptions.param = param;
      config.many = true;
      config.value = value;
      comp.config = config;
      spyOn(comp, 'addControl');
      spyOn(comp, 'updateData');
      comp.ngOnInit();
      expect(comp.display).toEqual(display);
      expect(comp.param).toEqual(param);
      expect(comp.results).toEqual(value);
      expect(comp.updateData).toHaveBeenCalledWith();
      expect(comp.addControl).toHaveBeenCalledWith(comp.config, fb);
    })));

  });

  describe('ngAfterViewInit method', () => {

    it('should called addFlags method', async(() => {
      comp.config = config;
      comp.related = {};
      spyOn(comp, 'addFlags');
      comp.ngAfterViewInit();
      expect(comp.addFlags).toHaveBeenCalledWith(comp.related, comp.config);
    }));

  });

  describe('generateList method', () => {

    it('should generate list property from data', async(() => {
      comp.config = config;
      comp.results = [];
      comp.display = 'name';
      comp.related = {};
      comp.config.options = [
        { name: 'Lilu'},
        { name: 'Bob' }
      ];
      spyOn(comp.config.options, 'filter').and.returnValue(comp.config.options);
      spyOn(comp.config.options, 'sort').and.returnValue([
        { name: 'Bob' },
        { name: 'Lilu'}
      ]);
      comp.generateList();
      expect(comp.list).toEqual([
        { name: 'Bob' },
        { name: 'Lilu'}
      ]);
    }));

  });

  describe('resetList method', () => {

    it('should reset list property', async(() => {
      comp.list = [{name: 'Bob'}];
      comp.resetList();
      setTimeout(() => {
        expect(comp.list).toBeNull();
      }, 200);
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
      comp.display = 'name';
      comp.results = [];
      comp.filter(value);
      expect(comp.list).toEqual([
        { name: 'Sam' },
        { name: 'Tom' }
      ]);
    }));

    it('should call generateList method', async(() => {
      let value = '';
      spyOn(comp, 'generateList');
      comp.filter(value);
      expect(comp.generateList).toHaveBeenCalled();
    }));

  });

  describe('eventHandler method', () => {

    it('should be emit event', async(inject([FormBuilder], (fb) => {
      let form = fb.group({});
      let key = 'title';
      let metadata = {
        key: 'title',
        options: [{
          id: 123,
          name: 'Australia'
        }, {
          id: 132,
          name: 'United State of America'
        }]
      };
      let event = { type: 'change' };
      form.addControl(key, fb.control(''));
      form.get(key).patchValue(123);
      comp.group = form;
      comp.config = metadata;
      comp.key = key;
      spyOn(comp.event, 'emit');
      comp.eventHandler(event);
      expect(comp.event.emit).toHaveBeenCalled();
    })));

  });

});
