import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { UserService } from '@webui/core';
import { GenericFormService } from '../../../services';
import { getBankAccountLayoutEndpoint, Endpoints } from '@webui/data';
import { Form, InputType } from '@webui/metadata';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { getPropValue } from '@webui/utilities';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-form-bank-account',
  templateUrl: './form-bank-account.component.html',
  styleUrls: ['./form-bank-account.component.scss']
})
export class FormBankAccountComponent implements OnInit, OnDestroy {
  layout: any;
  metadata: any[];
  accounts: any[];
  contactId: boolean;

  account: any;

  config: any;
  viewMode: any;

  saveProcess: boolean;

  modalData: {
    view?: boolean;
    title: string;
    metadata: any;
    data?: any;
    errors?: any;
  };

  public hiddenFields = {
    elements: [],
    keys: [],
    observers: []
  };

  modalRef: NgbModalRef;

  @ViewChild('modal', { static: true }) modalEl: ElementRef;

  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private gfs: GenericFormService,
    private modal: NgbModal
  ) {}

  ngOnInit() {
    const countryCode = this.userService.user.data.country_code;
    this.contactId = getPropValue(
      this.config.formData.value.data,
      'contact.id'
    );

    this.checkModeProperty();

    if (countryCode) {
      this.getLayout(countryCode);
    }
  }

  ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public checkModeProperty() {
    if (this.config && this.config.mode) {
      const subscription = this.config.mode.subscribe(mode => {
        if (mode === 'view') {
          this.viewMode = true;
        } else {
          this.viewMode = this.config.read_only || false;
        }
      });

      this.subscriptions.push(subscription);
    }
  }

  viewAccount(account, e) {
    if (e) {
      e.preventDefault();
    }

    const metadata = this.generateMetadata(true);
    const data = {};
    account.fields.forEach(({ field_id, value }) => {
      data[field_id] = value;
    });

    this.fillingForm(metadata, data);

    this.modalData = {
      view: true,
      title: 'Bank Account',
      metadata,
      errors: {},
      data: {}
    };

    this.modalRef = this.modal.open(this.modalEl);
  }

  addAccount() {
    const formData = {
      contact_id: this.contactId,
      layout_id: this.layout.id
    };

    const metadata = this.generateMetadata();
    this.updateMetadataByProps(metadata);
    this.fillingForm(metadata, formData);

    this.modalData = {
      title: 'Add Bank Account',
      metadata,
      errors: {},
      data: {}
    };

    this.modalRef = this.modal.open(this.modalEl);
  }

  submitForm(formData = {}) {
    const body = {
      contact_id: this.contactId,
      layout_id: this.layout.id,
      fields: Object.entries(formData).map(([field_id, value]) => {
        return { field_id, value };
      })
    };

    this.saveProcess = true;

    this.gfs
      .submitForm(`/contacts/${this.contactId}/bank_accounts/`, body)
      .subscribe(
        () => {
          this.saveProcess = false;
          this.modalRef.close();
          this.modalRef = undefined;
          this.getContactBankAccounts();
        },
        err => (this.saveProcess = false)
      );
  }

  deleteAccount(account) {
    this.gfs
      .delete(`/contacts/${this.contactId}/bank_accounts/`, account.id)
      .subscribe(() => {
        this.getContactBankAccounts();
      });
  }

  private getLayout(countryCode: string) {
    this.gfs.get(getBankAccountLayoutEndpoint(countryCode)).subscribe(res => {
      this.layout = res.results[0];
      this.getContactBankAccounts();
    });
  }

  private getContactBankAccounts() {
    this.gfs
      .get(`/contacts/${this.contactId}/bank_accounts/`)
      .subscribe(res => {
        this.accounts = res;
        this.account = res[0];
      });
  }

  private generateMetadata(view = false): any[] {
    const fields = [...this.layout.fields]
      .sort((p, n) => p.order > n.order ? 1 : -1 )
      .map(field => {
        return new Form.input.element(
          field.id.toString(),
          field.description,
          InputType.Text
        ).required();
      });

    if (view) {
      fields.forEach(field => {
        field.readOnly();
      });
    }

    return fields;
  }

  private fillingForm(metadata, data) {
    metadata.forEach(el => {
      if (el.key) {
        this.getValueOfData(data, el.key, el);
      } else if (el.children) {
        this.fillingForm(el.children, data);
      }
    });
  }

  private getValueOfData(data, key, obj) {
    const keys = key.split('.');
    const prop = keys.shift();
    if (keys.length === 0) {
      if (data) {
        obj['value'] = data[key];
      }
    } else {
      if (data[prop]) {
        this.getValueOfData(data[prop], keys.join('.'), obj);
      }
    }
  }

  private updateMetadataByProps(metadata: any[]) {
    metadata.forEach(el => {
      if (el.showIf && el.showIf.length) {
        if (this.hiddenFields.keys.indexOf(el.key) === -1) {
          this.hiddenFields.keys.push(el.key);
          this.hiddenFields.elements.push(el);
          this.hiddenFields.observers = this.observeFields(
            el.showIf,
            this.hiddenFields.observers
          );
          el.hidden = new BehaviorSubject(true);
        }
      }

      if (el.children) {
        this.updateMetadataByProps(el.children);
      }
    });
  }

  private observeFields(fields: any[], observers) {
    fields.forEach((field: any) => {
      if (field instanceof Object) {
        const keys = Object.keys(field);
        keys.forEach(key => {
          if (observers.indexOf(key) === -1) {
            observers.push(key);
          }
        });
      } else {
        if (observers.indexOf(field) === -1) {
          observers.push(field);
        }
      }
    });
    return observers;
  }
}
