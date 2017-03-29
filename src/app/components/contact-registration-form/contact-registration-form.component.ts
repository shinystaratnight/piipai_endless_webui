import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GeoService } from './../../services/geo.service';

@Component({
  selector: 'contact-registration-form',
  templateUrl: 'contact-registration-form.component.html',
})
export class ContactRegistrationFormComponent implements OnInit {

  public isCompany: boolean = true;
  public isRecruitee: boolean = false;
  public datepicker: any;

  public contactForm: FormGroup;
  public recruiteeContactForm: FormGroup;
  public companyContactForm: FormGroup;

  public countries: any;
  public regions: any;
  public cities: any;

  constructor(
    private geo: GeoService,
    private fb: FormBuilder
  ) {
    this.recruiteeContactForm = this.fb.group({
      birthday: [''],
      tax_number: [''],
      country: [''],
      state: [''],
      city: [''],
      address: ['', Validators.compose([Validators.required])],
      postal_code: ['', Validators.compose([Validators.required])],
      picture: [''],
      tags: [''],
      skills: ['']
    });

    this.companyContactForm = this.fb.group({
      country: [''],
      state: [''],
      city: [''],
      name: [''],
      bussiness_id: [''],
      address: ['', Validators.compose([Validators.required])],
      postal_code: ['', Validators.compose([Validators.required])],
    });

    this.contactForm = this.fb.group({
      title: [''],
      first_name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      last_name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      email: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
      phone_mobile: ['', Validators.compose([Validators.required])],
      recruiteeContact: this.recruiteeContactForm,
      companyContact: this.companyContactForm
    });
  }

  public ngOnInit() {
    this.geo.getCountries()
      .subscribe(
        (countries) => {
          this.countries = countries.results;
        });
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
  }

  public onRecruitee() {
    this.regions = null;
    this.cities = null;
    this.isRecruitee = true;
    this.isCompany = false;
  }

}
