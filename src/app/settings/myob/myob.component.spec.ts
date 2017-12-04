import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  inject,
  async,
  fakeAsync,
  tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LocalStorageService } from 'ng2-webstorage';

import { MyobComponent } from './myob.component';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { SettingsService } from '../settings.service';
import { meta } from './myob.meta';

describe('MyobComponent', () => {

  let comp: MyobComponent;
  let fixture: ComponentFixture<MyobComponent>;
  let response: any = {
    status: undefined,
    data: {},
    errors: {}
  };

  const mockGenericFormService = {
    submitForm() {
      if (response.status === 'success') {
        return Observable.of(response.data);
      } else {
        return Observable.throw(response.errors);
      }
    },
    getAll() {
      if (response.status === 'success') {
        return Observable.of(response.data);
      } else {
        return Observable.throw(response.errors);
      }
    }
  };

  let mockUrl: any = [{
    path: 'permissions'
  }];

  const code = '123';
  const mockActivatedRoute = {
    url: Observable.of(mockUrl),
    queryParams: Observable.of({code})
  };

  const mockSettingsService = {
    url: new BehaviorSubject(mockUrl)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyobComponent],
      providers: [
        LocalStorageService,
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: GenericFormService, useValue: mockGenericFormService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MyobComponent);
        comp = fixture.componentInstance;
      });
  }));

  describe('ngOnInit method', () => {
    it('should get data for edit form',
      async(inject([LocalStorageService], (storage: LocalStorageService) => {
        const key = '123';
        const secret = '234';
        storage.store('key', '123');
        storage.store('secret', '234');
        spyOn(comp, 'fillingForm');
        spyOn(comp, 'saveInfo');
        comp.ngOnInit();
        expect(comp.config).toBeDefined();
        expect(comp.pageUrl).toBeDefined();
        expect(comp.endpoint).toBeDefined();
        expect(comp.companyFile).toBeDefined();
        expect(comp.fillingForm).toHaveBeenCalledWith(meta, { key, secret });
        expect(comp.saveInfo).toHaveBeenCalledWith(code, key, secret);
    })));

  });

  describe('eventHandler method', () => {
    it('should store api key',
      async(inject([LocalStorageService], (storage: LocalStorageService) => {
        let event = {
          type: 'blur',
          el: {
            key: 'key'
          },
          value: '123'
        };
        comp.eventHandler(event);
        expect(storage.retrieve('key')).toEqual(event.value);
    })));

    it('should store secret key',
      async(inject([LocalStorageService], (storage: LocalStorageService) => {
        const event = {
          type: 'blur',
          el: {
            key: 'secret'
          },
          value: '123'
        };
        comp.eventHandler(event);
        expect(storage.retrieve('secret')).toEqual(event.value);
    })));
  });

  describe('buttonHanler method', () => {
    it('should call action of button', () => {
      const event = {
        type: 'click',
        value: 'connect'
      };
      spyOn(comp, 'connect');
      comp.connected = false;
      comp.buttonHandler(event);
      expect(comp.connect).toHaveBeenCalled();
    });
  });

  describe('saveInfo method', () => {
    it('should save info after redirect', () => {
      response.status = 'success';
      const key = '123';
      const secret = '123';
      comp.pageUrl = 'http://localhost/settings/myob';
      spyOn(comp, 'updateButton');
      spyOn(comp, 'getCompanyFiles');
      comp.saveInfo(code, key, secret);
      expect(comp.connected).toBeTruthy();
      expect(comp.updateButton).toHaveBeenCalled();
    });
  });

  describe('testCompanyFile method', () => {
    it('should test company file with credentials', () => {
      response.status = 'success';
      response.data = {
        is_valid: true
      };
      const file = {
        id: '123',
        username: 'Tom',
        password: 'Smith',
        status: undefined
      };
      comp.testCompanyFile(file);
      expect(file.status).toEqual(response.data.is_valid);
    });

    it('should update errors', () => {
      response.status = 'error';
      response.errors = {};
      const file = {
        id: '123',
        username: 'Tom',
        password: 'Smith',
        status: undefined
      };
      comp.testCompanyFile(file);
      expect(comp.error).toEqual(response.errors);
    });
  });

  describe('getCompanyFiles method', () => {
    it('should update list of company files', () => {
      response.status = 'success';
      response.data = {
        list: []
      };
      comp.companyFile = {};
      comp.getCompanyFiles();
      expect(comp.companyFile).toEqual({
        list: response.data,
        isCollapsed: false
      });
    });

    it('should update errors', () => {
      response.status = 'error';
      response.errors = {};
      comp.getCompanyFiles();
      expect(comp.error).toEqual(response.errors);
    });
  });

  describe('refreshCompanyFiles method', () => {
    it('should refresh list of company files', () => {
      response.status = 'success';
      response.data = {
        list: []
      };
      comp.companyFile = {};
      comp.getCompanyFiles();
      expect(comp.companyFile).toEqual({
        list: response.data,
        isCollapsed: false
      });
    });

    it('should update errors', () => {
      response.status = 'error';
      response.errors = {};
      comp.getCompanyFiles();
      expect(comp.error).toEqual(response.errors);
    });
  });

  describe('updateButton method', () => {
    it('should update button after success response', () => {
      const el = {
        color: undefined,
        templateOptions: {
          text: 'Connect'
        }
      };
      const type = 'success';
      spyOn(comp, 'getElementByKey').and.returnValue(el);
      comp.updateButton(type);
      expect(el.color).toEqual('#5cb85c');
      expect(el.templateOptions.text).toEqual('Success');
    });

    it('should update button after error response', fakeAsync(() => {
      const el = {
        color: undefined,
        templateOptions: {
          text: 'Connect'
        }
      };
      const type = 'error';
      spyOn(comp, 'getElementByKey').and.returnValue(el);
      comp.updateButton(type);
      expect(el.color).toEqual('#d9534f');
      expect(el.templateOptions.text).toEqual('Error');
      tick(4000);
      expect(el.color).toBeUndefined;
      expect(el.templateOptions.text).toEqual('Connect');
    }));
  });

  describe('fillingForm method', () => {
    it('should filling form by data', () => {
      let metadata = [
        {
          type: 'collapse',
          children: [
            {
              type: 'input',
              key: 'key'
            }
          ]
        }
      ];
      let data = {
        key: '123'
      };
      spyOn(comp, 'getValueOfData');
      comp.fillingForm(metadata, data);
      expect(comp.getValueOfData).toHaveBeenCalled();
    });
  });

  describe('getValueOfData method', () => {
    it('should set value of element', () => {
      let data = {
        secret: {
          key: '123'
        }
      };
      let key = 'secret.key';
      let object = {
        value: undefined
      };
      comp.getValueOfData(data, key, object);
      expect(object.value).toEqual('123');
    });
  });

  describe('getElementByKey method', () => {
    it('should return element from metadata', () => {
      const element = comp.getElementByKey(meta, 'connect');
      expect(element).toBeDefined();
    });
  });

});
