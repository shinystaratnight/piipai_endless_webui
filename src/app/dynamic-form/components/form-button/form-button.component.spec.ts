import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { FormButtonComponent } from './form-button.component';

describe('FormInputComponent', () => {
  let fixture: ComponentFixture<FormButtonComponent>;
  let comp: FormButtonComponent;
  let el;
  let config = {
    type: 'button',
    templateOptions: {
      label: 'ENTER',
      type: 'submit'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormButtonComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormButtonComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', () => {
    comp.config = config;
    fixture.detectChanges();
    expect(comp.config).toBeDefined();
  });

  describe('action method', () => {

    it('should be emit event', async(inject([FormBuilder], (fb) => {
      let form = fb.group({});
      let key = 'email';
      let metadata = {
        key: 'button',
        templateOptions: {
          action: 'add_company'
        }
      };
      let event = { type: 'click' };
      form.addControl(key, fb.control(''));
      form.get(key).patchValue('test@test.com');
      comp.group = form;
      comp.config = metadata;
      spyOn(comp.buttonAction, 'emit');
      comp.action(event);
      expect(comp.buttonAction.emit).toHaveBeenCalled();
    })));

  });
});
