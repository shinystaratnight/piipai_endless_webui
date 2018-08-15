import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Field } from '../../dynamic-form/models/field.model';

@Component({
  selector: 'registration-form',
  templateUrl: 'registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  public settings: any;
  public config: Field[];
  public password: boolean;

  constructor(private route: ActivatedRoute, private router: Router) {}

  public ngOnInit() {
    this.settings = this.route.snapshot.data['settings'];

    // this.route.url.subscribe((url) => {
    //   let urlCopy = [].concat(url);
    //   let lastElement = urlCopy.pop().path;
    //   if (lastElement === 'password') {
    //     this.endpoint = `${this.contactEndpoint}${user.id}/password/`;
    //     this.password = true;
    //   }
    // });
  }

  public setFormConfig(config: Field[]) {
    this.config = config;
  }

  public updateConfig(config: Field[]) {
    const streetAddress = config.find(field =>
      field.key.includes('street_address')
    );

    if (streetAddress) {
      config.forEach(field => {
        if (
          field.key.includes('postal_code') ||
          field.key.includes('state') ||
          field.key.includes('country') ||
          field.key.includes('city')
        ) {
          console.log(field.key);
        }
      });
    }
  }
}
