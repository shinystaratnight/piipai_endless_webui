import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'list-link',
  templateUrl: 'list-link.component.html'
})

export class ListLinkComponent implements OnInit {

  public config;
  public href: string;
  public link: boolean;

  public ngOnInit() {
    this.href = this.createHref(this.config.value, this.config.link);
  }

  public isEmail(value) {
    let reg =
       /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;

    return reg.test(value) ? true : false;
  }

  public isPhone(value) {
    let reg = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    return reg.test(value) ? true : false;
  }

  public createHref(value, link) {
    if (this.isEmail(value) || this.isPhone(value)) {
      return `${link}`;
    }
    this.link = true;
    return `${link}`;
  }

}
