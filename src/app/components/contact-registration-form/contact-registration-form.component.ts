import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactRegistrationService } from './../../services/contact-registration.service';
import { LoginService } from './../../services/login.service';
import { LocalStorageService } from 'ng2-webstorage';

@Component({
  selector: 'contact-registration-form',
  templateUrl: 'contact-registration-form.component.html',
})
export class ContactRegistrationFormComponent implements OnInit {

  public endpoint: string;
  public companyContactEndpoint = `/ecore/api/v2/endless-core/companycontacts/register/`;
  public candidateContactEndpoint = `/ecore/api/v2/endless-candidate/candidatecontacts/register/`;
  public contactEndpoint = `/ecore/api/v2/endless-core/contacts/`;

  public tags: any;
  public company: any = {};
  public companyData = {};
  public updateData = {};

  public password: boolean = false;

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
  public form = {};
  public hide = true;

  public commonFields = ['title', 'first_name', 'last_name', 'phone_mobile', 'email'];

  constructor(
    private fb: FormBuilder,
    private crs: ContactRegistrationService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private storage: LocalStorageService,
    private router: Router
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
            reset: this.fields.state
          }
        }
      },
      [this.fields.state]: {
        action: 'add',
        data: {
          related: {
            field: this.fields.city,
            param: 'id',
            query: '?region=',
            reset: this.fields.city
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
    this.route.url.subscribe((url) => {
      let urlCopy = [].concat(url);
      let user = this.storage.retrieve('contact');
      if (user && user.password) {
        this.router.navigate(['/']);
        return;
      }
      let lastElement = urlCopy.pop().path;
      if (lastElement === 'password') {
        this.endpoint = `${this.contactEndpoint}${user.id}/password/`;
        this.password = true;
      }
    });
  }

  public getCompaniesOfCountry(code2) {
    this.crs.getCompaniesOfCountry(code2).subscribe(
      (res: any) => {
        this.data = {
          [this.fields.name]: {
            action: 'add',
            data: { autocomplete: res.results }
          }
        };
      },
      (error: any) => this.error = error
    );
  }

  public getCompanyLocalization(code2) {
    this.crs.getCompanyLocalization(code2).subscribe(
      (res: any) => {
        if (res.results.length) {
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
        }
      },
      (err: any) => this.error = err
    );
  }

  public getCompany(data) {
    this.crs.getCompany(data[this.fields.name], data[this.fields.businessId]).subscribe(
      (res: any) => {
        if (res.message) {
          this.form = {
            company: res.results[0].id
          };
          this.data = {
            [this.fields.name]: {
              action: 'update',
              value: res.results[0].name,
              block: true
            },
            [this.fields.businessId]: {
              action: 'update',
              value: res.results[0].business_id,
              block: true
            },
          };
          this.crs.getAddressOfCompany(res.results[0].id).subscribe(
            (response: any) => {
              this.response[this.fields.name] = res.message;
              this.clearResult(this.error, this.fields.name);
              this.data = {
                [this.fields.postalCode]: {
                  action: 'update',
                  value: response.results[0].address &&
                    response.results[0].address.postal_code,
                  block: true
                },
                [this.fields.streetAddress]: {
                  action: 'update',
                  value: response.results[0].address &&
                    response.results[0].address.street_address,
                  block: true
                },
                [this.fields.country]: {
                  action: 'add',
                  data: {
                    value: response.results[0].address.country &&
                      response.results[0].address.country.id,
                    readonly: true
                  }
                },
                [this.fields.state]: {
                  action: 'update',
                  value: response.results[0].address.state &&
                    response.results[0].address.state.id,
                  update: true,
                  query: '?country=',
                  id: response.results[0].address.country &&
                    response.results[0].address.country.id,
                  block: true
                },
                [this.fields.city]: {
                  action: 'update',
                  value: response.results[0].address.city &&
                    response.results[0].address.city.id,
                  update: true,
                  query: '?region=',
                  id: response.results[0].address.state &&
                    response.results[0].address.state.id,
                  block: true
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
    if (event.type === 'sendForm' && event.status === 'success') {
      let user = this.storage.retrieve('contact');
      user.password = true;
      this.storage.store('contact', user);
      this.router.navigate(['/']);
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
    this.reset(this.error);
    this.data = {};
    this.hide = false;
  }

  public register_candidate_contact() {
    this.endpoint = this.candidateContactEndpoint;
    this.reset(this.error);
    this.data = {};
    this.hide = false;
  }

  public reset(data) {
    Object.keys(data).forEach((el) => {
      if (this.commonFields.indexOf(el) === -1) {
        delete data[el];
      }
    });
  }
}
