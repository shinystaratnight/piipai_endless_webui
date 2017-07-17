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
      expect(comp.ruleArray).toEqual([]);
      expect(comp.previewRule).toEqual([]);
      expect(comp.data).toEqual(<any> {});
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

  describe('open method', () => {

    it('should open modal window whith new type', async() => {
      let window = {};
      let type = undefined;
      let rule = {
        id: 1,
        operator: 'or',
        values: []
      };
      comp.config = config;
      comp.id = 0;
      comp.open(window, type, rule);
      expect(comp.addType).toEqual('new');
      expect(comp.editRule).toEqual(rule);
      expect(comp.choice).toEqual('');
      expect(comp.app).toEqual('');
      expect(comp.model).toEqual('');
      expect(comp.config.model).toBeNull();
      expect(comp.config.function).toBeNull();
      expect(comp.modelsArray).toBeNull();
      expect(comp.functionsArray).toBeNull();
    });

    it('should open modal with "state" type', async() => {
      let window = {};
      let type = 'state';
      let rule = {
        id: 2,
        type: 'state',
        operator: 'or',
        values: [10]
      };
      comp.config = config;
      comp.id = 1;
      spyOn(comp, 'prepareRuleArray').and.returnValue(['#1']);
      comp.open(window, type, rule);
      expect(comp.addType).toEqual(type);
      expect(comp.editRule).toEqual(rule);
      expect(comp.choice).toEqual(type);
      expect(comp.app).toEqual('');
      expect(comp.model).toEqual('');
      expect(comp.config.model).toBeNull();
      expect(comp.config.function).toBeNull();
      expect(comp.modelsArray).toBeNull();
      expect(comp.functionsArray).toBeNull();
      expect(comp.prepareRuleArray).toHaveBeenCalledWith(type, rule.id);
      expect(comp.ruleArray).toEqual(['#1']);
    });

    it('should open modal with "function" type for edit', async() => {
      let window = {};
      let type = 'function';
      let rule = {
        id: 2,
        type: 'function',
        operator: 'or',
        values: ['some function']
      };
      comp.config = config;
      comp.id = 1;
      spyOn(comp, 'prepareRuleArray').and.returnValue(['#1']);
      comp.open(window, type, rule, 0);
      expect(comp.addType).toEqual(type);
      expect(comp.editRule).toEqual(rule);
      expect(comp.choice).toEqual(type);
      expect(comp.editIndex).toEqual(0);
      expect(comp.elementValue).toEqual('some function');
      expect(comp.app).toEqual('');
      expect(comp.model).toEqual('');
      expect(comp.config.model).toBeNull();
      expect(comp.config.function).toBeNull();
      expect(comp.modelsArray).toBeNull();
      expect(comp.functionsArray).toBeNull();
      expect(comp.prepareRuleArray).toHaveBeenCalledWith(type, rule.id);
      expect(comp.ruleArray).toEqual(['#1']);
    });

  });

  describe('done method', () => {

    it('should close modal and add new element into a rule', async() => {
      let type = 'state';
      let rule = {
        id: 1,
        type: undefined,
        operator: 'or',
        values: []
      };
      let test = {
        closeWindow() {
          return true;
        }
      };
      comp.config = config;
      comp.editRule = rule;
      comp.view = [rule];
      comp.elementValue = '20';
      spyOn(test, 'closeWindow');
      spyOn(comp, 'reset');
      spyOn(comp, 'generateData');
      comp.done(test.closeWindow, type);
      expect(rule.type).toEqual(type);
      expect(rule.values).toEqual(['20']);
      expect(test.closeWindow).toHaveBeenCalled();
      expect(comp.reset).toHaveBeenCalled();
      expect(comp.generateArray).toHaveBeenCalledWith(comp.view);
    });

    it('should close modal and set new value for edit element', async() => {
      let type = 'rule';
      let rule = {
        id: 2,
        type: 'state',
        operator: 'or',
        values: ['10', '20']
      };
      let test = {
        closeWindow() {
          return true;
        }
      };
      comp.config = config;
      comp.editRule = rule;
      comp.editIndex = 1;
      comp.view = [rule];
      comp.elementValue = '#1';
      spyOn(test, 'closeWindow');
      spyOn(comp, 'reset');
      spyOn(comp, 'generateData');
      comp.done(test.closeWindow, type);
      expect(rule.values).toEqual(['10', '#1']);
      expect(test.closeWindow).toHaveBeenCalled();
      expect(comp.reset).toHaveBeenCalled();
      expect(comp.generateArray).toHaveBeenCalledWith(comp.view);
    });

  });

  describe('delete method', () => {

    it('should close modal window and delete element from a rule', async() => {
      let rule = {
        id: 2,
        type: 'state',
        operator: 'or',
        values: ['10']
      };
      let test = {
        closeWindow() {
          return true;
        }
      };
      comp.config = config;
      comp.editRule = rule;
      comp.editIndex = 0;
      comp.elementValue = '#1';
      spyOn(test, 'closeWindow');
      spyOn(comp, 'reset');
      comp.delete(test.closeWindow);
      expect(rule.values).toEqual([]);
      expect(rule.type).toBeNull();
      expect(test.closeWindow).toHaveBeenCalled();
      expect(comp.reset).toHaveBeenCalled();
    });

  });

  describe('reset method', () => {

    it('should close modal window and delete element from a rule', async() => {
      let rule = {
        id: 2,
        type: 'state',
        operator: 'or',
        values: ['10']
      };
      comp.config = config;
      comp.editRule = rule;
      comp.ruleArray = ['#1'];
      comp.choice = 'state';
      comp.editIndex = 0;
      comp.reset();
      expect(comp.editIndex).toBeNull();
      expect(comp.editRule).toBeNull();
      expect(comp.ruleArray).toEqual([]);
      expect(comp.choice).toEqual('');
    });

  });

  describe('prepareRuleArray method', () => {

    it('should generate array of rules', async() => {
      let view = [
        {
          id: 1,
          type: 'state',
          operator: 'or',
          values: ['10']
        },
        {
          id: 2,
          type: 'state',
          operator: 'and',
          values: ['20']
        }
      ];
      comp.config = config;
      comp.view = view;
      let type = 'state';
      let id = 2;
      let result = comp.prepareRuleArray(type, id);
      expect(result).toEqual([{ id: 1, name: '#1' }]);
    });

  });

  describe('showPreview method', () => {

    it('should generate data for preview', async() => {
      let view = [
        {
          id: 1,
          type: 'state',
          operator: 'or',
          values: ['10', '20']
        },
        {
          id: 2,
          type: 'function',
          operator: 'and',
          values: ['function', 'some function']
        }
      ];
      comp.config = config;
      comp.view = view;
      comp.showPreview();
      expect(comp.previewRule).toEqual([
        {
          label: 'State',
          value: '( "10" or "20" )'
        },
        {
          label: 'Function',
          value: '( "function" and "some function" )'
        }
      ]);
    });

  });

  describe('parseValue method', () => {

    it('should parse view and return data of a rules', async() => {
      let view = [
        {
          id: 1,
          type: 'state',
          operator: 'or',
          values: ['10', '20']
        },
        {
          id: 2,
          type: 'state',
          operator: 'and',
          values: ['30', '#1']
        }
      ];
      comp.config = config;
      comp.view = view;
      let result = comp.parseValue(view[1]);
      expect(result).toEqual(['and', '30', ['or', '10', '20']]);
    });

    it('should parse view and return data of a rules', async() => {
      let view = [
        {
          id: 1,
          type: 'function',
          operator: 'or',
          values: ['some function']
        }
      ];
      comp.config = config;
      comp.view = view;
      let result = comp.parseValue(view[0]);
      expect(result).toEqual(['some function']);
    });

  });

  describe('generateStringOfValues method', () => {

    it('should generate stirng for preview', async() => {
      let rule = ['and', '10', ['or', '20', '30']];
      comp.config = config;
      let result = comp.generateStringOfValues(rule);
      expect(result).toEqual('( "10" and ( "20" or "30" ) )');
    });

    it('should generate stirng for preview without operator', async() => {
      let rule = ['10'];
      comp.config = config;
      let result = comp.generateStringOfValues(rule);
      expect(result).toEqual('( "10" )');
    });

  });

  describe('getRelatedData method', () => {

    it('should emit event for model type', async() => {
      let type = 'model';
      comp.config = config;
      comp.config.model = [];
      comp.config.function = [];
      comp.elementValue = 'some function';
      comp.app = 'endless_core';
      let result = {
        type: 'change',
        el: {
          endpoint: '/ecore/api/v2/models/',
          type: 'rule',
          related: {
            field: 'rules',
            param: 'app',
            query: `?app_name=`,
            prop: type
          }
        },
        value: [{ app: comp.app }]
      };
      spyOn(comp.event, 'emit');
      comp.getRelatedData(type);
      expect(comp.model).toBeNull();
      expect(comp.elementValue).toBeNull();
      expect(comp.config.model).toBeUndefined();
      expect(comp.config.function).toBeUndefined();
      expect(comp.event.emit).toHaveBeenCalledWith(result);
    });

    it('should emit event for function type', async() => {
      let type = 'function';
      comp.config = config;
      comp.config.function = [];
      comp.elementValue = 'some function';
      comp.app = 'endless_core';
      comp.model = 'company';
      let result = {
        type: 'change',
        el: {
          endpoint: '/ecore/api/v2/functions/',
          type: 'rule',
          related: {
            field: 'rules',
            param: 'model',
            query: `?app_name=${comp.app}&model_name=`,
            prop: type
          }
        },
        value: [{ model: comp.model }]
      };
      spyOn(comp.event, 'emit');
      comp.getRelatedData(type);
      expect(comp.elementValue).toBeNull();
      expect(comp.config.function).toBeUndefined();
      expect(comp.event.emit).toHaveBeenCalledWith(result);
    });

  });

  describe('generateData method', () => {

    it('should generate data for backend', async() => {
      let view = [
        {
          id: 1,
          type: 'state',
          operator: 'or',
          values: ['10', '20']
        },
        {
          id: 2,
          type: 'function',
          operator: 'and',
          values: ['function', 'some function']
        }
      ];
      comp.config = config;
      comp.view = view;
      comp.data = {
        active: undefined,
        required_states: undefined,
        required_functions: undefined
      };
      comp.generateData(comp.view);
      expect(comp.data).toEqual({
        active: undefined,
        required_states: ['or', '10', '20'],
        required_functions: ['and', 'function', 'some function']
      });
    });

  });

  describe('changeActiveStates method', () => {

    it('should update active states', async() => {
      let event = {
        list: [
          { number: 10 },
          { number: 20 }
        ]
      };
      comp.data = {
        active: undefined,
        required_states: undefined,
        required_functions: undefined
      };
      comp.changeActiveStates(event);
      expect(comp.data.active).toEqual([10, 20]);
    });

  });

});
