import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormSelectComponent } from './form-select.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

describe('FormSelectComponent', () => {
  let fixture: ComponentFixture<FormSelectComponent>;
  let comp: FormSelectComponent;
  let el;
  let config = {
    type: 'select',
    key: 'country',
    read_only: false,
    templateOptions: {
      label: 'Country',
      required: true,
      description: 'country text',
      placeholder: 'Country',
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
        FormSelectComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormSelectComponent);
      comp = fixture.componentInstance;
    });
  }));

  describe('ngOnInit method', () => {

    it('should init defaults properties',
      async(inject([FormBuilder], (fb: FormBuilder) => {
        comp.config = config;
        comp.key = config.key;
        comp.group = fb.group({});
        comp.group.addControl(comp.key, fb.control(''));
        comp.config.hidden = new BehaviorSubject(true);
        spyOn(comp, 'addControl');
        spyOn(comp, 'setInitValue');
        comp.ngOnInit();
        expect(comp.addControl).toHaveBeenCalled();
        expect(comp.setInitValue).toHaveBeenCalled();
        expect(comp.config.hide).toBeTruthy();
        expect(comp.group.get(comp.key).value).toBeUndefined();
        comp.config.hidden = null;
    })));

  });

  describe('setInitValue method', () => {
    it('should set value', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.key = config.key;
      comp.config.value = 'mr';
      comp.group = fb.group({});
      comp.group.addControl(comp.key, fb.control(''));
      comp.setInitValue();
      expect(comp.group.get(comp.key).value).toEqual('mr');
    })));
  });

  describe('ngAfterViewInit method', () => {

    it('should called addControl method', async(() => {
      spyOn(comp, 'addFlags');
      comp.ngAfterViewInit();
      expect(comp.addFlags).toHaveBeenCalled();
    }));

  });

  describe('eventHandler method', () => {

    it('should be emit event', async(inject([FormBuilder], (fb) => {
      let form = fb.group({});
      let key = 'email';
      let metadata = {
        key: 'email',
        value: 'test@test.com'
      };
      let event = { type: 'change' };
      form.addControl(key, fb.control(''));
      comp.group = form;
      comp.config = metadata;
      comp.key = key;
      spyOn(comp.event, 'emit');
      comp.eventHandler(event);
      expect(comp.event.emit).toHaveBeenCalled();
    })));

  });

});
