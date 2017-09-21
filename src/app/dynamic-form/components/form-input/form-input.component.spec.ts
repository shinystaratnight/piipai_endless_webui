import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormInputComponent } from './form-input.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

describe('FormInputComponent', () => {
  let fixture: ComponentFixture<FormInputComponent>;
  let comp: FormInputComponent;
  let el;
  let config = {
    type: 'input',
    key: 'test',
    templateOptions: {
      placeholder: 'test',
      max: 2,
      min: 2,
      label: 'test',
      type: 'text',
      required: true,
      description: 'test'
    }
  };
  let errors = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormInputComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormInputComponent);
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

    it('should called addControl method', async(inject([FormBuilder], (fb) => {
      let form = fb.group({});
      let key = 'email';
      let metadata = {
        key: 'email',
        value: 'test@test.com',
        read_only: false
      };
      form.addControl(key, fb.control(''));
      comp.group = form;
      comp.config = metadata;
      comp.key = key;
      spyOn(comp, 'addControl');
      comp.ngOnInit();
      expect(comp.addControl).toHaveBeenCalledWith(comp.config, fb);
      expect(comp.group.get(key).value).toEqual('test@test.com');
    })));

  });

  describe('ngAfterViewInit method', () => {

    it('should called addControl method', async(() => {
      comp.config = config;
      comp.config.readOnly = false;
      spyOn(comp, 'addFlags');
      comp.ngAfterViewInit();
      expect(comp.addFlags).toHaveBeenCalled();
    }));

  });

  describe('eventHandler method', () => {

    it('should be emit event', async(inject([FormBuilder], (fb) => {
      let form = fb.group({});
      let key = 'active';
      let metadata = {
        key: 'active',
      };
      let event = { type: 'change' };
      form.addControl(key, fb.control(''));
      form.get(key).patchValue('test@test.com');
      comp.group = form;
      comp.config = metadata;
      comp.key = key;
      spyOn(comp.event, 'emit');
      comp.eventHandler(event);
      expect(comp.event.emit).toHaveBeenCalled();
    })));

  });

  describe('filter method', () => {

    it('should update filteredList', async(inject([FormBuilder], (fb) => {
      let form = fb.group({});
      let metadata = {
        autocomplete: [{ name: 'anna' }, { name: 'banana' }]
      };
      let key = 'email';
      form.addControl('email', fb.control(''));
      comp.group = form;
      comp.config = metadata;
      spyOn(comp, 'generateList');
      comp.filter(key);
      expect(comp.generateList).toHaveBeenCalled();
    })));

    it('should update filteredList by query', async(inject([FormBuilder], (fb) => {
      let form = fb.group({});
      let metadata = {
        autocomplete: [{ name: 'anna' }, { name: 'banana' }]
      };
      let key = 'email';
      form.addControl('email', fb.control(''));
      comp.group = form;
      comp.config = metadata;
      spyOn(comp, 'generatePreviewList');
      form.get(key).patchValue('an');
      comp.filter(key);
      comp.list = metadata.autocomplete;
      expect(comp.generatePreviewList).toHaveBeenCalledWith(metadata.autocomplete);
    })));

  });

  describe('select method', () => {

    it('should update field', async(inject([FormBuilder], (fb) => {
      let form = fb.group({});
      let key = 'email';
      form.addControl('email', fb.control(''));
      comp.group = form;
      comp.key = key;
      spyOn(comp, 'generateList');
      comp.select('anna');
      expect(comp.generateList).toHaveBeenCalled();
      expect(comp.group.get(key).value).toEqual('anna');
      expect(comp.filteredList).toBeNull();
    })));

  });

  describe('generateList method', () => {

    it('should generate first list for autocomplete', async(() => {
      let key = 'email';
      comp.key = key;
      comp.hideAutocomplete = true;
      let metadata = {
        autocomplete: [{ name: 'banana' }, { name: 'anna' }]
      };
      comp.config = metadata;
      spyOn(comp, 'generatePreviewList');
      let result = metadata.autocomplete.sort((p, n) => p.name > n.name ? 1 : -1);
      comp.generateList();
      expect(comp.hideAutocomplete).toBeFalsy();
      expect(comp.list).toEqual(result);
      expect(comp.generatePreviewList).toHaveBeenCalledWith(result);
    }));

  });

  describe('onModalScrollDown method', () => {

    it('should call generatePreviewList method', async(() => {
      comp.config = config;
      let filteredList = [{name: 'anna'}, {name: 'top'}];
      comp.filteredList = filteredList;
      spyOn(comp, 'generatePreviewList');
      comp.onModalScrollDown();
      expect(comp.generatePreviewList).toHaveBeenCalledWith(filteredList);
    }));

  });

  describe('generatePreviewList method', () => {

    it('should generate list for autocomplete', async(() => {
      comp.config = config;
      comp.limit = 1;
      comp.lastElement = 0;
      let list = [{name: 'anna'}, {name: 'top'}];
      comp.generatePreviewList(list);
      expect(comp.list).toEqual(list.slice(0, 1));
    }));

  });

  describe('handleClick method', () => {

    it('should reset filteredList', async() => {
      comp.filteredList = [{ name: 'anna' }, { name: 'banana' }];
      comp.handleClick({target: {}});
      expect(comp.filteredList).toEqual([]);
    });

  });
});
