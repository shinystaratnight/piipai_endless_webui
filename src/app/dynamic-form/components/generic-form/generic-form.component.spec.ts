import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GenericFormComponent } from './generic-form.component';
import { GenericFormService } from './../../services/generic-form.service';

describe('EnterTheComponentName', () => {
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
        expect(2).toEqual(2);
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
        expect(comp.getMetadata).toHaveBeenCalled();
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
        expect(comp.parseMetadata).toHaveBeenCalled();
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
        comp.getMetadata(endpoint);
        expect(comp.parseMetadata).toHaveBeenCalled();
        expect(comp.getData).toHaveBeenCalled();
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
        let endpoint = 'endpoint';
        spyOn(comp, 'getDataForForm');
        comp.getMetadata(endpoint);
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
        comp.fillingForm(config, data);
        expect(config[0]['value']).toBeTruthy();
        expect(config[1]['children'][0]['value']).toBeFalsy();
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
        let result = Object.assign(data, form);
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
        comp.submitForm(data);
        expect(comp.parseResponse).toHaveBeenCalled();
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

    });

    describe('buttonActionHandler method', () => {

      it('should be defined', async(() => {
        expect(comp.buttonActionHandler).toBeDefined();
      }));

      it('should emit button action', async(() => {
        let event = 'event';
        spyOn(comp.buttonAction, 'emit');
        comp.buttonActionHandler(event);
        expect(comp.buttonAction.emit).toHaveBeenCalled();
      }));

    });

    describe('getRalatedData method', () => {

      it('should be defined', async(() => {
        expect(comp.getRalatedData).toBeDefined();
      }));

      it('should get all elements', async(() => {
        let key = 'address.country';
        let endpoint = '/ecore/api/v2/countries';
        response = {
          results: [{ id: 2, name: 'Australia' }]
        };
        comp.metadata = [];
        spyOn(comp, 'parseMetadata');
        comp.getRalatedData(key, endpoint);
        expect(comp.parseMetadata).toHaveBeenCalled();
      }));

      it('should get elements by query', async(() => {
        let key = 'address.country';
        let endpoint = '/ecore/api/v2/countries';
        let query = '?region=5';
        response = {
          results: [{ id: 2, name: 'Australia' }]
        };
        comp.metadata = [];
        spyOn(comp, 'parseMetadata');
        comp.getRalatedData(key, endpoint);
        expect(comp.parseMetadata).toHaveBeenCalled();
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
        comp.getData(config, 'address.city');
        expect(comp.getRalatedData).toHaveBeenCalled();
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
        expect(comp.getRalatedData).toHaveBeenCalled();
      }));

    });

    describe('parseMetadata method', () => {

      it('should be defined', async(() => {
        expect(comp.parseMetadata).toBeDefined();
      }));

      it('should update metadata', async(() => {
        let fieldCity = 'address.city';
        let fieldCountry = 'address.country';
        let config = [{
          type: 'related',
          key: fieldCountry,
          endpoint: '/ecore/api/v2/countries'
        }, {
          type: 'row',
          children: [{
            type: 'related',
            key: fieldCity,
            endpoint: '/ecore/api/v2/cities'
          }]
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
            update: true
          }
        };
        spyOn(comp, 'getRalatedData');
        comp.parseMetadata(config, params);
        expect(comp.getRalatedData).toHaveBeenCalled();
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
            }]
          }]
        }];
        comp.resetRalatedData(config, fieldCity);
        expect(config[1]['children'][0].options).toBeUndefined();
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
});
