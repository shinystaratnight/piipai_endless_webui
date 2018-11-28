import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProfileComponent } from './profile.component';
import { GenericFormService } from '../../services';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

describe('ProfileComponent', () => {
  let comp: ProfileComponent;
  let fixture;

  let endpoint = '/candidate/candidatecontacts/';
  let contactEndpoint = '/core/contacts/';

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
      imports: [NgbModule.forRoot()],
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
          'candidate_scores.reliability',
          'candidate_scores.loyalty',
          'candidate_scores.recruitment_score',
          'candidate_scores.client_feedback'
        ]
      };
      let residency = {
        type: 'list',
        viewData: [],
        isCollapsed: false,
        elementList: [
          'residency',
          'visa_type',
          'visa_expiry_date',
          'nationality'
        ]
      };
      let contactDetails = {
        type: 'list',
        viewData: [],
        isCollapsed: false,
        elementList: [
          'contact.email',
          'contact.phone_mobile',
          'contact.address.phone_landline',
          'contact.address.phone_fax',
          'contact.address.city',
          'contact.address.postal_code',
          'contact.address.state',
          'contact.address.country'
        ]
      };
      let skills = {
        type: 'table',
        viewData: [],
        isCollapsed: false,
        elementList: [
          'skill',
          'score',
          'prior_experience'
        ]
      };
      let tags = {
        type: 'table',
        viewData: [],
        isCollapsed: false,
        elementList: [
          'tag',
          'verification_evidence',
          'verified_by'
        ]
      };
      spyOn(comp, 'getMetadata');
      comp.endpoint = endpoint;
      comp.id = '123';
      comp.ngOnInit();
      expect(comp.personalTraits).toEqual(personalTraits);
      expect(comp.residency).toEqual(residency);
      expect(comp.contactDetails).toEqual(contactDetails);
      expect(comp.skills).toEqual(skills);
      expect(comp.tags).toEqual(tags);
      expect(comp.getMetadata).toHaveBeenCalledWith(endpoint + comp.id + '/profile');
    });

  });

  describe('ngOnDestroy method', () => {
    it('should close modal window', () => {
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

    it('should be defined', () => {
      expect(comp.openModal).toBeDefined();
    });

    it('should call prepareData method', () => {
      let title = 'Skill';
      let element = 'skills';
      let id = '123';
      let modalData = {
        title,
        endpoint: '/ecore/',
        id: '123'
      };
      spyOn(comp, 'prepareData').and.returnValue(modalData);
      comp.openModal(title, element, id);
      expect(comp.modalData).toEqual(modalData);
      expect(comp.prepareData).toHaveBeenCalledWith(title, element, id);
    });

  });

  describe('prepareData method', () => {

    it('should be defined', () => {
      expect(comp.prepareData).toBeDefined();
    });

    it('should prepare data for modal', () => {
      let title = 'Skill';
      let element = 'skills';
      let id = '123';
      let modalData = {
        title,
        endpoint: '/ecore/skills',
        id: '123'
      };
      comp.skillsEndpoint = '/ecore/skills';
      comp.endpoint = '/ecore/';
      comp.data = {
        contact: {
          __str__: 'Mr. Tom Smith'
        }
      };
      comp.id = '124';
      let result = comp.prepareData('', '', '');
      expect(result).toEqual({
        title: 'Mr. Tom Smith',
        endpoint: '/ecore/',
        id: '124'
      });
      result = comp.prepareData(title, element, id);
      expect(result).toEqual(modalData);
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
      spyOn(comp, 'generate');
      spyOn(comp, 'getSkillMetadata');
      comp.getData();
      expect(comp.data).toEqual(response.body);
      expect(comp.generate).toHaveBeenCalledTimes(3);
      expect(comp.generate).toHaveBeenCalledWith('personalTraits');
      expect(comp.generate).toHaveBeenCalledWith('residency');
      expect(comp.generate).toHaveBeenCalledWith('contactDetails');
      expect(comp.getSkillMetadata).toHaveBeenCalled();
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

  describe('getSkillMetadata method', () => {

    it('should be defined', () => {
      expect(comp.getSkillMetadata).toBeDefined();
    });

    it('should call getTagMetadata method', () => {
      response = {
        status: 'success',
        body: []
      };
      spyOn(comp, 'getTagMetadata');
      comp.getSkillMetadata();
      expect(comp.skillsMetadata).toEqual([]);
      expect(comp.getTagMetadata).toHaveBeenCalled();
    });

    it('should update error property', () => {
      response = {
        status: 'error',
        error: []
      };
      comp.getSkillMetadata();
      expect(comp.error).toEqual([]);
    });

  });

  describe('getTagMetadata method', () => {

    it('should be defined', () => {
      expect(comp.getTagMetadata).toBeDefined();
    });

    it('should call getTagMetadata method', () => {
      response = {
        status: 'success',
        body: []
      };
      spyOn(comp, 'generateView');
      comp.getTagMetadata();
      expect(comp.tagsMetadata).toEqual([]);
      expect(comp.generateView).toHaveBeenCalled();
    });

    it('should update error property', () => {
      response = {
        status: 'error',
        error: []
      };
      comp.getTagMetadata();
      expect(comp.error).toEqual([]);
    });

  });

  describe('generateView method', () => {

    it('should be defined', () => {
      expect(comp.generateView).toBeDefined();
    });

    it('should call generate method', () => {
      let components = ['skills', 'tags'];
      spyOn(comp, 'generate');
      comp.generateView();
      expect(comp.generate).toHaveBeenCalledTimes(2);
      expect(comp.generate).toHaveBeenCalledWith(components[0]);
      expect(comp.generate).toHaveBeenCalledWith(components[1]);
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
        ['Name', '-'],
        ['', 'Mr.']
      ]);
    });

  });

  describe('generateTable method', () => {

    it('should be defined', () => {
      expect(comp.generateTable).toBeDefined();
    });

    it('should generate data for tables', () => {
      comp.skillsMetadata = [
        {
          key: 'score',
          templateOptions: {
            label: 'Score'
          }
        },
        {
          key: 'prior_experience',
          type: 'select',
          templateOptions: {
            options: [{
              label: 'Inexperienced',
              value: '0'
            }]
          }
        }
      ];
      comp.data = {
        candidate_skills: [{
          score: 3,
          prior_experience: '0'
        }]
      };
      let elements = ['score', 'prior_experience'];
      let data = {
        label: [],
        row: []
      };
      comp.generateTable(elements, data, 'skills');
      expect(data).toEqual({
        label: ['Score', ''],
        row: [
          {
            id: undefined,
            values: [[3], 'Inexperienced']
          }
        ]
      });
    });

    it('should generate data for tags table', () => {
      comp.tagsMetadata = [
        {
          key: 'verification_evidence',
          templateOptions: {
            label: 'Verification Evidence'
          }
        }
      ];
      comp.data = {
        tag_rels: [{
          verification_evidence: 'http://url.com',
        }]
      };
      let elements = ['verification_evidence'];
      let data = {
        label: [],
        row: []
      };
      comp.generateTable(elements, data, 'tags');
      expect(data).toEqual({
        label: ['Verification Evidence'],
        row: [
          {
            id: undefined,
            values: [['http://url.com']]
          }
        ]
      });
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
            __str__: 'NSW'
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

  describe('isLink method', () => {

    it('should be defined', () => {
      expect(comp.isLink).toBeDefined();
    });

    it('should return true', () => {
      let link = 'http://url.com';
      expect(comp.isLink(link)).toBeTruthy();
    });

    it('should return false', () => {
      let link = '123';
      expect(comp.isLink(link)).toBeFalsy();
    });

  });

  describe('refreshProfile method', () => {

    it('should be defined', () => {
      expect(comp.refreshProfile).toBeDefined();
    });

    it('should call generate method', () => {
      let components = ['personalTraits', 'residency', 'contactDetails', 'skills', 'tags'];
      components.forEach((el) => {
        comp[el] = <any> {
          viewData: ['']
        };
      });
      spyOn(comp, 'generate');
      comp.refreshProfile();
      expect(comp.generate).toHaveBeenCalledTimes(5);
      components.forEach((el) => {
        expect(comp[el].viewData).toEqual([]);
      });
      components.forEach((el, i) => {
        expect(comp.generate).toHaveBeenCalledWith(components[i]);
      });
    });

  });

  describe('formEvent method', () => {

    it('should be defined', () => {
      expect(comp.formEvent).toBeDefined();
    });

    it('should call refreshProfile method', () => {
      let event = {
        type: 'sendForm',
        status: 'success'
      };
      let test = {
        closeModal() {
          return true;
        }
      };
      spyOn(comp, 'refreshProfile');
      spyOn(test, 'closeModal');
      comp.formEvent(event, test.closeModal);
      expect(comp.refreshProfile).toHaveBeenCalled();
      expect(test.closeModal).toHaveBeenCalled();
    });

  });

});
