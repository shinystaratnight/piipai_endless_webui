import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { meta } from './myob.meta';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

@Component({
  selector: 'myob',
  templateUrl: 'myob.component.html'
})

export class MyobComponent implements OnInit {

  public endpoint: string = '/ecore/api/v2/company_settings/';
  public pageUrl: string;
  public errors: any;
  public response: any;
  public config;
  public apiKey: string;

  constructor(
    private gfs: GenericFormService,
    private router: Router
  ) { }

  public ngOnInit() {
    this.config = meta;
    this.pageUrl = location.href;
  }

  public eventHandler(e) {
    if (e.type === 'blur' && e.el.key === 'key') {
      this.apiKey = e.value;
    }
  }

  public buttonHandler(e) {
    if (e.type === 'click' && e.value) {
      this[e.value]();
    }
  }

  public connect() {
    if (this.apiKey && this.pageUrl) {
      let url = `https://secure.myob.com/oauth2/account/authorize?client_id=${this.apiKey}&redirect_uri=${this.pageUrl}&response_type=code&scope=CompanyFile`;
      location.href = url;
    }
  }

}
