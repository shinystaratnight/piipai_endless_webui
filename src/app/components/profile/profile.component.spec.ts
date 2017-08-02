import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProfileComponent } from './profile.component';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

describe('ProfileComponent', () => {
  let comp: ProfileComponent;
  let fixture;

  let endpoint = '/ecore/api/v2/endless-candidate/candidatecontacts/';
  let contactEndpoint = '/ecore/api/v2/endless-core/contacts/';

  let response: any;
  let mockService = {
    getAll() {
      if (response.status === 'success') {
        return Observable.of(response.body);
      } else {
        return Observable.throw(response.error);
      }
    },
    getMetadata() {
      if (response.status === 'success') {
        return Observable.of(response.body);
      } else {
        return Observable.throw(response.error);
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileComponent
      ],
      providers: [
        {provide: GenericFormService, useValue: mockService}
      ],
      imports: [],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ProfileComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  describe('ngOnInit method', () => {

    it('should be defined', () => {
      expect(comp.ngOnInit).toBeDefined();
    });

    it('should call getMetadata method', () => {
      let personalTraits = {
        type: 'list',
        viewData: [],
        isCollapsed: false,
        elementList: [
          'contact.gender',
          'weight',
          'transportation_to_work',
          'strength',
          'language',
          'reliability_score',
          'loyalty_score',
          'total_score'
        ]
      };
      let residency = {
        type: 'list',
        viewData: [],
        isCollapsed: false,
        elementList: [
          'residency',
          'visa_type.__str__',
          'visa_expiry_date',
          'nationality'
        ]
      };
      let contactDetails = {
        type: 'list',
        viewData: [],
        isCollapsed: false,
        elementList: [
          'email',
          'phone_mobile',
          'address.phone_landline',
          'address.phone_fax',
          'address.city',
          'address.postal_code',
          'address.state',
          'address.country'
        ]
      };
      spyOn(comp, 'getMetadata');
      comp.endpoint = endpoint;
      comp.ngOnInit();
      expect(comp.personalTraits).toEqual(personalTraits);
      expect(comp.residency).toEqual(residency);
      expect(comp.contactDetails).toEqual(contactDetails);
      expect(comp.getMetadata).toHaveBeenCalledWith(endpoint);
    });

  });

  describe('getMetadata method', () => {

    it('should be defined', () => {
      expect(comp.getMetadata).toBeDefined();
    });

    it('should call getData method', () => {
      response = {
        status: 'success',
        body: []
      };
      spyOn(comp, 'getData');
      comp.getMetadata(endpoint);
      expect(comp.metadata).toEqual([]);
      expect(comp.getData).toHaveBeenCalled();
    });

    it('should update error property', () => {
      response = {
        status: 'error',
        error: []
      };
      comp.getMetadata(endpoint);
      expect(comp.error).toEqual([]);
    });

  });

  describe('getData method', () => {

    it('should be defined', () => {
      expect(comp.getData).toBeDefined();
    });

    it('should call getContactMetadata method', () => {
      response = {
        status: 'success',
        body: {
          contact: {
            id: '123'
          }
        }
      };
      spyOn(comp, 'getContactMetadata');
      comp.getData();
      expect(comp.data).toEqual(response.body);
      expect(comp.contactId).toEqual('123');
      expect(comp.getContactMetadata).toHaveBeenCalled();
    });

    it('should update error property', () => {
      response = {
        status: 'error',
        error: []
      };
      comp.getData();
      expect(comp.error).toEqual([]);
    });

  });

  describe('getContactMetadata method', () => {

    it('should be defined', () => {
      expect(comp.getContactMetadata).toBeDefined();
    });

    it('should call getContactData method', () => {
      response = {
        status: 'success',
        body: []
      };
      spyOn(comp, 'getContactData');
      comp.getContactMetadata();
      expect(comp.contactMetadata).toEqual([]);
      expect(comp.getContactData).toHaveBeenCalled();
    });

    it('should update error property', () => {
      response = {
        status: 'error',
        error: []
      };
      comp.getContactMetadata();
      expect(comp.error).toEqual([]);
    });

  });

  describe('getContactData method', () => {

    it('should be defined', () => {
      expect(comp.getContactData).toBeDefined();
    });

    it('should call generateView method', () => {
      response = {
        status: 'success',
        body: {}
      };
      spyOn(comp, 'generateView');
      comp.getContactData();
      expect(comp.contactData).toEqual({});
      expect(comp.generateView).toHaveBeenCalled();
    });

    it('should update error property', () => {
      response = {
        status: 'error',
        error: []
      };
      comp.getContactData();
      expect(comp.error).toEqual([]);
    });

  });

  describe('generateView method', () => {

    it('should be defined', () => {
      expect(comp.generateView).toBeDefined();
    });

    it('should call generate method', () => {
      let components = ['personalTraits', 'residency', 'contactDetails', 'skills'];
      spyOn(comp, 'generate');
      comp.generateView();
      expect(comp.generate).toHaveBeenCalledTimes(3);
      expect(comp.generate).toHaveBeenCalledWith(components[0]);
      expect(comp.generate).toHaveBeenCalledWith(components[1]);
      expect(comp.generate).toHaveBeenCalledWith(components[2]);
    });

  });

  describe('generate method', () => {

    it('should be defined', () => {
      expect(comp.generate).toBeDefined();
    });

    it('should call generateList method', () => {
      comp.contactDetails = {
        type: 'list',
        isCollapsed: false,
        viewData: [],
        elementList: [
          'contact.email',
          'contact.phone_mobile'
        ]
      };
      spyOn(comp, 'generateList');
      comp.generate('contactDetails');
      expect(comp.generateList)
        .toHaveBeenCalledWith(comp.contactDetails.elementList,
          comp.contactDetails.viewData, 'contactDetails');
    });

    it('should call generateTable method', () => {
      comp.contactDetails = {
        type: 'table',
        isCollapsed: false,
        viewData: [],
        elementList: [
          'contact.email',
          'contact.phone_mobile'
        ]
      };
      spyOn(comp, 'generateTable');
      comp.generate('contactDetails');
      expect(comp.generateTable)
        .toHaveBeenCalledWith(comp.contactDetails.elementList,
           comp.contactDetails.viewData, 'contactDetails');
    });

  });

  describe('generateList method', () => {

    it('should be defined', () => {
      expect(comp.generateList).toBeDefined();
    });

    it('should generate data for lists', () => {
      comp.metadata = [
        {
          key: 'name',
          templateOptions: {
            label: 'Name'
          }
        },
        {
          key: 'title',
          type: 'select',
          templateOptions: {
            options: [{
              label: 'Mr.',
              value: 'Mr.'
            }]
          }
        }
      ];
      comp.data = {
        name: null,
        title: 'Mr.'
      };
      let elements = ['name', 'title'];
      let data = [];
      comp.generateList(elements, data, 'personalTraits');
      expect(data).toEqual([
        ['Name', ''],
        ['', 'Mr.']
      ]);
    });

    it('should generate data for contactDetails lists', () => {
      comp.contactMetadata = [
        {
          key: 'email',
          templateOptions: {
            label: 'Email'
          }
        },
        {
          key: 'phone_mobile',
          templateOptions: {
            label: 'Mobile Phone'
          }
        }
      ];
      comp.contactData = {
        email: 'tom@hotmail.com',
        phone_mobile: '+380998889977'
      };
      let elements = ['email', 'phone_mobile'];
      let data = [];
      comp.generateList(elements, data, 'contactDetails');
      expect(data).toEqual([
        ['Email', 'tom@hotmail.com', 'mailto:'],
        ['Mobile Phone', '+380998889977', 'tel:']
      ]);
    });

  });

  describe('getItemFromMetadata method', () => {

    it('should be defined', () => {
      expect(comp.getItemFromMetadata).toBeDefined();
    });

    it('should return item from metadata', () => {
      let metadata = [
        {
          key: 'address',
          children: [
            {
              key: 'state'
            }
          ]
        }
      ];
      let result = comp.getItemFromMetadata(metadata, 'state');
      expect(result).toEqual(metadata[0].children[0]);
    });

  });

  describe('getValueOfData method', () => {

    it('should be defined', () => {
      expect(comp.getValueOfData).toBeDefined();
    });

    it('should return value of element', () => {
      let data = {
        address: {
          state: {
            name: 'NSW'
          }
        },
        title: 'Mr.'
      };
      let options = [
        {
          label: 'Mr.',
          value: 'Mr.'
        }
      ];
      let title = comp.getValueOfData(data, 'title', options);
      let state = comp.getValueOfData(data, 'address.state');
      expect(title).toEqual('Mr.');
      expect(state).toEqual('NSW');
    });
  });

  describe('isEmail method', () => {

    it('should be defined', () => {
      expect(comp.isEmail).toBeDefined();
    });

    it('should return true', () => {
      let email = 'tom@hotmail.com';
      expect(comp.isEmail(email)).toBeTruthy();
    });

    it('should return false', () => {
      let email = 'tomhotmail.com';
      expect(comp.isEmail(email)).toBeFalsy();
    });

  });

  describe('isPhone method', () => {

    it('should be defined', () => {
      expect(comp.isPhone).toBeDefined();
    });

    it('should return true', () => {
      let phone = '+380998889977';
      expect(comp.isPhone(phone)).toBeTruthy();
    });

    it('should return false', () => {
      let phone = 'text';
      expect(comp.isPhone(phone)).toBeFalsy();
    });

  });

});
