import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormTextareaComponent } from './form-textarea.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

describe('FormTextareaComponent', () => {
  let fixture: ComponentFixture<FormTextareaComponent>;
  let comp: FormTextareaComponent;
  let el;
  let config = {
    type: 'textarea',
    key: 'note',
    read_only: false,
    templateOptions: {
      placeholder: 'Placeholder',
      max: 200,
      min: 2,
      cols: 3,
      rows: 5,
      label: 'Note',
      required: true,
      description: 'Note text',
    }
  };
  let errors = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormTextareaComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormTextareaComponent);
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
});
