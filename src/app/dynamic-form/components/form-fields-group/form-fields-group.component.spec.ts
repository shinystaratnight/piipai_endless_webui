import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  inject,
  async } from '@angular/core/testing';

import { FormFieldsGroupComponent } from './form-fields-group.component';
import { GenericFormService } from './../../services/generic-form.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs/Observable';

describe('FormFieldsGroupComponent', () => {

  let comp: FormFieldsGroupComponent;
  let fixture: ComponentFixture<FormFieldsGroupComponent>;
  let response: any = 123;

  let mockGenericFormService = {
    delete() {
      return Observable.of(response);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFieldsGroupComponent ],
      providers: [
        { provide: GenericFormService, useValue: mockGenericFormService }
      ],
      imports: [ NgbModule.forRoot() ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FormFieldsGroupComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });

  describe('ngOnInit method', () => {
    it('should init properties', () => {
      comp.ngOnInit();
      expect(comp.groups).toEqual([]);
    });
  });

  describe('addGroup method', () => {
    it('should open modal window for add group', () => {
      comp.groups = [];
      comp.config = {
        id: 'formId'
      };
      comp.formFieldGroupsEndpoint = 'some endpoint';
      comp.addGroup();
      expect(comp.modalData).toEqual({
        type: 'group',
        title: 'Group',
        container: comp.groups,
        endpoint: comp.formFieldGroupsEndpoint,
        data: {
          fields: {
            action: 'add',
            data: {
              value: [],
              hide: true
            }
          },
          form: {
            action: 'add',
            data: {
              value: comp.config.id,
              hide : true,
              default: 0
            }
          }
        }
      });
    });
  });

  describe('addField method', () => {
    it('should add modal window for add field', () => {
      let group = {
        fields: []
      };
      let id = 'some id';
      comp.formFieldsEndpoint = 'some endpoint';
      comp.addField(group, id);
      expect(comp.modalData).toEqual({
        type: 'field',
        title: 'Field',
        container: group.fields,
        endpoint: comp.formFieldsEndpoint,
        data: {
          group: {
            action: 'add',
            data: {
              value: id,
              hide: true
            }
          }
        }
      });
    });
  });

  describe('edit method', () => {
    it('should edit group', () => {
      let object = {
        id: 'some id',
        __str__: 'some str'
      };
      let container = [];
      let type = 'group';
      comp.formFieldGroupsEndpoint = 'endpoint';
      comp.edit(object, container, type);
      expect(comp.modalData).toEqual({
        type,
        edit: true,
        title: object.__str__,
        container,
        endpoint: comp.formFieldGroupsEndpoint,
        id: object.id
      });
    });

    it('should edit field', () => {
      let object = {
        id: 'some id',
        __str__: 'some str'
      };
      let container = [];
      let type = 'field';
      comp.formFieldsEndpoint = 'endpoint';
      comp.edit(object, container, type);
      expect(comp.modalData).toEqual({
        type,
        edit: true,
        title: object.__str__,
        container,
        endpoint: comp.formFieldsEndpoint,
        id: object.id
      });
    });
  });

  describe('delete method', () => {
    it('should delete group', () => {
      let object = {
        id: '123',
      };
      let container = [
        {
          id: '123'
        }
      ];
      let type = 'group';
      comp.formFieldGroupsEndpoint = 'endpoint';
      comp.delete(object, container, type);
      expect(container).toEqual([]);
    });

    it('should delete field', () => {
      let object = {
        id: '123',
      };
      let container = [
        {
          id: '123'
        }
      ];
      let type = 'field';
      comp.formFieldsEndpoint = 'endpoint';
      comp.delete(object, container, type);
      expect(container).toEqual([]);
    });
  });

  describe('formEvent method', () => {
    it('should add new element into container', () => {
      let event = {
        type: 'sendForm',
        status: 'success',
        data: {
          id: '123'
        }
      };
      let test = {
        closeModal() {
          return true;
        }
      };
      let container = [];
      spyOn(test, 'closeModal');
      comp.formEvent(event, test.closeModal, container, false);
      expect(test.closeModal).toHaveBeenCalled();
      expect(container).toEqual([event.data]);
    });

    it('should update exist element', () => {
      let event = {
        type: 'sendForm',
        status: 'success',
        data: {
          id: '123',
          name: 'first_name'
        }
      };
      let test = {
        closeModal() {
          return true;
        }
      };
      let container = [
        {
          id: '123',
          name: 'last_name'
        }
      ];
      spyOn(comp, 'updateObject');
      spyOn(test, 'closeModal');
      comp.formEvent(event, test.closeModal, container, true);
      expect(test.closeModal).toHaveBeenCalled();
      expect(comp.updateObject).toHaveBeenCalled();
    });
  });

  describe('updateObject method', () => {
    it('should update data in container', () => {
      let container = [
        {
          id: '123',
          name: 'last_name',
          position: 3
        },
        {
          id: '124',
          name: 'phone_mobile',
          position: 2
        }
      ];
      let object = {
        id: '123',
        name: 'first_name',
      };
      comp.updateObject(container, object);
      expect(container).toEqual([
        {
          id: '124',
          name: 'phone_mobile',
          position: 2
        },
        {
          id: '123',
          name: 'first_name',
          position: 3
        }
      ]);
    });
  });

});
