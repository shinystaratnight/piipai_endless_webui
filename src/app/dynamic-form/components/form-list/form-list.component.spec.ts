import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormListComponent } from './form-list.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

describe('FormListComponent', () => {
  let fixture: ComponentFixture<FormListComponent>;
  let comp: FormListComponent;
  let el;
  let config = {
    type: 'list',
    endpoint: '/ecore/api/v2/core/contacts/',
    query: 'contact={id}',
    collapsed: true,
    templateOptions: {
      label: 'Company',
    }
  };
  let errors = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormListComponent
      ],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormListComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', () => {
    expect(comp).toBeDefined();
  });

  describe('ngOnInit method', () => {
    it('should init properties', () => {
      comp.config = config;
      comp.ngOnInit();
      expect(comp.data).toEqual({
        [config.parent_field]: {
          action: 'add',
          data: { value: config.id }
        }
      });
      expect(comp.isCollapsed).toBeTruthy();
      comp.config.collapsed = false;
      comp.ngOnInit();
      expect(comp.isCollapsed).toBeFalsy();
    });
  });

});
