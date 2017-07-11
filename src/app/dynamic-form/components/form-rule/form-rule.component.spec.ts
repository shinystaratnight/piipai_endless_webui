import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';

import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormRuleComponent } from './form-rule.component';

describe('FormRuleComponent', () => {
  let fixture: ComponentFixture<FormRuleComponent>;
  let comp: FormRuleComponent;
  let el;
  let config = {
    type: 'rule',
    key: 'rules',
    read_only: false,
    templateOptions: {
      label: 'Rules',
      required: true,
      description: 'help text'
    }
  };
  let errors = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormRuleComponent
      ],
      providers: [ FormBuilder ],
      imports: [ ReactiveFormsModule, NgbModule.forRoot(), FormsModule ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormRuleComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  describe('ngOnInit method', () => {

    it('should add control', async(inject([FormBuilder], (fb: FormBuilder) => {
      comp.config = config;
      comp.group = fb.group({});
      spyOn(comp, 'addControl');
      comp.ngOnInit();
      expect(comp.view).toEqual([]);
      expect(comp.id).toEqual(0);
      expect(comp.addControl).toHaveBeenCalledWith(comp.config, fb);
    })));

  });

  describe('addNewElement method', () => {

    it('should add control', async() => {
      comp.config = config;
      comp.id = 0;
      comp.view = [];
      comp.addNewElement();
      expect(comp.view.length).toEqual(1);
    });

  });

});
