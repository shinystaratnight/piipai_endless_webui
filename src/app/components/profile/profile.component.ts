import { Component, Input, OnInit } from '@angular/core';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

interface ViewElement {
  type: string;
  elementList?: string[];
  viewData?: ListElement[] | TableElement;
}

interface ListElement {
  label: string;
  value: string;
}

interface TableElement {
  label: string[];
  row: string[][];
}

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {

  @Input()
  public id: string;

  public endpoint: string = '/ecore/api/v2/endless-candidate/candidatecontacts/';
  public metadata: any;
  public data: any;
  public error: any;

  public personalTraits: ViewElement = {
    type: 'list',
    viewData: []
  };
  public residency: ViewElement = {
    type: 'list',
    viewData: []
  };
  public skills: ViewElement = {
    type: 'table',
    viewData: []
  };
  public tags: ViewElement = {
    type: 'table',
    viewData: []
  };
  public contactDetails: ViewElement = {
    type: 'list',
    viewData: []
  };

  constructor(private service: GenericFormService) {}

  public ngOnInit() {
    this.personalTraits.elementList = [
      'contact.gender',
      'weight',
      'transportation_to_work',
      'strength',
      'language',
      'reliability_score',
      'loyalty_score',
      'total_score'
    ];

    this.residency.elementList = [
      'residency',
      'visa_type.__str__',
      'visa_expiry_date',
      'nationality.__str__'
    ];

    this.contactDetails.elementList = [
      'contact.email',
      'contact.phone_mobile'
    ];
    this.id = '7a25f402-c421-4412-a9e1-163baea438e8';
    this.getMetadata();
  }

  public getMetadata() {
    this.service.getMetadata(this.endpoint + '?type=form').subscribe(
      (res: any) => {
        this.metadata = res;
        this.getData();
      },
      (error: any) => this.error = error);
  }

  public getData() {
    this.service.getAll(this.endpoint + this.id + '/').subscribe(
      (res: any) => {
        this.data = res;
        this.generateView();
      },
      (error: any) => this.error = error);
  }

  public generateView() {
    let components = ['personalTraits', 'residency', 'contactDetails'];
    components.forEach((el) => {
      this.generate(el);
    });
  }

  public generate(element) {
    switch (this[element].type) {
      case 'list':
        this.generateList(this[element].elementList, this[element].viewData);
        break;
      case 'table':
        this.generateTable(this[element].elementList, this[element].viewData);
        break;
      default: return false;
    }
  }

  public generateList(elements, data) {
    let metadata = this.metadata;
    let apiData = this.data;
    elements.forEach((el) => {
      let item = [];
      let options;
      let formElement = this.getItemFromMetadata(metadata, el);
      item.push(formElement ? formElement.templateOptions.label : '');
      if (formElement && formElement.type === 'select') {
        options = formElement.templateOptions.options;
      }
      let valueElement = this.getValueOfData(apiData, el, options);
      item.push(valueElement ? valueElement : '');
      data.push(item);
    });
  }

  public generateTable(elements, data: TableElement) {
    let metadata = this.metadata;
    let apiData = this.data;
    data.label = elements.map((el) => {
      let formElement = this.getItemFromMetadata(metadata, el);
      return formElement ? formElement.templateOptions.label : '';
    });
  }

  public getItemFromMetadata(metadata, key) {
    let element;
    metadata.forEach((el) => {
      if (el.key === key) {
        element = el;
      } else if (el.children) {
        element = this.getItemFromMetadata(el.children, key);
      }
    });
    return element;
  }

  public getValueOfData(data: any[], key: string, options: any[] = null) {
    let keys = key.split('.');
    let prop = keys.shift();
    if (keys.length === 0) {
      let value;
      if (options) {
        options.forEach((el) => {
          if (el.value === data[prop]) {
            value = el.label;
          }
        });
      } else {
        value = data[prop];
      }
      return value;
    } else {
      return this.getValueOfData(data[prop], keys.join('.'), options);
    }
  }
}
