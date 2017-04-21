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

  public relatedField: any;

  public error = {};
  public response = {};

  constructor(
    private geo: GeoService,
    private fb: FormBuilder,
    private crs: ContactRegistrationService,
    private loginService: LoginService
  ) {
    this.relatedField = {
      'address.state' : true,
      'address.city': true
    };
  }

  public ngOnInit() {
    if (this.loginService.username) {
      const username = this.loginService.username;
      this.loginService.username = null;
      this.data.push({
        key: username.field,
        data: {
          value: username.value,
          read_only: true
        }
      });
    }
  }

  public selectCountry(endpoint, country) {
    this.geo.getRegions(endpoint, country.id)
      .subscribe(
        (regions) => {
          let newData = {
            key: 'address.state',
            data: { options: regions.results }
          };
          this.data = this.checkData(this.data, newData);
          // console.log(this.data);
        }
      );
    // this.getCompaniesOfCountry(country.value.code2);
    // this.getCompanyLocalization(country.value.code2);
  }

  public selectRegion(endpoint, region) {
    this.geo.getCities(endpoint, region.id)
      .subscribe(
        (cities) => {
          let newData = {
            key: 'address.city',
            data: { options: cities.results }
          };
          this.data = this.checkData(this.data, newData);
        }
      );
  }

  public onCompany() {
    this.isCompany = true;
    this.isRecruitee = false;
    this.companyLocalization = {};
    this.companyExistMessage = null;
  }

  public onRecruitee() {
    this.isRecruitee = true;
    this.isCompany = false;
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
    if (event.type === 'change' && event.el.key === 'address.country') {
      this.selectCountry(event.el.endpoint, event.value[0]);
    }
    if (event.type === 'change' && event.el.key === 'address.state') {
      this.selectRegion(event.el.endpoint, event.value[0]);
    }
  }

  public clearResult(result, field) {
    if (result[field]) {
      delete result[field];
    }
  }

  public checkData(data, newData) {
    let exist = this.data.filter((el) => el.key === newData.key);
    if (!exist.length) {
      data.push(newData);
    }
    return data;
  }

}
