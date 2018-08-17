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
  }

  public setFormConfig(config: Field[]) {
    this.config = config;
  }

}
