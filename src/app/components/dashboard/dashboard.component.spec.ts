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
    },
    delete() {
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

  describe('removeModule method', () => {
    it('should remove widget from dashboard', () => {
      let widget = {
        id: '123'
      };
      comp.userModelsEndpoint = '/ecore/api/v2/endless-core/userdashboardmodules/';
      spyOn(comp, 'getUserModules');
      comp.removeModule(widget);
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
        expect(comp.widgets).toEqual([]);
        expect(comp.widgetList).toEqual([]);
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

  describe('generateWidgetList method', () => {
    it('should generate widget list', () => {
      comp.userModules = [
        {
          id: '123',
          company_contact: {
            id: '124',
            name: 'Director Mr. Tom Smith'
          },
          dashboard_module: {
            id: '125',
            name: 'Company Contact'
          },
          position: 2,
          ui_config: {},
          __str__: 'Director Mr. Tom Smith: Company Contact'
        }
      ];
      comp.modulesList = [
        {
          id: '125',
          content_type: {
            id: 25,
            name: 'Company Contact'
          },
          module_data: {
            model: 'companycontact',
            name: 'Company Contact',
            app: 'endless_core',
            plural_name: 'Company Contacts'
          },
          is_active: true,
          __str__: 'Company Contact'
        },
      ];
      comp.pages = [
        {
          name: 'Company Contacts',
          url: '/companycontacts/',
          endpoint: '/ecore/api/v2/endless-core/companycontacts/',
          __str__: 'Company Contacts',
          childrens: []
        }
      ];
      comp.widgetList = [];
      comp.widgets = [];
      let mockResult = {
        label: comp.userModules[0].dashboard_module.name,
        link: comp.pages[0].url,
        endpoint: comp.pages[0].endpoint,
        position: comp.userModules[0].position,
        ui_config: comp.userModules[0].ui_config,
        labelOfWidgetGroup: 'ENDLESS CORE',
        id: '123'
      };
      spyOn(comp, 'getInfoAboutWidget').and.returnValue(comp.modulesList[0]);
      spyOn(comp, 'getLinkByEndpoint').and.returnValue(comp.pages[0].url);
      spyOn(comp, 'getListOfGroupsName').and.returnValue([mockResult]);
      spyOn(comp, 'generateGroupsOfWidgets').and.returnValue({
        [mockResult.labelOfWidgetGroup]: {
          label: mockResult.labelOfWidgetGroup,
          list: [mockResult]
        }
      });
      comp.generateWidgetList();
      expect(comp.widgetList).toEqual([
        {
          label: mockResult.labelOfWidgetGroup,
          list: [mockResult]
        }
      ]);
      expect(comp.getInfoAboutWidget).toHaveBeenCalledWith(comp.userModules[0], ['module_data']);
      expect(comp.getLinkByEndpoint).toHaveBeenCalledWith(comp.pages, comp.pages[0].endpoint);
      expect(comp.getListOfGroupsName).toHaveBeenCalledWith(comp.widgets, 'labelOfWidgetGroup');
      expect(comp.generateGroupsOfWidgets).toHaveBeenCalledWith([
        mockResult
      ], comp.widgets);
    });
  });

  describe('generateGroupOfWidgets method', () => {
    it('should group all widgets', () => {
      let groups = ['ENDLESS CORE'];
      let widgets = [
        {
          label: 'Company Contact',
          link: '/companycontact/',
          endpoint: '/ecore/api/v2/endless-core/companycontacts/',
          position: 2,
          ui_config: {},
          labelOfWidgetGroup: 'ENDLESS CORE',
          id: '123'
        }
      ];
      let result = comp.generateGroupsOfWidgets(groups, widgets);
      expect(result).toEqual({
        [widgets[0].labelOfWidgetGroup]: {
          label: widgets[0].labelOfWidgetGroup,
          list: widgets
        }
      });
    });
  });

  describe('getInfoAboutWidget method', () => {
    it('should return info of widget by parameter', () => {
      let widget = {
        dashboard_module: {
          id: '125',
          name: 'Company Contact'
        }
      };
      comp.modulesList = [
        {
          id: '125',
          content_type: {
            id: 25,
            name: 'Company Contact'
          },
          module_data: {
            model: 'companycontact',
            name: 'Company Contact',
            app: 'endless_core',
            plural_name: 'Company Contacts'
          },
          is_active: true,
          __str__: 'Company Contact'
        }
      ];
      let result = comp.getInfoAboutWidget(widget, ['module_data']);
      expect(result).toEqual({
        module_data: comp.modulesList[0].module_data
      });
    });
  });

  describe('getLinkByEndpoint method', () => {
    it('should return link by endpoint', () => {
      let endpoint = '/ecore/api/v2/endless-core/companycontacts/';
      let pagesList: Page[] = [
        {
          name: 'Company Contacts',
          url: '/companycontacts/',
          endpoint: '/ecore/api/v2/endless-core/companycontacts/',
          __str__: 'Company Contacts',
          childrens: []
        }
      ];
      let result = comp.getLinkByEndpoint(pagesList, endpoint);
      expect(result).toEqual(pagesList[0].url);
    });
  });

  describe('getPagesList method', () => {
    it('should call methods for get widgets', () => {
      spyOn(comp, 'getModelsList');
      spyOn(comp, 'getUserModules');
      comp.getPagesList();
      expect(comp.getModelsList).toHaveBeenCalled();
      expect(comp.getUserModules).toHaveBeenCalled();
    });
  });

  describe('getListOfGroupsName method', () => {
    it('should return list of groups name', () => {
      let param = 'labelOfWidgetGroup';
      let widgets = [
        {
          [param]: 'ENDLESS CORE'
        }
      ];
      let result = comp.getListOfGroupsName(widgets, param);
      expect(result).toEqual(['ENDLESS CORE']);
    });
  });

});
