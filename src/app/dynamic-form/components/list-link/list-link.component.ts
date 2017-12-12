import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'list-link',
  templateUrl: 'list-link.component.html'
})

export class ListLinkComponent implements OnInit {

  public config;
  public href: string;
  public link: boolean;
  public value: string;
  public last: boolean;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  @ViewChild('link')
  public element: any;

  public ngOnInit() {
    this.href = this.createHref(this.config.value, this.config.link);
    if (this.config.value && this.config.value instanceof Object) {
      this.value = this.config.value && (this.config.text || this.config.value.__str__);
    } else {
      this.value = this.config.value && (this.config.text || this.config.value);
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

  public createHref(value, link) {
    if (this.isEmail(value) || this.isPhone(value)) {
      return `${link}`;
    }
    this.link = true;
    return `${link}`;
  }

  public action(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.value) {
      let arr = this.config.endpoint.split('/');
      let id = arr[arr.length - 2];
      arr.splice(arr.length - 2, 1);
      let endpoint = arr.join('/');
      this.event.emit({
        target: 'form',
        endpoint: endpoint || this.config.endpoint,
        label: this.element.nativeElement.innerText,
        id: id || this.config.id
      });
    }
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonHandler(e) {
    this.buttonAction.emit(e);
  }

}
