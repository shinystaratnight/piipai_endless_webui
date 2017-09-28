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
  templateUrl: 'form-fields-group.component.html'
})

export class FormFieldsGroupComponent implements OnInit {

  @ViewChild('modal')
  public modal: any;

  public formFieldGroupsEndpoint: string = '/ecore/api/v2/endless-core/formfieldgroups/';
  public groups: FormFieldsGroup[];
  public fields: any;
  public choosenType: string;
  public types: string[];

  public config: any;
  public modalData: any;
  public modalRef: any;

  constructor(
    private modalService: NgbModal,
    private genericFormService: GenericFormService
  ) {}

  public ngOnInit() {
    if (this.config.value) {
      this.groups = this.config.value;
    } else {
      this.groups = [];
    }
    this.fields = {
      textareafield: {
        endpoint: '/ecore/api/v2/endless-core/textareaformfields/',
        label: 'TextArea field'
      },
      numberfield: {
        endpoint: '/ecore/api/v2/endless-core/numberformfields/',
        label: 'Number field'
      },
      modelfield: {
        endpoint: '/ecore/api/v2/endless-core/modelformfields/',
        label: 'Model field'
      },
      selectfield: {
        endpoint: '/ecore/api/v2/endless-core/selectformfields/',
        label: 'Select field'
      },
      filefield: {
        endpoint: '/ecore/api/v2/endless-core/fileformfields/',
        label: 'File field'
      },
      imagefield: {
        endpoint: '/ecore/api/v2/endless-core/imageformfields/',
        label: 'Image field'
      },
      checkboxfield: {
        endpoint: '/ecore/api/v2/endless-core/checkboxformfields/',
        label: 'Checkbox field'
      },
      datefield: {
        endpoint: '/ecore/api/v2/endless-core/dateformfields/',
        label: 'Date field'
      },
      radiobuttonsfield: {
        endpoint: '/ecore/api/v2/endless-core/radiobuttonsformfields/',
        label: 'Radio button field'
      },
      textfield: {
        endpoint: '/ecore/api/v2/endless-core/textformfields/',
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
      }
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
}
