import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
      country: [''],
      state: [''],
      city: [''],
      postal_code: ['']
    });

    this.companyContactForm = this.fb.group({
      country: [''],
      state: [''],
      city: [''],
      postal_code: ['']
    });

    this.contactForm = this.fb.group({
      title: [''],
      first_name: [''],
      last_name: [''],
      email: [''],
      phone_mobile: [''],
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

  public onCompany() {
    this.isCompany = true;
    this.isRecruitee = false;
  }

  public onRecruitee() {
    this.isRecruitee = true;
    this.isCompany = false;
  }

}
