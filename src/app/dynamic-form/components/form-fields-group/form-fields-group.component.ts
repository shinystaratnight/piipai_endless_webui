import { Component, OnInit, ViewChild } from '@angular/core';

import { GenericFormService } from './../../services/generic-form.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface Field {
  help_text: string;
  isCollapsed: boolean;
  label: string;
  model_fields?: Field[];
  name: string;
  required: boolean;
  position?: number;
  id?: number;
  hidden?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-form-fields-group',
  templateUrl: 'form-fields-group.component.html',
  styleUrls: ['./form-fields-group.component.scss']
})
export class FormFieldsGroupComponent implements OnInit {
  @ViewChild('modal')
  public modal: any;

  @ViewChild('modalActiveFields')
  public modalActiveFields: any;

  public formFieldGroupsEndpoint = '/core/formfieldgroups/';
  public formModelFieldEndpoint = '/core/modelformfields/';
  public groups: any[];
  public fields: any;
  public choosenType: string;
  public types: string[];

  public config: any;
  public modalData: any;
  public modalRef: any;

  public groupId: string;
  public error: any;

  public search: string;
  public activeFields: any[];

  public lastPosition = 0;

  public positions = {
    'contact__title': 1,
    'contact__first_name': 2,
    'contact__last_name': 3,
    'contact__email': 4,
    'contact__phone_mobile': 5,
    'contact__gender': 6,
    'contact__birthday': 7,
    'contact__address__street_address': 8,
    'contact__address__city': 9,
    'contact__address__postal_code': 10,
    'contact__address__state': 11,
    'contact__address__country': 12,
    'contact__picture': 13,
    'tax_file_number': 14,
    'bank_account__bank_name': 15,
    'bank_account__bank_account_name': 16,
    'bank_account__bsb': 17,
    'bank_account__account_number': 18,
    'superannuation_fund': 19,
    'superannuation_membership_number': 20,
    'residency': 21,
    'nationality': 22,
    'transportation_to_work': 23,
    'weight': 24,
    'height': 25
  };

  constructor(
    private modalService: NgbModal,
    private genericFormService: GenericFormService
  ) {}

  public ngOnInit() {
    if (this.config.fields && this.config.fields.length) {
      if (this.config.value && this.config.value.length) {
        const value = this.config.value;
        this.groupId = value[0].id;
        this.parseValueFromApi(value[0], this.config.fields);
        this.groups = this.config.fields;
        this.addCollapseProperty(this.groups);
        this.activeFields = value[0].field_list.sort((p, n) => {
          return p.position > n.position ? 1 : -1;
        });
        this.activeFields.forEach((el) => {
          if (el.position > this.lastPosition) {
            this.lastPosition = el.position;
          }
        });
      } else {
        this.groups = this.config.fields;
        this.addCollapseProperty(this.groups);
        this.createGroup();
      }
      this.activeFields = this.getActiveFields(this.groups);
      this.activeFields.sort((p, n) => {
        return p.position > n.position ? 1 : -1;
      });
    }
    this.fields = {
      modelfield: {
        endpoint: '/core/modelformfields/',
        label: 'Model field'
      },
      group: {
        label: 'Custom fields:'
      },
      textareafield: {
        endpoint: '/core/textareaformfields/',
        label: 'TextArea field'
      },
      numberfield: {
        endpoint: '/core/numberformfields/',
        label: 'Number field'
      },
      selectfield: {
        endpoint: '/core/selectformfields/',
        label: 'Select field'
      },
      filefield: {
        endpoint: '/core/fileformfields/',
        label: 'File field'
      },
      imagefield: {
        endpoint: '/core/imageformfields/',
        label: 'Image field'
      },
      checkboxfield: {
        endpoint: '/core/checkboxformfields/',
        label: 'Checkbox field'
      },
      datefield: {
        endpoint: '/core/dateformfields/',
        label: 'Date field'
      },
      radiobuttonsfield: {
        endpoint: '/core/radiobuttonsformfields/',
        label: 'Radio button field'
      },
      textfield: {
        endpoint: '/core/textformfields/',
        label: 'Text field'
      }
    };
    this.types = Object.keys(this.fields);
  }

