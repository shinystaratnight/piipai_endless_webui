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

  public metadata: any;
  public titleField: any;
  public firstNameField: any;
  public lastNameField: any;
  public emailField: any;
  public phoneMobileField: any;
  public birthdayField: any;
  public taxFileNumberField = { label: 'Tax File Number' };
  public tagsField = { label: 'Please select Tickets and Licences you currently hold' };
  public skillsField = { label: 'Please select your tole(s) or trade(s)' };
  public pictureField: any;
  public uploadField = 'Upload';
  public takeAFotoField = 'Take A Photo';
  public countryField: any;
  public stateField: any;
  public cityField: any;
  public streetAddressField: any;
  public postalCodeField: any;
  public companyNameField: any;
  public businessIdField: any;

  public username = {
    phone_mobile: null,
    email: null,
    value: null
  };

  public contact: any;

  public error: any;
  public response: any;
  public emailValidateResult: any;
  public phoneValidateResult: any;

  constructor(
    private geo: GeoService,
    private fb: FormBuilder,
    private crs: ContactRegistrationService,
    private loginService: LoginService
  ) {
    this.recruiteeContactForm = this.fb.group({
      birthday: [''],
      tax_number: [''],
      country: [''],
      state: [''],
      city: [''],
      street_address: ['', Validators.compose([Validators.required])],
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
      street_address: ['', Validators.compose([Validators.required])],
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
    this.getMetaData();
    this.getTags();
    if (this.loginService.username) {
      const username = this.loginService.username;
      this.username[username.field] = true;
      this.username.value = username.value;
      this.contactForm.patchValue({[username.field]: username.value});
      this.loginService.username = null;
    }
  }

  public emailValidate(email) {
    this.crs.emailValidate(email).subscribe(
      (res: any) => this.emailValidateResult = res,
      (err: any) => this.emailValidateResult = err
    );
  }

  public phoneValidate(phone) {
    console.log(phone);
    this.crs.phoneValidate(phone).subscribe(
      (res: any) => this.phoneValidateResult = res,
      (err: any) => this.phoneValidateResult = err
    );
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
    this.recruiteeContactForm.reset();
  }

  public onRecruitee() {
    this.regions = null;
    this.cities = null;
    this.isRecruitee = true;
    this.isCompany = false;
    this.companyContactForm.reset();
  }

  public getMetaData() {
    this.crs.getMetaData().subscribe(
      (res: any) => {
        const contact = res.fields.contact.children;
        const company = res.fields.company.children;
        const address = res.fields.contact.children.address.children;

        this.metadata = res;
        this.titleField = contact.title;
        this.firstNameField = contact.first_name;
        this.lastNameField = contact.last_name;
        this.emailField = contact.email;
        this.phoneMobileField = contact.phone_mobile;
        this.birthdayField = contact.birthday;
        this.pictureField = contact.picture;
        this.countryField = address.country;
        this.stateField = address.state;
        this.cityField = address.city;
        this.streetAddressField = address.street_address;
        this.postalCodeField = address.postal_code;
        this.companyNameField = company.name;
        this.businessIdField = company.business_id;
      },
    );
  }

  public getTags() {
    this.crs.getTags().subscribe(
      (res: any) => this.tags = res.results
    );
  }

  public newContact() {
    this.dataGenerate();
    this.crs.registerContact(this.contact).subscribe(
      (res: any) => this.response = res,
      (err: any) => this.error = err
    );
  }

  public dataGenerate() {
    const type = this.isCompany ? 'company' : this.isRecruitee ? 'recruitee' : undefined;
    this.contact = {
      type,
      data: {
        title: this.contactForm.controls['title'].value,
        first_name: this.contactForm.controls['first_name'].value,
        last_name: this.contactForm.controls['last_name'].value,
        email: this.contactForm.controls['email'].value,
        phone_mobile: this.contactForm.controls['phone_mobile'].value,
        address: {},
      }
    };
    if (type === 'company') {
      this.contact.data.name = this.companyContactForm.controls['name'].value;
      this.contact.data.business_id =
        this.companyContactForm.controls['bussiness_id'].value;
      this.contact.data.address.country = this.companyContactForm.controls['country'].value.id;
      this.contact.data.address.state = this.companyContactForm.controls['state'].value.id;
      this.contact.data.address.city = this.companyContactForm.controls['city'].value.id;
      this.contact.data.address.street_address =
        this.companyContactForm.controls['street_address'].value;
      this.contact.data.address.postal_code =
        this.companyContactForm.controls['postal_code'].value;
    }
  }

}
