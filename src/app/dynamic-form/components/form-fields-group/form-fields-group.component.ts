import { Component, OnInit, ViewChild } from '@angular/core';

import { GenericFormService } from './../../services/generic-form.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

interface FormFieldsGroup {
  fields: string[];
  form: string;
  name: string;
  position: number;
  id: number;
}

@Component({
  selector: 'form-fields-group',
  templateUrl: 'form-fields-group.component.html',
  styleUrls: ['./form-fields-group.component.scss']
})

export class FormFieldsGroupComponent implements OnInit {

  @ViewChild('modal')
  public modal: any;

  @ViewChild('modalActiveFields')
  public modalActiveFields: any;

  public formFieldGroupsEndpoint: string = '/ecore/api/v2/core/formfieldgroups/';
  public formModelFieldEndpoint: string = '/ecore/api/v2/core/modelformfields/';
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

  public lastPosition: number = 0;

  constructor(
    private modalService: NgbModal,
    private genericFormService: GenericFormService
  ) {}

  public ngOnInit() {
    console.log(this);
    if (this.config.value) {
      let value = this.config.value;
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
    this.fields = {
      modelfield: {
        endpoint: '/ecore/api/v2/core/modelformfields/',
        label: 'Model field'
      },
      group: {
        label: 'Custom fields:'
      },
      textareafield: {
        endpoint: '/ecore/api/v2/core/textareaformfields/',
        label: 'TextArea field'
      },
      numberfield: {
        endpoint: '/ecore/api/v2/core/numberformfields/',
        label: 'Number field'
      },
      selectfield: {
        endpoint: '/ecore/api/v2/core/selectformfields/',
        label: 'Select field'
      },
      filefield: {
        endpoint: '/ecore/api/v2/core/fileformfields/',
        label: 'File field'
      },
      imagefield: {
        endpoint: '/ecore/api/v2/core/imageformfields/',
        label: 'Image field'
      },
      checkboxfield: {
        endpoint: '/ecore/api/v2/core/checkboxformfields/',
        label: 'Checkbox field'
      },
      datefield: {
        endpoint: '/ecore/api/v2/core/dateformfields/',
        label: 'Date field'
      },
      radiobuttonsfield: {
        endpoint: '/ecore/api/v2/core/radiobuttonsformfields/',
        label: 'Radio button field'
      },
      textfield: {
        endpoint: '/ecore/api/v2/core/textformfields/',
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
          hide : true,
          default: 0
        }
      }
    };
    this.modalRef = this.modalService.open(this.modal);
  }

  public createGroup(): void {
    let body = {
      field_list: [],
      form: this.config.id,
      name: this.config.id,
      position: 0
    };
    this.genericFormService.submitForm(this.formFieldGroupsEndpoint, body).subscribe(
      (res: any) => {
        this.groupId = res.id;
      },
      (err: any) => this.error = err
    );
  }

  public addCollapseProperty(list): void {
    list.forEach((el) => {
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
      },
    };
    this.modalRef = this.modalService.open(this.modal);
  }

  public toggleActiveState(field): void {
    if (field.id) {
      this.genericFormService.delete(this.formModelFieldEndpoint, field.id).subscribe(
        (res: any) => {
          delete field.id;
          delete field.position;
          this.activeFields = this.getActiveFields(this.groups);
          this.activeFields.sort((p, n) => {
            return p.position > n.position ? 1 : -1;
          });
        },
        (err: any) => this.error = err
      );
    } else {
      let body = Object.assign({group: this.groupId}, field);
      body.position = this.lastPosition + 1;
      delete body.hidden;
      delete body.isCollapsed;
      delete body.model_fields;
      this.genericFormService.submitForm(this.formModelFieldEndpoint, body).subscribe(
        (res: any) => {
          field.id = res.id;
          field.position = res.position;
          this.lastPosition = res.position;
          this.activeFields = this.getActiveFields(this.groups);
          this.activeFields.sort((p, n) => {
            return p.position > n.position ? 1 : -1;
          });
        },
        (err: any) => this.error = err
      );
    }
  }

  public getActiveFields(array) {
    let results = [];
    array.forEach((el) => {
      if (el.id) {
        results.push(el);
      }
      if (el.model_fields) {
        let activeChildrens = this.getActiveFields(el.model_fields);
        results.push(...activeChildrens);
      }
    });
    return results;
  }

  public toggleRequireProperty(field): void {
    if (!field.required) {
      if (field.id) {
        let body = Object.assign({group: this.groupId}, field);
        delete body.hidden;
        delete body.isCollapsed;
        delete body.model_fields;
        delete body.setRequired;
        body.required = !field.setRequired;
        this.genericFormService
          .editForm(`${this.formModelFieldEndpoint}${field.id}/`, body)
          .subscribe(
            (res: any) => {
              field.setRequired = res.required;
            },
            (err: any) => this.error = err
          );
      } else {
        field.setRequired = !field.setRequired;
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
    this.modalData.endpoint = type === 'group' ?
      this.formFieldGroupsEndpoint : this.fields[object.field_type].endpoint;
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
            hide : true
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
        },
      };
    }
    this.modalRef = this.modalService.open(this.modal);
  }

  public delete(object, container: any[], type) {
    let endpoint = type === 'group' ?
      this.formFieldGroupsEndpoint : this.fields[object.field_type].endpoint;
    let id = object.id;
    this.genericFormService.delete(endpoint, id).subscribe(
      (res: any) => {
        container.forEach((el, i) => {
          if (el.id === id) {
            container.splice(i, 1);
          }
        });
      },
      (err: any) => this.error = err
    );
  }

  public formEvent(e, closeModal, container, edit, type) {
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
      if (edit) {
        this.updateObject(container, e.data);
      } else {
        if (type === 'field') {
          let data = {
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
    } else if (e.type === 'blur' && this.choosenType === 'modelfield' && e.el.key === 'name') {
      let element = this.config.fields.filter((el) => el.name === e.value);
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
      let val = el.label;
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
    let currentPosition = item.position;
    let nextPosition = type === 'up' ? item.position - 1 : item.position + 1;
    let element = this.getItemByPosition(this.activeFields, nextPosition);
    item.position = nextPosition;
    let body = Object.assign({group: this.groupId}, item);
    delete body.hidden;
    delete body.isCollapsed;
    delete body.model_fields;
    this.genericFormService
      .editForm(`${this.formModelFieldEndpoint}${item.id}/`, body)
      .subscribe((res: any) => {
        let newBody = Object.assign({group: this.groupId}, element);
        newBody.position = currentPosition;
        delete newBody.hidden;
        delete newBody.isCollapsed;
        delete newBody.model_fields;
        this.genericFormService.editForm(`${this.formModelFieldEndpoint}${element.id}/`, newBody)
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

}