  public addGroup() {
    this.modalData = {};
    this.choosenType = null;
    this.modalData.type = 'group';
    this.modalData.title = 'Group';
    this.modalData.container = this.groups;
    this.modalData.endpoint = this.formFieldGroupsEndpoint;
    this.modalData.data = {
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
          value: this.config.id,
          hide: true,
          default: 0
        }
      }
    };
    this.modalRef = this.modalService.open(this.modal);
  }

  public createGroup(): void {
    const body = {
      field_list: [],
      form: this.config.id,
      name: this.config.id,
      position: 0
    };
    this.genericFormService
      .submitForm(this.formFieldGroupsEndpoint, body)
      .subscribe(
        (res: any) => {
          this.groupId = res.id;
        },
        (err: any) => (this.error = err)
      );
  }

  public addCollapseProperty(list): void {
    list.forEach((el) => {
      this.lockUserField(el);

      if (el.model_fields) {
        el.isCollapsed = true;
        el.model_fields.forEach((field) => {
          if (field.id) {
            el.isCollapsed = false;
          }
          if (field.model_fields) {
            field.model_fields.forEach((nestedField) => {
              if (nestedField.id) {
                el.isCollapsed = false;
              }
            });
          }
        });
        this.addCollapseProperty(el.model_fields);
      }
    });
  }

  public parseValueFromApi(groups, fields): void {
    fields.forEach((el) => {
      groups.field_list.forEach((field) => {
        if (el.name === field.name) {
          el.id = field.id;
          el.required = field.required;
          el.position = field.position;
        }
      });
      if (el.model_fields) {
        this.parseValueFromApi(groups, el.model_fields);
      }
    });
  }

  public addField(group, id) {
    this.modalData = {};
    this.choosenType = null;
    this.modalData.type = 'field';
    this.modalData.title = 'Field';
    this.modalData.container = group.field_list;
    this.modalData.data = {
      group: {
        action: 'add',
        data: {
          value: id,
          hide: true
        }
      }
    };
    this.modalRef = this.modalService.open(this.modal);
  }

  public toggleActiveState(field: Field, remove?): void {
    const removeField = remove || this.isActive(field);

    if (field.model_fields) {
      this.setActiveForFields(field.model_fields, removeField);

      return;
    }

    if (field.id) {
      this.genericFormService
        .delete(this.formModelFieldEndpoint, field.id)
        .subscribe(
          (res: any) => {
            delete field.id;
            delete field.position;
            this.activeFields = this.getActiveFields(this.groups);
            this.activeFields.sort((p, n) => {
              return p.position > n.position ? 1 : -1;
            });
          },
          (err: any) => (this.error = err)
        );
    } else if (!removeField) {
      const body = Object.assign({ group: this.groupId }, field);
      body.position = this.positions[field.name];
      delete body.hidden;
      delete body.isCollapsed;
      delete body.model_fields;
      delete body.disabled;
      this.genericFormService
        .submitForm(this.formModelFieldEndpoint, body)
        .subscribe(
          (res: any) => {
            field.id = res.id;
            field.position = res.position;
            this.lastPosition = res.position;
            this.activeFields = this.getActiveFields(this.groups);
            this.activeFields.sort((p, n) => {
              return p.position > n.position ? 1 : -1;
            });
          },
          (err: any) => (this.error = err)
        );
    }
  }

  public getActiveFields(array) {
    const results = [];
    array.forEach((el) => {
      if (el.id) {
        results.push(el);
      }
      if (el.model_fields) {
        const activeChildrens = this.getActiveFields(el.model_fields);
        results.push(...activeChildrens);
      }
    });
    return results;
  }

  public toggleRequireProperty(field, remove?): void {
    const removeField = remove || this.isRequired(field);

    if (field.model_fields) {
      this.setRequireForFields(field.model_fields, removeField);

      return;
    }

    if (field.id) {
      const body = Object.assign({ group: this.groupId }, field);
      delete body.hidden;
      delete body.isCollapsed;
      delete body.model_fields;
      if (removeField) {
        body.required = false;
      } else {
        body.required = !field.required;
      }
      this.genericFormService
        .editForm(`${this.formModelFieldEndpoint}${field.id}/`, body)
        .subscribe(
          (res: any) => {
            field.required = res.required;
          },
          (err: any) => (this.error = err)
        );
    } else {
      if (removeField) {
        field.required = false;
      } else {
        field.required = !field.required;
      }
    }
  }

  public edit(object, container, type) {
    this.modalData = {};
    this.choosenType = object.field_type ? object.field_type : null;
    this.modalData.type = type;
    this.modalData.edit = true;
    this.modalData.title = object.__str__;
    this.modalData.container = container;
    this.modalData.endpoint =
      type === 'group'
        ? this.formFieldGroupsEndpoint
        : this.fields[object.field_type].endpoint;
    this.modalData.id = object.id;
    if (type === 'group') {
      this.modalData.data = {
        field_list: {
          action: 'add',
          data: {
            hide: true
          }
        },
        form: {
          action: 'add',
          data: {
            hide: true
          }
        }
      };
    } else if (type === 'field') {
      this.modalData.data = {
        group: {
          action: 'add',
          data: {
            hide: true
          }
        }
      };
    }
    this.modalRef = this.modalService.open(this.modal);
  }

  public delete(object, container: any[], type) {
    const endpoint =
      type === 'group'
        ? this.formFieldGroupsEndpoint
        : this.fields[object.field_type].endpoint;
    const id = object.id;
    this.genericFormService.delete(endpoint, id).subscribe(
      (res: any) => {
        container.forEach((el, i) => {
          if (el.id === id) {
            container.splice(i, 1);
          }
        });
      },
      (err: any) => (this.error = err)
    );
  }

  public formEvent(e, closeModal, container, edit, type) {
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
      if (edit) {
        this.updateObject(container, e.data);
      } else {
        if (type === 'field') {
          const data = {
            polymorphic_ctype: {
              id: this.choosenType
            }
          };
          e.data = Object.assign(data, e.data);
        }
        container.push(e.data);
      }
      container.sort((p, n) => {
        return p.position > n.position ? 1 : -1;
      });
    } else if (
      e.type === 'blur' &&
      this.choosenType === 'modelfield' &&
      e.el.key === 'name'
    ) {
      const element = this.config.fields.filter((el) => el.name === e.value);
      this.modalData.data = Object.assign({}, this.modalData.data);
      if (element && element[0]) {
        ['required', 'help_text', 'label', 'name'].forEach((el) => {
          this.modalData.data[el] = {
            action: 'add',
            data: {
              value: element[0][el]
            }
          };
        });
      }
    }
  }

  public updateObject(container: any[], object) {
    container.forEach((el) => {
      if (el.id === object.id) {
        el = Object.assign(el, object);
      }
    });
    container.sort((p, n) => {
      return p.position > n.position ? 1 : -1;
    });
  }

  public setType(type) {
    this.choosenType = type;
    this.modalData.endpoint = this.fields[type].endpoint;
    if (this.modalData.data && type === 'modelfield') {
      this.modalData.data['name'] = {
        action: 'add',
        data: {
          autocomplete: this.config.fields
        }
      };
    }
  }

  public filter(value) {
    if (value && this.groups) {
      this.toggleElement(this.groups, true);
      this.checkElement(value, this.groups, true);
    } else {
      if (this.groups) {
        this.toggleElement(this.groups, false);
        this.addCollapseProperty(this.groups);
      }
    }
  }

  public checkElement(value, array, first = false) {
    let result = false;
    array.forEach((el) => {
      let self = false;
      let children = false;
      const val = el.label;
      if (val && val.toLowerCase().indexOf(value.toLowerCase()) > -1) {
        self = true;
      }
      if (el.model_fields) {
        children = this.checkElement(value, el.model_fields);
        el.isCollapsed = !children;
      }
      el.hidden = !(self || children);
      if (!result) {
        result = !el.hidden;
      }
    });
    if (!first) {
      return result;
    }
  }

  public toggleElement(array, hidden) {
    array.forEach((el) => {
      el.hidden = hidden;
      if (el.model_fields) {
        this.toggleElement(el.model_fields, hidden);
      }
    });
  }

  public openActiveFields() {
    this.modalRef = this.modalService.open(this.modalActiveFields);
  }

  public changePosition(item, type) {
    const currentPosition = item.position;
    const nextPosition = type === 'up' ? item.position - 1 : item.position + 1;
    const element = this.getItemByPosition(this.activeFields, nextPosition);
    item.position = nextPosition;
    const body = Object.assign({ group: this.groupId }, item);
    delete body.hidden;
    delete body.isCollapsed;
    delete body.model_fields;
    this.genericFormService
      .editForm(`${this.formModelFieldEndpoint}${item.id}/`, body)
      .subscribe((res: any) => {
        const newBody = Object.assign({ group: this.groupId }, element);
        newBody.position = currentPosition;
        delete newBody.hidden;
        delete newBody.isCollapsed;
        delete newBody.model_fields;
        this.genericFormService
          .editForm(`${this.formModelFieldEndpoint}${element.id}/`, newBody)
          .subscribe((response: any) => {
            element.position = response.position;
            this.activeFields.sort((p, n) => {
              return p.position > n.position ? 1 : -1;
            });
          });
      });
  }

  public getItemByPosition(array, position) {
    let element;
    array.forEach((el) => {
      if (el.position === position) {
        element = el;
      }
    });
    return element;
  }

  public setActiveForFields(data: any[], remove?): any {
    data.forEach((el) => {
      this.toggleActiveState(el, remove);
    });
  }

  public setRequireForFields(data: any[], remove?): any {
    data.forEach((el) => {
      this.toggleRequireProperty(el, remove);
    });
  }

  public isActive(field: Field) {
    if (field.model_fields) {
      return field.model_fields.some((item) => !!item.id);
    }
  }

  public isRequired(field: Field) {
    if (field.model_fields) {
      return field.model_fields.some((item) => !!item.required);
    }
  }

  public disableSubfields(field): boolean {
    return field.name === 'bank_account' || field.name === 'contact__address';
  }

  public disableRequired(field): boolean {
    return field.name === 'contact__address';
  }

  public disableContactButton(field): boolean {
    return field.name === 'contact';
  }

  lockUserField(field: Field) {
    const lockedFields = [
      'contact__first_name',
      'contact__last_name',
      'contact__email',
      'contact__phone_mobile'
    ];

    if (lockedFields.includes(field.name)) {
      field.disabled = true;
      if (!field.id) {
        field.required = true;
        this.toggleActiveState(field);
      } else if (field.id && !field.required) {
        this.toggleRequireProperty(field);
      }
    }
  }
}
