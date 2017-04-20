import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GeoService } from './../../services/geo.service';
import { ContactRegistrationService } from './../../services/contact-registration.service';
import { LoginService } from './../../services/login.service';

@Component({
  selector: 'contact-registration-form',
  templateUrl: 'contact-registration-form.component.html',
})
export class ContactRegistrationFormComponent implements OnInit {

  public endpoint = `/ecore/api/v2/endless-core/companycontacts/register/`;

  public isCompany: boolean = true;
  public isRecruitee: boolean = false;
  public datepicker: any;

  public contactForm: FormGroup;
  public recruiteeContactForm: FormGroup;
  public companyContactForm: FormGroup;

  public countries: any;
  public regions: any;
  public cities: any;
  public tags: any;
  public companiesList: any = [];
  public companyLocalization: any = {};
  public company: any = {};

  public companyExistMessage: any;

  public username = {
    phone_mobile: null,
    email: null,
    value: null
  };

  public data = [];

  public contact: any;

  public error = {};
  public response = {};
  public emailValidateResult: any;
  public phoneValidateResult: any;

  constructor(
    private geo: GeoService,
    private fb: FormBuilder,
    private crs: ContactRegistrationService,
    private loginService: LoginService
  ) {}

  public ngOnInit() {
    this.geo.getCountries()
      .subscribe(
        (countries) => {
          this.countries = countries.results;
        });
    this.getTags();
    if (this.loginService.username) {
      const username = this.loginService.username;
      this.loginService.username = null;
      this.data.push({
        key: username.field,
        value: username.value,
        readonly: true
      });
    }
  }

  public selectCountry(country) {
    this.regions = null;
    this.cities = null;
    this.geo.getRegions(country.value.id)
      .subscribe(
        (regions) => {
          this.regions = regions.results;
        }
      );
    this.getCompaniesOfCountry(country.value.code2);
    this.getCompanyLocalization(country.value.code2);
  }

  public selectRegion(region) {
    this.cities = null;
    this.geo.getCities(region.value.id)
      .subscribe(
        (cities) => {
          this.cities = cities.results;
        }
      );
  }

  public onCompany() {
    this.regions = null;
    this.cities = null;
    this.isCompany = true;
    this.isRecruitee = false;
    this.companyLocalization = {};
    this.companyExistMessage = null;
  }

  public onRecruitee() {
    this.regions = null;
    this.cities = null;
    this.isRecruitee = true;
    this.isCompany = false;
  }

  public getTags() {
    this.crs.getTags().subscribe(
      (res: any) => this.tags = res.results
    );
  }

  public getCompaniesOfCountry(code2) {
    this.crs.getCompaniesOfCountry(code2).subscribe(
      (res: any) => this.companiesList = res.results,
      (error: any) => this.error = error
    );
  }

  public autocompleListFormatter = (data: any) => `${data.name}`;

  public getCompanyLocalization(code2) {
    this.crs.getCompanyLocalization(code2).subscribe(
      (res: any) => {
        if (res.count === 1) {
          this.companyLocalization = res.results[0];
        }
      },
      (err: any) => this.error = err
    );
  }

  public getCompany(name, businessId) {
    this.crs.getCompany(name, businessId).subscribe(
      (res: any) => {
        if (res.message) {
          this.companyExistMessage = res.message;
          this.company = res.results[0];
          this.crs.getAddressOfCompany(this.company.id).subscribe(
            (response: any) => {
              const address = response.results[0].address;
              this.companyContactForm.patchValue({street_address: address.street_address});
              this.companyContactForm.patchValue({postal_code: address.postal_code});
            },
            (err: any) => this.error = err
          );
          this.companyContactForm.patchValue({name: this.company.name});
        }
      },
      (err: any) => this.error = err
    );
  }

  public checkCompany() {
    const businessId = this.companyContactForm.controls['bussiness_id'].value;
    const companyName = this.companyContactForm.controls['name'].value;
    if (businessId && companyName) {
      if ((typeof this.companyContactForm.controls['name'].value) === 'object') {
        this.getCompany(this.companyContactForm.controls['name'].value.name, businessId);
      } else if ((typeof this.companyContactForm.controls['name'].value) === 'string') {
        this.getCompany(this.companyContactForm.controls['name'].value, businessId);
      }
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
    if (event.type === 'blur' && (event.el.key === 'email' || event.el.key === 'phone_mobile')) {
      this.fieldValidation(event.el.key, event.value);
    }
  }

  public clearResult(result, field) {
    if (result[field]) {
      delete result[field];
    }
  }

}
