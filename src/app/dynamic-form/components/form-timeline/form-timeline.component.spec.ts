import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormTimelineComponent } from './form-timeline.component';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('FormCheckboxComponent', () => {
  let fixture: ComponentFixture<FormTimelineComponent>;
  let comp: FormTimelineComponent;
  let el;
  let config = {
    type: 'timeline'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormTimelineComponent
      ],
      providers: [],
      imports: [FormsModule, NgbModule.forRoot()],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormTimelineComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should enter the assertion', () => {
    comp.config = config;
    fixture.detectChanges();
    expect(comp.config).toBeDefined();
  });

  describe('ngOnInit method', () => {
    it('should initialize properties', () => {
      comp.ngOnInit();
      expect(comp.modalData).toEqual({});
      expect(comp.objectEndpoint).toEqual('/ecore/api/v2/endless-core/workflowobjects/');
    });
  });

  describe('open method', () => {
    it('should open modal window for allowed states', () => {
      let state = {
        id: 123,
        name_before_activation: 'Cancel/Fail',
        name_after_activation: 'Sales Failed',
        state: 1,
        requirements: []
      };
      comp.modalData = {};
      comp.stateModal = {};
      spyOn(comp.modalService, 'open');
      comp.open(state);
      expect(comp.modalData.title).toEqual(state.name_before_activation);
      expect(comp.modalService.open).toHaveBeenCalledWith(comp.stateModal);
    });

    it('should open modal window for active states if name_after_activation is defined', () => {
      let state = {
        id: 123,
        name_before_activation: 'Cancel/Fail',
        name_after_activation: 'Sales Failed',
        state: 2,
        requirements: []
      };
      comp.modalData = {};
      comp.stateModal = {};
      spyOn(comp.modalService, 'open');
      comp.open(state);
      expect(comp.modalData.title).toEqual(state.name_after_activation);
      expect(comp.modalService.open).toHaveBeenCalledWith(comp.stateModal);
    });

    it('should open modal window for active states', () => {
      let state = {
        id: 123,
        name_before_activation: 'Cancel/Fail',
        name_after_activation: '',
        state: 2,
        requirements: []
      };
      comp.modalData = {};
      comp.stateModal = {};
      spyOn(comp.modalService, 'open');
      comp.open(state);
      expect(comp.modalData.title).toEqual(state.name_before_activation);
      expect(comp.modalService.open).toHaveBeenCalledWith(comp.stateModal);
    });
  });

});
