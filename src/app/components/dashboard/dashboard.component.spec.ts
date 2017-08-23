import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  inject,
  async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { NavigationService, Page } from '../../services/navigation.service';

import { DashboardComponent, UserModelData } from './dashboard.component';

describe('DashboardComponent', () => {

  let comp: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let response: any;
  let pages: Page[];

  const mockGenericFormService = {
    getAll() {
      return Observable.of(response);
    },
    submitForm() {
      return Observable.of(response);
    }
  };

  const mockNavigationservice = {
    getPages() {
      return Observable.of(pages);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: GenericFormService, useValue: mockGenericFormService },
        { provide: NavigationService, useValue: mockNavigationservice }
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

  describe('ngOnInit method', () => {
    it('should call methods', () => {
      spyOn(comp, 'getPagesList');
      comp.ngOnInit();
      expect(comp.getPagesList).toHaveBeenCalled();
      expect(comp.widgetList).toEqual([]);
      expect(comp.widgets).toEqual([]);
    });
  });

  describe('ngOnDestroy method', () => {
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

  describe('openModal method', () => {
    it('should open modal with widgets', () => {
      spyOn(comp, 'getAvaliableModules').and.returnValue([]);
      comp.openModal();
      expect(comp.getAvaliableModules).toHaveBeenCalled();
      expect(comp.availableModules).toEqual([]);
    });
  });

  describe('getAvaliableModules method', () => {
    it('should return available widgets', () => {
      comp.modulesList = [
        {
          id: 123
        },
        {
          id: 124
        },
        {
          id: 125
        }
      ];
      comp.userModules = [
        {
          dashboard_module: {
            id: 124
          }
        },
        {
          dashboard_module: {
            id:  125
          }
        }
      ];
      let availableModules = comp.getAvaliableModules();
      expect(availableModules).toEqual([comp.modulesList[0]]);
    });
  });

  describe('getModelsList method', () => {
    it('should update modulesList property', () => {
        response = {
          results: []
        };
        comp.modelsListEndpoint = '/ecore/api/v2/endless-core/dashboardmodules/';
        comp.userModules = [{}];
        spyOn(comp, 'generateWidgetList');
        comp.getModelsList();
        expect(comp.modulesList).toEqual([]);
        expect(comp.generateWidgetList).toHaveBeenCalled();
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
        spyOn(comp, 'getLastPosition').and.returnValue(0);
        comp.addModule(widget, modal.closeModal);
        expect(modal.closeModal).toHaveBeenCalled();
        expect(comp.getUserModules).toHaveBeenCalled();
    });
  });

  describe('getUserModules method', () => {
    it('should update userModules property', () => {
        response = {
          results: []
        };
        comp.userModelsEndpoint = '/ecore/api/v2/endless-core/dashboardmodules/';
        comp.modulesList = [{}];
        spyOn(comp, 'generateWidgetList');
        comp.getUserModules();
        expect(comp.userModules).toEqual([]);
        expect(comp.generateWidgetList).toHaveBeenCalled();
    });
  });

  describe('getlastPosition method', () => {
    it('should return last position of widgets', () => {
      comp.widgets = <any> [
        {
          position: 2
        },
        {
          position: 3
        },
        {
          position: 23
        }
      ];
      let position = comp.getLastPosition();
      expect(position).toEqual(23);
    });
  });

});
