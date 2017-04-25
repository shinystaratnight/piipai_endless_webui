import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ContactRegistrationService } from './../../services/contact-registration.service';
import { LoginService } from './../../services/login.service';

@Component({
  selector: 'contact-registration-form',
  templateUrl: 'contact-registration-form.component.html',
})
export class ContactRegistrationFormComponent implements OnInit {

  public endpoint: string;
  public companyContactEndpoint =
    `http://172.17.0.5:8081/ecore/api/v2/endless-core/companycontacts/register/`;

  public tags: any;
  public company: any = {};
  public companyData = {};

  public fields = {
    email: 'email',
    phoneMobile: 'phone_mobile',
    country: 'address.country',
    state: 'address.state',
    city: 'address.city',
    name: 'company.name',
    businessId: 'company.business_id',
    postalCode: 'address.postal_code',
    streetAddress: 'address.street_address'
  };

  public username = {
    phone_mobile: null,
    email: null,
    value: null
  };

  public data = {};

  public relatedField: any;

  public error = {};
  public response = {};

  constructor(
    private fb: FormBuilder,
    private crs: ContactRegistrationService,
    private loginService: LoginService
  ) {
    this.endpoint = this.companyContactEndpoint;
    this.relatedField = {
      [this.fields.country]: {
        action: 'add',
        data: {
          related: {
            field: this.fields.state,
            param: 'id',
            query: '?country=',
            reset: this.fields.city
          }
        }
      },
      [this.fields.state]: {
        action: 'add',
        data: {
          related: {
            field: this.fields.city,
            param: 'id',
            query: '?region='
          },
          relate: true
        }
      },
      [this.fields.city]: {
        action: 'add',
        data: {
          relate: true
        }
      }
    };
  }

  public ngOnInit() {
    if (this.loginService.username) {
      const username = this.loginService.username;
      this.loginService.username = null;
      this.data = {
        [username.field]: {
          action: 'add',
          data: {
            value: username.value,
            read_only: true
          }
        }
      };
    }
  }

  public getCompaniesOfCountry(code2) {
    this.crs.getCompaniesOfCountry(code2).subscribe(
      (res: any) => {
        this.data = {
          [this.fields.name]: {
            action: 'add',
            data: { companylist: res.results }
          }
        };
      },
      (error: any) => this.error = error
    );
  }

  public getCompanyLocalization(code2) {
    this.crs.getCompanyLocalization(code2).subscribe(
      (res: any) => {
        this.data = {
          [this.fields.businessId]: {
            action: 'add',
            data: {
              templateOptions: {
                label: res.results[0].verbose_value,
                description: res.results[0].help_text
              }
            }
          }
        };
      },
      (err: any) => this.error = err
    );
  }

  public getCompany(data) {
    this.crs.getCompany(data[this.fields.name], data[this.fields.businessId]).subscribe(
      (res: any) => {
        if (res.message) {
          this.crs.getAddressOfCompany(res.results.id).subscribe(
            (response: any) => {
              this.response[this.fields.name] = res.message;
              console.log(response);
              this.data = {
                [this.fields.postalCode]: {
                  action: 'update',
                  value: response.results.address.postal_code
                },
                [this.fields.streetAddress]: {
                  action: 'update',
                  value: response.results.address.street_address
                },
                [this.fields.country]: {
                  action: 'update',
                  value: response.results.address.country.id
                },
                [this.fields.state]: {
                  action: 'update',
                  value: response.results.address.state.id,
                  update: true,
                  query: '?country=',
                  id: response.results.address.country.id
                },
                [this.fields.city]: {
                  action: 'update',
                  value: response.results.address.city.id,
                  update: true,
                  query: '?region=',
                  id: response.results.address.state.id
                },
              };
            },
            (err: any) => this.error = err
          );
        }
      },
      (err: any) => this.error = err
    );
  }

  public checkCompany() {
    if (this.companyData[this.fields.name] && this.companyData[this.fields.businessId]) {
      this.getCompany(this.companyData);
    }
  }

  public fieldValidation(field, value) {
    this.crs.fieldValidation(field, value).subscribe(
      (res: any) => {
        this.response[field] = res.data.message;
        this.clearResult(this.error, field);
      },
      (err: any) => {
        this.error[field] = err.errors.message;
        this.clearResult(this.response, field);
      }
    );
  }

  public eventHandler(event) {
    if (event.type === 'blur' &&
      (event.el.key === this.fields.email || event.el.key === this.fields.phoneMobile)) {
      this.fieldValidation(event.el.key, event.value);
    }
    if (event.type === 'change' && event.el.key === this.fields.country) {
      this.getCompaniesOfCountry(event.value[0].code2);
      this.getCompanyLocalization(event.value[0].code2);
    }
    if (event.type === 'blur' &&
      (event.el.key === this.fields.name || event.el.key === this.fields.businessId)) {
      this.companyData[event.el.key] = event.value;
      this.checkCompany();
    }
  }

  public buttonActionHandler(event) {
    this[event.value]();
  }

  public clearResult(result, field) {
    if (result[field]) {
      delete result[field];
    }
  }

  public register_company_contact() {
    this.endpoint = this.companyContactEndpoint;
  }
}
