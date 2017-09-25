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
  public formFieldsEndpoint: string = '/ecore/api/v2/endless-core/formfields/';
  public groups: FormFieldsGroup[];

  public config: any;
  public modalData: any;
  public modalRef: any;

  constructor(
    private modalService: NgbModal,
    private genericFormService: GenericFormService
  ) {}

  public ngOnInit() {
    this.groups = [];
  }

  public addGroup() {
    this.modalData = {};
    this.modalData.type = 'group';
    this.modalData.title = 'Group';
    this.modalData.container = this.groups;
    this.modalData.endpoint = this.formFieldGroupsEndpoint;
    this.modalData.data = {
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
          value: this.config.id,
          hide : true,
          default: 0
        }
      }
    };
    this.modalRef = this.modalService.open(this.modal, {size: 'lg'});
  }

  public addField(group, id) {
    this.modalData = {};
    this.modalData.type = 'field';
    this.modalData.title = 'Field';
    this.modalData.container = group.fields;
    this.modalData.endpoint = this.formFieldsEndpoint;
    this.modalData.data = {
      group: {
        action: 'add',
        data: {
          value: id,
          hide: true
        }
      },
    };
    this.modalRef = this.modalService.open(this.modal, {size: 'lg'});
  }

  public edit(object, container, type) {
    this.modalData = {};
    this.modalData.type = type;
    this.modalData.edit = true;
    this.modalData.title = object.__str__;
    this.modalData.container = container;
    this.modalData.endpoint = type === 'group' ?
      this.formFieldGroupsEndpoint : this.formFieldsEndpoint;
    this.modalData.id = object.id;
    this.modalRef = this.modalService.open(this.modal, {size: 'lg'});
  }

  public delete(object, container: any[], type) {
    let endpoint = type === 'group' ? this.formFieldGroupsEndpoint : this.formFieldsEndpoint;
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

  public formEvent(e, closeModal, type, container, edit) {
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
      if (edit) {
        this.updateObject(container, e.data);
      } else {
        container.push(e.data);
      }
    }
  }

  public updateObject(container: any[], object) {
    container.forEach((el) => {
      if (el.id === object.id) {
        el = Object.assign(el, object);
      }
    });
  }
}
