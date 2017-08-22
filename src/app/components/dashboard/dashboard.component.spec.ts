import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  inject,
  async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

import { DashboardComponent, UserModelData } from './dashboard.component';

describe('DashboardComponent', () => {

  let comp: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let response: any;

  const mockGenericFormService = {
    getAll() {
      return Observable.of(response);
    },
    submitForm() {
      return Observable.of(response);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: GenericFormService, useValue: mockGenericFormService }
      ],
      imports: [NgbModule.forRoot()],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should call methods', () => {
      spyOn(comp, 'getModelsList');
      spyOn(comp, 'getUserModules');
      comp.ngOnInit();
      expect(comp.getModelsList).toHaveBeenCalled();
      expect(comp.getUserModules).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should close open modal window', () => {
      comp.modalRef = {
        close() {
          return true;
        }
      };
      spyOn(comp.modalRef, 'close');
      comp.ngOnDestroy();
      expect(comp.modalRef.close).toHaveBeenCalled();
    });
  });

  describe('getModelsList method', () => {
    it('should update modulesList property', () => {
        response = {
          results: []
        };
        comp.modelsListEndpoint = '/ecore/api/v2/endless-core/dashboardmodules/';
        comp.getModelsList();
        expect(comp.modulesList).toEqual([]);
    });
  });

  describe('addModule method', () => {
    it('should add new module into list of user modules', () => {
        response = {
          status: 'success'
        };
        let modal = {
          closeModal() {
            return true;
          }
        };
        let widget: UserModelData = {
          dashboard_module: '123',
          position: 1,
          ui_config: {}
        };
        spyOn(modal, 'closeModal');
        spyOn(comp, 'getUserModules');
        comp.addModule(widget, modal.closeModal);
        expect(modal.closeModal).toHaveBeenCalled();
        expect(comp.getUserModules).toHaveBeenCalled();
        expect(comp.lastPosition).toEqual(1);
    });
  });

  describe('getUserModules', () => {
    it('should update userModules property', () => {
        response = {
          results: []
        };
        comp.userModelsEndpoint = '/ecore/api/v2/endless-core/dashboardmodules/';
        comp.getUserModules();
        expect(comp.userModules).toEqual([]);
    });
  });

});
