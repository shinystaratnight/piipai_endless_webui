import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { GenericFormService } from '../../services/generic-form.service';

interface ViewElement {
  type: string;
  isCollapsed: boolean;
  elementList?: string[];
  viewData?: ListElement[] | TableElement;
}

interface ListElement {
  label: string;
  value: string;
}

interface TableElement {
  label: string[];
  row: any[];
}

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  @Input()
  public id: string;

  @ViewChild('modal')
  public modal;

  public endpoint: string = '/ecore/api/v2/candidate/candidatecontacts/';
  public skillsEndpoint: string = '/ecore/api/v2/candidate/skillrels/';
  public tagsEndpoint: string = '/ecore/api/v2/candidate/tagrels/';

  public metadata: any[];
  public data: any;
  public error: any;

  public skillsMetadata: any[];
  public tagsMetadata: any[];
  public defaultPicture: any;

  public modalData: any;
  public modalRef: any;

  public personalTraits: ViewElement = {
    type: 'list',
    isCollapsed: false,
    viewData: []
  };
  public residency: ViewElement = {
    type: 'list',
    isCollapsed: false,
    viewData: []
  };
  public skills: ViewElement = {
    type: 'table',
    isCollapsed: false,
    viewData: []
  };
  public tags: ViewElement = {
    type: 'table',
    isCollapsed: false,
    viewData: []
  };
  public contactDetails: ViewElement = {
    type: 'list',
    isCollapsed: false,
    viewData: []
  };

  constructor(
    private service: GenericFormService,
    private modalService: NgbModal
  ) {}

  public ngOnInit() {
    this.personalTraits.elementList = [
      'contact.gender',
      'weight',
      'transportation_to_work',
      'strength',
      'language',
      'candidate_scores.reliability',
      'candidate_scores.loyalty',
      'candidate_scores.recruitment_score',
      'candidate_scores.client_feedback'
    ];

    this.residency.elementList = [
      'residency',
      'visa_type',
      'visa_expiry_date',
      'nationality'
    ];

    this.contactDetails.elementList = [
        'contact.email',
        'contact.phone_mobile',
        'contact.address.phone_landline',
        'contact.address.phone_fax',
        'contact.address.city',
        'contact.address.postal_code',
        'contact.address.state',
        'contact.address.country'
    ];

    this.skills.elementList = [
      'skill',
      'score',
      'prior_experience'
    ];

    this.tags.elementList = [
      'tag',
      'verification_evidence',
      'verified_by'
    ];
    this.getMetadata(this.endpoint + this.id + '/profile');
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public openModal(title, element, id) {
    this.modalData = null;
    this.modalData = this.prepareData(title, element, id);
    this.modalRef = this.modalService.open(this.modal, {size: 'lg'});
  }

  public prepareData(title, element, id) {
    let data = {
      title: '',
      endpoint: '',
      id: ''
    };
    data.title = (title) ? title : this.data.contact.__str__;
    data.endpoint = (element) ? this[element + 'Endpoint'] : this.endpoint;
    data.id = (id) ? id : this.id;
    return data;
  }

  public getMetadata(endpoint) {
    this.service.getMetadata(endpoint + '?type=form').subscribe(
      (res: any) => {
        this.metadata = res;
        const picture = this.getItemFromMetadata(res, 'contact.picture');
        if (picture && picture.default) {
          this.defaultPicture = picture.default.indexOf('http') ? picture.default : `/ecore/media/${picture.default}`; //tslint:disable-line
        } else {
          this.defaultPicture = `/assets/img/Labourking_logo.jpg`;
        }
        this.getData();
      },
      (error: any) => this.error = error);
  }

  public getData() {
    this.service.getAll(this.endpoint + this.id + '/').subscribe(
      (res: any) => {
        this.data = res;
        this.generate('personalTraits');
        this.generate('residency');
        this.generate('contactDetails');
        this.getSkillMetadata();
      },
      (error: any) => this.error = error);
  }

  public getSkillMetadata() {
    this.service.getMetadata(this.skillsEndpoint + '?type=form').subscribe(
      (res: any) => {
        this.skillsMetadata = res;
        this.getTagMetadata();
      },
      (error: any) => this.error = error);
  }

  public getTagMetadata() {
    this.service.getMetadata(this.tagsEndpoint + '?type=form').subscribe(
      (res: any) => {
        this.tagsMetadata = res;
        this.generateView();
      },
      (error: any) => this.error = error);
  }

  public generateView() {
    let components = ['skills', 'tags'];
    components.forEach((el) => {
      this.generate(el);
    });
  }

  public generate(element) {
    switch (this[element].type) {
      case 'list':
        this.generateList(this[element].elementList, this[element].viewData, element);
        break;
      case 'table':
        this.generateTable(this[element].elementList, this[element].viewData, element);
        break;
      default: return false;
    }
  }

  public generateList(elements, data, element) {
    elements.forEach((el) => {
      let item = [];
      let options;
      let formElement = this.getItemFromMetadata(this.metadata, el);
      item.push((formElement && formElement.templateOptions.label)
        ? formElement.templateOptions.label : '');
      if (formElement && formElement.type === 'select') {
        options = formElement.templateOptions.options;
      }
      let valueElement = this.getValueOfData(this.data, el, options);
      item.push(valueElement ? valueElement : (el === 'nationality') ? 'Other' : '-');
      if (this.isEmail(valueElement)) {
        item.push('mailto:');
      } else if (this.isPhone(valueElement)) {
        item.push('tel:');
      }
      data.push(item);
    });
  }

  public generateTable(elements, data: TableElement, element) {
    let metadata = this[element + 'Metadata'];
    let apiData = this.data;
    data.label = elements.map((el) => {
      let formElement = this.getItemFromMetadata(metadata, el);
      return (formElement && formElement.templateOptions.label) ?
        formElement.templateOptions.label : '';
    });
    let prop = (element === 'skills') ? 'candidate_skills' :
      (element === 'tags') ? 'tag_rels' : null;
    data.row = [];
    if (prop) {
      apiData[prop].forEach((el) => {
        let item = {
          id: '',
          values: []
        };
        elements.forEach((elem) => {
          let options;
          let formElement = this.getItemFromMetadata(metadata, elem);
          if (formElement && formElement.type === 'select') {
            options = formElement.templateOptions.options;
          }
          let valueElement = this.getValueOfData(el, elem, options);
          if (formElement.key === 'score') {
            valueElement = [valueElement];
          }
          item.id = this.getValueOfData(el, 'id');
          if (this.isLink(valueElement)) {
            item.values.push([valueElement]);
          } else {
            item.values.push(valueElement || valueElement === 0 ? valueElement : '-');
          }
        });
        data.row.push(item);
      });
    }
  }

  public getItemFromMetadata(metadata, key) {
    let element;
    metadata.forEach((el) => {
      if (el.key === key) {
        if (!element) {
          element = el;
        }
      } else if (el.children) {
        if (!element) {
          element = this.getItemFromMetadata(el.children, key);
        }
      }
    });
    return element;
  }

  public getValueOfData(data, key: string, options: any[] = null) {
    let keys = key.split('.');
    let prop = keys.shift();
    if (data) {
      if (keys.length === 0) {
        let value;
        if (options) {
          options.forEach((el) => {
            if (el.value == data[prop]) { // tslint:disable-line
              value = el.label;
            }
          });
        } else {
          if (data[prop] instanceof Object) {
            value = data[prop].__str__;
          } else {
            value = data[prop];
          }
        }
        return value;
      } else {
        return this.getValueOfData(data[prop], keys.join('.'), options);
      }
    }
  }

  public isEmail(value) {
    let reg =
       /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;

    return reg.test(value) ? true : false;
  }

  public isPhone(value) {
    let reg = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    return reg.test(value) ? true : false;
  }

  public isLink(value) {
    let reg = /^(https?:\/\/)/;

    return reg.test(value) ? true : false;
  }

  public refreshProfile() {
    let components = ['personalTraits', 'residency', 'contactDetails', 'skills', 'tags'];
    components.forEach((el) => {
      this[el].viewData = [];
      this.generate(el);
    });
  }

  public formEvent(e, closeModal) {
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
      this.refreshProfile();
    }
  }
}
