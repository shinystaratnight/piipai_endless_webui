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

  describe('addNewRule method', () => {

    it('should add control if first element', async() => {
      comp.config = config;
      comp.id = 0;
      comp.view = [];
      comp.addNewRule();
      expect(comp.id).toEqual(1);
      expect(comp.view.length).toEqual(1);
    });

    it('should add control if rule complete', async() => {
      comp.config = config;
      comp.id = 1;
      comp.view = [
        {
          id: 1,
          operator: 'or',
          type: 'state',
          values: ['10', '20', '30']
        }
      ];
      comp.addNewRule();
      expect(comp.id).toEqual(2);
      expect(comp.view.length).toEqual(2);
    });

  });

});
