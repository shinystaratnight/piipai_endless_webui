import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GenericFormComponent } from './generic-form.component';
import { GenericFormService } from './../../services/generic-form.service';

describe('GenericFormComponent', () => {
    let fixture: ComponentFixture<GenericFormComponent>;
    let comp: GenericFormComponent;
    let el;
    let metadata = [];
    let metadataError = [];
    let response = null;
    let errors = null;
    let sendData = null;
    let serviceMock = {
      getMetadata() {
        if (response.status === 'error') {
          return Observable.throw(response);
        }
        return Observable.of(metadata);
      },
      submitForm() {
        if (response.status === 'error') {
          return Observable.throw(response);
        }
        return Observable.of(response);
      },
      editForm() {
        if (response.status === 'error') {
          return Observable.throw(response);
        }
        return Observable.of(response);
      },
      delete() {
        if (response.status === 'error') {
          return Observable.throw(response);
        }
        return Observable.of(response);
      },
      getByQuery() {
        return Observable.of(response);
      },
      getAll() {
        return Observable.of(response);
      }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                GenericFormComponent
            ],
            providers: [{provide: GenericFormService, useValue: serviceMock}],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GenericFormComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should enter the assertion', () => {
        fixture.detectChanges();
        expect(comp).toBeDefined();
    });

    describe('ngOnChanges method', () => {

      it('should be defined', async(() => {
        expect(comp.ngOnChanges).toBeDefined();
      }));

      it('should called getMetadata method', async(() => {
        let endpoint = '/ecore/api/v2/contacts';
        let currentEndpoint = '/ecore/api/v2/countries';
        response = {
          status: 'success',
          type: 'input'
        };
        comp.currentEndpoint = currentEndpoint;
        comp.endpoint = endpoint;
        spyOn(comp, 'getMetadata');
        comp.ngOnChanges();
        expect(comp.getMetadata).toHaveBeenCalledWith(comp.endpoint);
        expect(comp.currentEndpoint).toEqual(endpoint);
      }));

      it('should called parseMetadata method', async(() => {
        let endpoint = '/ecore/api/v2/contacts';
        let data = { row: { data: { value: 'value' } } };
        let config = [{key: 'row'}, {key: 'row'}];
        comp.currentEndpoint = endpoint;
        comp.endpoint = endpoint;
        comp.data = data;
        comp.metadata = config;
        spyOn(comp, 'parseMetadata');
        comp.ngOnChanges();
        expect(comp.parseMetadata).toHaveBeenCalledWith(comp.metadata, comp.data);
      }));

    });

    describe('formChange method', () => {

      it('should be defined', async(() => {
        expect(comp.formChange).toBeDefined();
      }));

      it('should updateMetadata', async(() => {
        let data = {
          fisrt_name: 'Tom'
        };
        let config = [{
          key: 'first_name'
        }];
        comp.metadata = config;
        spyOn(comp, 'parseMetadata');
        spyOn(comp, 'parseError');
        comp.formChange(data);
        expect(comp.parseMetadata).toHaveBeenCalledWith(config, {
          fisrt_name: {
            action: 'add',
            data: {
              value: 'Tom'
            }
          }
        });
        expect(comp.parseError).toHaveBeenCalled();
      }));

    });

    describe('getMetadata method', () => {

      it('should be defined', async(() => {
        expect(comp.getMetadata).toBeDefined();
      }));

      it('should update metadata property', async(() => {
        response.status = 'success';
        metadata = [{
          type: 'checkbox',
          key: 'is_available',
          templateOptions: {
            label: 'test',
            type: 'checkbox',
            required: true
          }
        }];
        let endpoint = 'endpoint';
        spyOn(comp, 'parseMetadata');
        spyOn(comp, 'getData');
        spyOn(comp, 'checkRuleElement');
        comp.getMetadata(endpoint);
        expect(comp.parseMetadata).toHaveBeenCalledTimes(2);
        expect(comp.getData).toHaveBeenCalled();
        expect(comp.checkRuleElement).toHaveBeenCalled();
        expect(comp.show).toBeTruthy();
      }));

      it('should update metadataError property', async(() => {
        response = {
          status: 'error'
        };
        let endpoint = 'endpoint';
        comp.getMetadata(endpoint);
        expect(comp.metadataError).toEqual(response);
      }));

      it('should call getDataForForm method', async(() => {
        response.status = 'success';
        metadata = [{
          type: 'checkbox',
          key: 'is_available',
          templateOptions: {
            label: 'test',
            type: 'checkbox',
            required: true
          }
        }];
        comp.id = 'Some id';
        comp.show = true;
        let endpoint = 'endpoint';
        spyOn(comp, 'getDataForForm');
        comp.getMetadata(endpoint);
        expect(comp.show).toBeFalsy();
        expect(comp.getDataForForm).toHaveBeenCalled();
      }));

    });

    describe('getDataForForm method', () => {

      it('should be defined', async(() => {
        expect(comp.getDataForForm).toBeDefined();
      }));

      it('should called fillingForm method', async(() => {
        response = {
          status: 'success',
          message: 'All be fine'
        };
        let endpoint = 'endpoint';
        let id = 'Some id';
        spyOn(comp, 'fillingForm');
        comp.getDataForForm(endpoint, id);
        expect(comp.fillingForm).toHaveBeenCalled();
      }));

    });

    describe('fillingForm method', () => {

      it('should be defined', async(() => {
        expect(comp.fillingForm).toBeDefined();
      }));

      it('should udpate metadata with value', async(() => {
        let config = [
          {
            type: 'checkbox',
            key: 'company.is_available',
            templateOptions: {
              label: 'Checked',
              type: 'checkbox',
              required: true
            }
          },
          {
            type: 'row',
            children: [
              {
                type: 'checkbox',
                key: 'company.checked',
                templateOptions: {
                  label: 'Checked',
                  type: 'checkbox',
                  required: true
                }
              }
            ]
          }
        ];
        let data = {
          company: {
            is_available: true,
            checked: false
          }
        };
        spyOn(comp, 'getDataForRules');
        comp.fillingForm(config, data);
        expect(config[0]['value']).toBeTruthy();
        expect(config[1]['children'][0]['value']).toBeFalsy();
        expect(comp.getDataForRules).toHaveBeenCalledWith(data);
      }));

    });

    describe('getValueOfData method', () => {

      it('should be defined', async(() => {
        expect(comp.getValueOfData).toBeDefined();
      }));

      it('should udpate metadata with value', async(() => {
        let object = {
          type: 'checkbox',
          key: 'is_available',
          templateOptions: {
            label: 'test',
            type: 'checkbox',
            required: true
          }
        };
        let key = 'company.is_available';
        let data = {
          company: {
            is_available: true
          }
        };
        comp.getValueOfData(data, key, object);
        expect(object['value']).toBeTruthy();
      }));

    });

    describe('submitForm method', () => {

      it('should be defined', async(() => {
        expect(comp.submitForm).toBeDefined();
      }));

      it('should update send data', async(() => {
        let field = 'email';
        response = {
          status: 'success',
          message: 'All be fine'
        };
        comp.endpoint = 'endpoint';
        let form = {
          [field]: 'test@test.com'
        };
        let data = {username: 'test'};
        let result = Object.assign({}, data, form);
        comp.form = form;
        spyOn(comp, 'parseResponse');
        comp.submitForm(data);
        expect(comp.parseResponse).toHaveBeenCalled();
        expect(comp.sendData).toEqual(result);
      }));

      it('should called parseResponse method', async(() => {
        response = {
          status: 'success',
          message: 'All be fine'
        };
        comp.endpoint = 'endpoint';
        let data = {username: 'test'};
        spyOn(comp, 'parseResponse');
        spyOn(comp.event, 'emit');
        comp.submitForm(data);
        expect(comp.sendData).toEqual(data);
        expect(comp.parseResponse).toHaveBeenCalled();
        expect(comp.event.emit).toHaveBeenCalledWith({
          type: 'sendForm',
          data: response,
          status: 'success'
        });
      }));

      it('should called parseError method', async(() => {
        response = {
          status: 'error',
          errors: {
            email: 'Is not valid'
          }
        };
        comp.endpoint = 'endpoint';
        let data = {username: 'test'};
        spyOn(comp, 'parseError');
        comp.submitForm(data);
        expect(comp.parseError).toHaveBeenCalled();
      }));

      it('should call parseResponse for edit form', async(() => {
        response = {
          status: 'success',
          message: 'All be fine'
        };
        comp.endpoint = 'endpoint';
        comp.editForm = true;
        let data = {username: 'test'};
        spyOn(comp, 'parseResponse');
        spyOn(comp.event, 'emit');
        comp.submitForm(data);
        expect(comp.parseResponse).toHaveBeenCalledWith(response);
        expect(comp.event.emit).toHaveBeenCalledWith({
          type: 'sendForm',
          data: response,
          status: 'success'
        });
      }));

      it('should call parseError for edit form', async(() => {
        response = {
          status: 'error',
          errors: {
            username: 'It is not valid property'
          }
        };
        comp.endpoint = 'endpoint';
        comp.editForm = true;
        let data = {username: 'test'};
        spyOn(comp, 'parseError');
        comp.submitForm(data);
        expect(comp.parseError).toHaveBeenCalledWith(response.errors);
      }));

    });

    describe('parseError method', () => {

      it('should be defined', async(() => {
        expect(comp.parseError).toBeDefined();
      }));

      it('should emit redirect', async(() => {
        let field = 'email';
        let data = {
          register: field
        };
        comp.sendData = { username: field };
        spyOn(comp.redirect, 'emit');
        comp.parseError(data);
        expect(comp.redirect.emit).toHaveBeenCalled();
      }));

      it('should called resetData, updateErrors methods and emit errorForm', async(() => {
        let field = 'email';
        let message = 'Email is invalid';
        let data = {
          [field]: message
        };
        comp.errors = {};
        comp.response = {};
        spyOn(comp, 'resetData');
        spyOn(comp, 'updateErrors');
        spyOn(comp.errorForm, 'emit');
        comp.parseError(data);
        expect(comp.resetData).toHaveBeenCalled();
        expect(comp.updateErrors).toHaveBeenCalled();
        expect(comp.errorForm.emit).toHaveBeenCalled();
      }));

    });

    describe('parseResponse method', () => {

      it('should be defined', async(() => {
        expect(comp.parseResponse).toBeDefined();
      }));

      it('should parse response', async(() => {
        let field = 'email';
        let message = 'Email is valid';
        let data = {
          [field]: message
        };
        comp.editForm = false;
        spyOn(comp, 'resetData');
        spyOn(comp.responseForm, 'emit');
        comp.parseResponse(data);
        expect(comp.response).toEqual(data);
        expect(comp.resetData).toHaveBeenCalled();
        expect(comp.responseForm.emit).toHaveBeenCalled();
      }));

    });

    describe('eventHandler method', () => {

      it('should be defined', async(() => {
        expect(comp.eventHandler).toBeDefined();
      }));

      it('should update options for related data', async(() => {
        let field = 'country';
        let query = '?country';
        let param = 'id';
        let reset = 'city';
        let event = {
          type: 'update',
          el: {
            type: 'related',
            key: 'country'
          },
          currentQuery: 'some query'
        };
        comp.metadata = [];
        spyOn(comp, 'getData');
        comp.eventHandler(event);
        expect(comp.getData).toHaveBeenCalledWith(comp.metadata, event.el.key, event.currentQuery);
      }));

      it('should handle event', async(() => {
        let field = 'country';
        let query = '?country';
        let param = 'id';
        let reset = 'city';
        let event = {
          type: 'change',
          el: {
            type: 'related',
            related: {
              field,
              query,
              reset
            }
          },
          value: [{
            [param]: 2
          }]
        };
        comp.metadata = [];
        spyOn(comp, 'getData');
        spyOn(comp, 'resetRalatedData');
        spyOn(comp.event, 'emit');
        comp.eventHandler(event);
        expect(comp.getData).toHaveBeenCalled();
        expect(comp.resetRalatedData).toHaveBeenCalled();
        expect(comp.event.emit).toHaveBeenCalled();
      }));

      it('should handle event if type equal "rule"', async(() => {
        let e = {
          type: 'change',
          el: {
            type: 'rule',
            endpoint: 'some endpoint',
            related: {
              field: 'rules',
              query: '?company=',
              param: 'id',
              prop: 'app'
            }
          },
          value: [{id: 2}]
        };
        comp.metadata = [];
        spyOn(comp, 'getRalatedData');
        comp.eventHandler(e);
        expect(comp.getRalatedData).toHaveBeenCalledWith( comp.metadata,
          'rules', 'some endpoint', null, '?company=2', 'app', false);
      }));

      it('should parse response for delete object', async(() => {
        let e = {
          type: 'delete',
          endpoint: 'some endpoint',
          id: 123
        };
        response = {
          status: 'success',
          message: 'Deleted'
        };
        comp.metadata = [];
        spyOn(comp, 'parseResponse');
        comp.eventHandler(e);
        expect(comp.parseResponse).toHaveBeenCalledWith(response);
      }));

      it('should parse error for delete object', async(() => {
        let e = {
          type: 'delete',
          endpoint: 'some endpoint',
          id: 123
        };
        response = {
          status: 'error',
          errors: ['canceled']
        };
        comp.metadata = [];
        spyOn(comp, 'parseError');
        comp.eventHandler(e);
        expect(comp.parseError).toHaveBeenCalledWith(response);
      }));

      it('should update timeline after change', async(() => {
        let e = {
          type: 'update',
          el: {
            key: 'timeline',
            endpoint: 'some endpoint',
          },
          query: 'some query'
        };
        comp.metadata = [];
        spyOn(comp, 'getRalatedData');
        comp.eventHandler(e);
        expect(comp.getRalatedData).toHaveBeenCalledWith(comp.metadata, e.el.key,
          e.el.endpoint, null, e.query, null, true);
      }));

    });

    describe('buttonActionHandler method', () => {

      it('should be defined', async(() => {
        expect(comp.buttonActionHandler).toBeDefined();
      }));

      it('should emit button action', async(() => {
        let event = 'event';
        spyOn(comp.buttonAction, 'emit');
        comp.buttonActionHandler(event);
        expect(comp.buttonAction.emit).toHaveBeenCalledWith(event);
      }));

    });

    describe('getRelatedMetadata method', () => {
      it('should get metadata of related elements', () => {
        metadata = [];
        response.status = 'success';
        let testMetadata = [
          {
            key: 'skill'
          }
        ];
        let key = 'skill';
        let endpoint = 'some endpoint';
        spyOn(comp, 'getData');
        comp.getRelatedMetadata(testMetadata, key, endpoint);
        expect(comp.getData).toHaveBeenCalled();
        expect(testMetadata[0]['metadata']).toEqual(metadata);
      });
    });

    describe('getRalatedData method', () => {

      it('should be defined', async(() => {
        expect(comp.getRalatedData).toBeDefined();
      }));

      it('should get all elements', async(() => {
        let key = 'address.country';
        let endpoint = '/ecore/api/v2/countries';
        let inner = true;
        response = {
          results: [{ id: 2, name: 'Australia' }]
        };
        comp.metadata = [];
        spyOn(comp, 'parseMetadata');
        comp.getRalatedData(comp.metadata, key, endpoint, null, null, null, inner);
        expect(comp.parseMetadata).toHaveBeenCalled();
      }));

      it('should get elements by query', async(() => {
        let key = 'address.country';
        let endpoint = '/ecore/api/v2/countries';
        let query = '?region=5';
        let param = 'app';
        let fields = {};
        response = {
          results: [{ id: 2, name: 'Australia' }]
        };
        comp.metadata = [];
        spyOn(comp, 'parseMetadata');
        spyOn(comp, 'updateMetadata');
        spyOn(comp, 'generateQueryForRelatedFields').and.returnValue(`fields=__str__&fields=id`);
        comp.getRalatedData(comp.metadata, key, endpoint, fields, query, param);
        expect(comp.generateQueryForRelatedFields).toHaveBeenCalledWith({});
        expect(comp.parseMetadata).toHaveBeenCalled();
        expect(comp.updateMetadata).toHaveBeenCalledWith([], key);
      }));

      it('should update metadata for rules type', async(() => {
        let key = 'rules';
        let endpoint = '/ecore/api/v2/workflownodes';
        let query = '?company=123&workflow=124';
        response = {
          results: [
            { number: 10, name_before_activation: 'New' }
          ]
        };
        comp.metadata = [];
        comp.workflowData = {
          company: '123',
          number: '10',
          workflow: '124'
        };
        spyOn(comp, 'updateValueOfRules');
        spyOn(comp, 'updateMetadata');
        spyOn(comp, 'parseMetadata');
        spyOn(comp, 'getElementFromMetadata').and.returnValue({activeMetadata: []});
        comp.getRalatedData(comp.metadata, key, endpoint, null, query);
        expect(comp.updateValueOfRules).toHaveBeenCalledWith(response.results);
        expect(comp.getElementFromMetadata).toHaveBeenCalled();
        expect(comp.updateMetadata).toHaveBeenCalledWith(comp.metadata, key);
        expect(comp.parseMetadata).toHaveBeenCalledWith(comp.metadata, {
          [key]: {
            action: 'add',
            data: { options: response.results, currentQuery: query }
          }
        });
      }));

    });

    describe('generateQueryForRelatedFields method', () => {

      it('should be defined', async(() => {
        expect(comp.generateQueryForRelatedFields).toBeDefined();
      }));

      it('should generate query by default', async(() => {
        let fields = {};
        let query = comp.generateQueryForRelatedFields(fields);
        expect(query).toEqual(`fields=__str__&fields=id`);
      }));

      it('should generate query', async(() => {
        let fields = {
          display: 'name',
          param: 'id',
          code2: 'code2'
        };
        let query = comp.generateQueryForRelatedFields(fields);
        expect(query).toEqual(`fields=code2&fields=name&fields=id`);
      }));
    });

    describe('getData method', () => {

      it('should be defined', async(() => {
        expect(comp.getData).toBeDefined();
      }));

      it('should get all related data', async(() => {
        let config = [{
          type: 'related',
          key: 'address.country',
          endpoint: '/ecore/api/v2/countries'
        }, {
          type: 'row',
          children: [{
            type: 'related',
            key: 'address.city',
            endpoint: '/ecore/api/v2/cities'
          }]
        }];
        spyOn(comp, 'getRalatedData');
        comp.getData(config, 'address.city', '?region=2');
        expect(comp.getRalatedData).toHaveBeenCalledWith(
          config[1]['children'], 'address.city', '/ecore/api/v2/cities', {}, '?region=2&limit=-1');
      }));

      it('should get all related data', async(() => {
        let config = [{
          type: 'related',
          key: 'address.country',
          endpoint: '/ecore/api/v2/countries',
          templateOptions: {
            display: 'name',
            param: 'id'
          }
        }, {
          type: 'row',
          children: [{
            type: 'related',
            key: 'address.city',
            endpoint: '/ecore/api/v2/cities',
            templateOptions: {
              display: 'name',
              param: 'id'
            }
          }]
        }];
        spyOn(comp, 'getRalatedData');
        comp.getData(config);
        expect(comp.getRalatedData).toHaveBeenCalledTimes(2);
      }));

    });

    describe('parseMetadata method', () => {

      it('should be defined', async(() => {
        expect(comp.parseMetadata).toBeDefined();
      }));

      it('should update metadata', async(() => {
        let fieldCity = 'address.city';
        let fieldCountry = 'address.country';
        let fieldBusinnesId = 'company.business_id';
        let config = [{
          type: 'related',
          key: fieldCountry,
          endpoint: '/ecore/api/v2/countries',
          readonly: false,
          related: {
            reset: 'region'
          }
        }, {
          type: 'row',
          children: [{
            type: 'related',
            key: fieldCity,
            endpoint: '/ecore/api/v2/cities'
          }, {
            type: 'business_id',
            key: 'input'
          }]
        }, {
          type: 'hidden'
        }];
        let params = {
          [fieldCity]: {
            action: 'add',
            data: {
              options: [{ key: 1, name: 'Tampa'}]
            }
          },
          [fieldCountry]: {
            query: '?region=',
            id: 3,
            update: true,
            value: 'Australia',
            block: true
          },
          [fieldBusinnesId]: {
            action: 'update',
            block: true,
            value: '7777'
          }
        };
        comp.hide = true;
        spyOn(comp, 'getRalatedData');
        spyOn(comp, 'getElementFromMetadata').and.returnValue(config[0]);
        spyOn(comp, 'resetRalatedData');
        comp.parseMetadata(config, params);
        expect(comp.getRalatedData).toHaveBeenCalled();
        expect(comp.resetRalatedData).toHaveBeenCalled();
        expect(comp.getElementFromMetadata).toHaveBeenCalled();
        expect(config[0]['readonly']).toBeTruthy();
        expect(config[0]['value']).toEqual('Australia');
        expect(config[2]['hide']).toEqual(comp.hide);
      }));

    });

    describe('resetRalatedData method', () => {

      it('should be defined', async(() => {
        expect(comp.resetRalatedData).toBeDefined();
      }));

      it('should reset related data', async(() => {
        let fieldCity = 'address.city';
        let fieldCountry = 'address.country';
        let config = [{
          type: 'related',
          key: fieldCountry,
          endpoint: '/ecore/api/v2/countries',
          options: [{
              key: 1,
              name: 'Tampa'
            }]
        }, {
          type: 'row',
          children: [{
            type: 'related',
            key: fieldCity,
            endpoint: '/ecore/api/v2/cities',
            options: [{
              key: 1,
              name: 'Tampa'
            }],
            value: 'Tampa'
          }]
        }];
        comp.resetRalatedData(config, fieldCity, 'options');
        expect(config[1]['children'][0].options).toBeUndefined();
        expect(config[1]['children'][0].value).toBeUndefined();
      }));

    });

    describe('updateErrors method', () => {

      it('should be defined', async(() => {
        expect(comp.updateErrors).toBeDefined();
      }));

      it('should update errors', async(() => {
        let fieldCity = 'address.city';
        let fieldCountry = 'address.country';
        let err = {};
        let error = {
          [fieldCity]: 'City is invalid',
          [fieldCountry]: 'City is invalid',
        };
        let res = {
          [fieldCity]: 'City is valid',
          [fieldCountry]: 'City is valid',
        };
        comp.updateErrors(err, error, res);
        expect(err).toEqual(error);
        expect(res).toEqual({});
      }));

    });

    describe('resetData method', () => {

      it('should be defined', async(() => {
        expect(comp.resetData).toBeDefined();
      }));

      it('should reset data', async(() => {
        let fieldCity = 'address.city';
        let fieldCountry = 'address.country';
        let data = { fieldCity, fieldCountry };
        comp.resetData(data);
        expect(data[fieldCity]).toBeUndefined();
        expect(data[fieldCountry]).toBeUndefined();
      }));

    });

    describe('checkRuleElement method', () => {

      it('should be defined', async(() => {
        expect(comp.checkRuleElement).toBeDefined();
      }));

      it('should check rule element', async(() => {
        let active = {
          type: 'related',
          key: 'rules',
          read_only: false,
          many: true,
          templateOptions: {
            label: 'Active',
            display: 'name_before_activation',
            param: 'number'
          }
        };
        let config = [{
          type: 'rule',
          key: 'rules',
          activeMetadata: null
        }];
        spyOn(comp, 'getElementFromMetadata').and.returnValue(config[0]);
        spyOn(comp, 'getRalatedData');
        comp.checkRuleElement(config);
        expect(comp.getElementFromMetadata).toHaveBeenCalledWith(config, 'rules');
        expect(comp.getRalatedData).toHaveBeenCalledTimes(2);
        expect(config[0].activeMetadata).toEqual([active]);

      }));

    });

    describe('getElementFromMetadata method', () => {

      it('should be defined', async(() => {
        expect(comp.getElementFromMetadata).toBeDefined();
      }));

      it('should return element from metadata', async(() => {
        let config = [
          {
            type: 'row',
            key: 'country',
            children: [
              {
                type: 'rule',
                key: 'rules',
              }
            ]
          }
        ];
        let result = comp.getElementFromMetadata(config, 'rules');
        expect(result).toEqual(config[0]['children'][0]);
      }));

    });

    describe('updateWorkflowData method', () => {

      it('should be defined', async(() => {
        expect(comp.updateWorkflowData).toBeDefined();
      }));

      it('should update workflow data property', async(() => {
        let event = {
          el: {
            key: 'company'
          },
          value: '123'
        };
        comp.workflowData = {};
        comp.updateWorkflowData(event);
        expect(comp.workflowData.company).toEqual('123');
      }));

      it('should call getDataOfWorkflownode method', async(() => {
        let event = {
          el: {
            key: 'company'
          },
          value: [{
            name: 'Home LTD',
            id: '123'
          }]
        };
        comp.workflowData = {
          workflow: '124',
          number: 10
        };
        spyOn(comp, 'getDataOfWorkflownode');
        comp.updateWorkflowData(event);
        expect(comp.workflowData.company).toEqual('123');
        expect(comp.getDataOfWorkflownode).toHaveBeenCalled();
      }));

    });

    describe('getDataOfWorkflownode method', () => {

      it('should be defined', async(() => {
        expect(comp.getDataOfWorkflownode).toBeDefined();
      }));

      it('should update workflow data property', async(() => {
        comp.workflowData = {
          company: '123',
          number: 10,
          workflow: '124'
        };
        let config = [{
          key: 'rules',
          activeMetadata: [
            {
              key: 'rules'
            }
          ]
        }];
        comp.metadata = config;
        comp.workflowEndpoints = {
          state: '/ecore/api/v2/workflownodes',
          app: ''
        };
        spyOn(comp, 'getElementFromMetadata').and.returnValue(config[0]);
        spyOn(comp, 'getRalatedData');
        comp.getDataOfWorkflownode();
        expect(comp.getElementFromMetadata).toHaveBeenCalledWith(config, 'rules');
        expect(comp.getRalatedData).toHaveBeenCalledWith(
          [config[0], config[0].activeMetadata[0]],
          'rules',
          comp.workflowEndpoints.state,
          null,
          `?company=123&workflow=124`
        );
      }));

    });

    describe('updateMetadata method', () => {

      it('should be defined', async(() => {
        expect(comp.updateMetadata).toBeDefined();
      }));

      it('should update metadata', async(() => {
        let key = 'rules';
        let config = [
          {
            type: 'row',
            children: [
              {
                key: 'rules'
              }
            ]
          }
        ];
        comp.updateMetadata(config, key);
        expect(config).toEqual(config);
      }));

    });

    describe('updateValueOfRules method', () => {

      it('should be defined', async(() => {
        expect(comp.updateValueOfRules).toBeDefined();
      }));

      it('should update value of element', async(() => {
        let res = [{
          number: 20,
          rules: {
            active: [20],
            required_states: [10],
            required_functions: ['some function']
          }
        }];
        let key = 'rules';
        comp.metadata = [
          {
            key: 'rules'
          }
        ];
        comp.workflowData = {
          number: 20
        };
        spyOn(comp, 'getElementFromMetadata').and.returnValue(comp.metadata[0]);
        comp.updateValueOfRules(res);
        expect(comp.metadata[0].value).toEqual(res[0].rules);
      }));

      it('should update value of element with null', async(() => {
        let res = [{
          number: 20,
          rules: null
        }];
        let key = 'rules';
        comp.metadata = [
          {
            key: 'rules'
          }
        ];
        comp.workflowData = {
          number: 10
        };
        spyOn(comp, 'getElementFromMetadata').and.returnValue(comp.metadata[0]);
        comp.updateValueOfRules(res);
        expect(comp.metadata[0].value).toBeNull();
      }));

    });

    describe('getDataForRules method', () => {

      it('should be defined', async(() => {
        expect(comp.getDataForRules).toBeDefined();
      }));

      it('should get rule by company and workflow', async(() => {
        let key = 'rules';
        let data = {
          workflow: {
            name: 'Company',
            id: '123'
          },
          number: 10,
          company: '124'
        };
        comp.metadata = [
          {
            key: 'rules',
            activeMetadata: [
              {
                key: 'rules'
              }
            ]
          }
        ];
        comp.workflowData = {
          number: 20
        };
        comp.workflowEndpoints = {
          state: '/ecore/api/v2/workflownodes',
          app: ''
        };
        spyOn(comp, 'getElementFromMetadata').and.returnValue(comp.metadata[0]);
        spyOn(comp, 'getRalatedData');
        comp.getDataForRules(data);
        expect(comp.workflowData).toEqual(data);
        expect(comp.getElementFromMetadata).toHaveBeenCalledWith(comp.metadata, key);
        expect(comp.getRalatedData).toHaveBeenCalledWith(
          [comp.metadata[0], comp.metadata[0].activeMetadata[0]],
          key,
          comp.workflowEndpoints.state,
          null,
          '?company=124&workflow=123'
        );
      }));

    });
});
