import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'list-link',
  templateUrl: 'list-link.component.html'
})

export class ListLinkComponent implements OnInit {

  public config;
  public href: string | string[];
  public link: boolean;
  public value: string | string[];
  public last: boolean;
  public arrayValue: boolean;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public ngOnInit() {

    if (this.config.value && this.config.value instanceof Object && !Array.isArray(this.config.value)) { //tslint:disable-line
      this.value = this.config.value && (this.config.text || this.config.value.__str__);
    } else {
      this.value = this.config.value && (this.config.text || this.config.value);
    }
    this.href = this.config.link;

    if (Array.isArray(this.value) && Array.isArray(this.href)) {
      this.link = !(this.isEmail(this.value[0]) || this.isPhone(this.value[0]));
    } else {
      this.link = !(this.isEmail(this.value) || this.isPhone(this.value));
    }
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

  public action(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.value) {
      let arr = this.config.endpoint.split('/');
      let id = arr[arr.length - 2];
      arr.splice(arr.length - 2, 1);
      let endpoint = arr.join('/');
      if (this.config.action) {
        this.buttonAction.emit({
          el: this.config,
          value: this.config.action
        });
      } else {
        this.event.emit({
          target: 'form',
          endpoint: endpoint || this.config.endpoint,
          label: e.target.innerText,
          id: id || this.config.id
        });
      }
    }
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonHandler(e) {
    this.buttonAction.emit(e);
  }

}
