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
    it('should set value', () => {
      comp.config = {
        value: []
      };
      comp.ngOnInit();
      expect(comp.groups).toEqual([]);
    });

    it('should init properties', () => {
      comp.config = {};
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
          field_list: {
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
        field_list: []
      };
      let id = 'some id';
      comp.addField(group, id);
      expect(comp.modalData).toEqual({
        type: 'field',
        title: 'Field',
        container: group.field_list,
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
        id: object.id,
        data: {
          field_list: {
            action: 'add',
            data: {
              hide: true
            }
          },
          form: {
            action: 'add',
            data: {
              hide : true
            }
          }
        }
      });
    });

    it('should edit field', () => {
      let object = {
        id: 'some id',
        __str__: 'some str',
        field_type: 'textfield'
      };
      let container = [];
      let type = 'field';
      comp.fields = {
        textfield: {
          endpoint: '/ecore/api/v2/endless-core/textformfields/',
          label: 'Text field'
        }
      };
      comp.edit(object, container, type);
      expect(comp.modalData).toEqual({
        type,
        edit: true,
        title: object.__str__,
        container,
        endpoint: comp.fields[object.field_type].endpoint,
        id: object.id,
        data: {
          group: {
            action: 'add',
            data: {
              hide: true
            }
          },
        }
      });
    });
  });

  describe('delete method', () => {
    it('should delete group', () => {
      let object = {
        id: '123'
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
        field_type: 'textfield'
      };
      let container = [
        {
          id: '123'
        }
      ];
      let type = 'field';
      comp.fields = {
        textfield: {
          endpoint: '/ecore/api/v2/endless-core/textformfields/',
          label: 'Text field'
        }
      };
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
      comp.formEvent(event, test.closeModal, container, false, 'group');
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
      comp.formEvent(event, test.closeModal, container, true, 'group');
      expect(test.closeModal).toHaveBeenCalled();
      expect(comp.updateObject).toHaveBeenCalled();
    });

    it('should update model field values', () => {
      let event = {
        type: 'blur',
        el: {
          key: 'name'
        },
        value: 'id'
      };
      let test = {
        closeModal() {
          return true;
        }
      };
      comp.choosenType = 'modelfield';
      comp.config = {
        fields: [
          {
            name: 'id',
            help_text: '',
            required: false,
            label: 'Id'
          }
        ]
      };
      comp.modalData = {
        data: {}
      };
      comp.formEvent(event, test.closeModal, [], false, 'field');
      expect(comp.modalData.data).toEqual({
        name: {
          action: 'add',
          data: {
            value: 'id'
          }
        },
        help_text: {
          action: 'add',
          data: {
            value: ''
          }
        },
        required: {
          action: 'add',
          data: {
            value: false
          }
        },
        label: {
          action: 'add',
          data: {
            value: 'Id'
          }
        }
      });
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

  describe('setType method', () => {
    it('should set type of filed', () => {
      let type = 'modelfield';
      comp.config = {
        fields: []
      };
      comp.fields = {
        modelfield: {
          endpoint: '/ecore/api/v2/endless-core/modelformfield/',
          label: 'Model field'
        }
      };
      comp.modalData = {
        data: {}
      };
      comp.setType(type);
      expect(comp.choosenType).toEqual(type);
      expect(comp.modalData).toEqual({
        endpoint: comp.fields[type].endpoint,
        data: {
          name: {
            action: 'add',
            data: {
              autocomplete: comp.config.fields
            }
          }
        }
      });
    });
  });

});
