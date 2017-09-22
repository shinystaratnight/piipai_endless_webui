import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'list-image',
  templateUrl: 'list-image.component.html'
})

export class ListImageComponent implements OnInit {

  public config: any;
  public src: string;
  public icon: string;
  public iconClass: string;

  public ngOnInit() {
    if (this.config.type === 'picture') {
      this.src = (this.config.value && this.config.value.thumb)
        ? this.config.value.thumb : '/assets/img/avatar.png';
    } else if (this.config.type === 'icon') {
      if (this.config.values) {
        this.icon = this.config.values[this.config.value];
        this.setClass(this.config.value);
      }
    }
  }

  public setClass(value) {
    this.iconClass = value === true ?
      'text-success' : value === false ?
      'text-danger' : 'text-muted';
  }

}
