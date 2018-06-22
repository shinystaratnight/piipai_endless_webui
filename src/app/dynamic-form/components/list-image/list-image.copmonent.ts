import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'list-image',
  templateUrl: './list-image.component.html',
  styleUrls: ['./list-image.component.scss']
})

export class ListImageComponent implements OnInit {

  public config: any;
  public src: string;
  public icon: string;
  public iconClass: string;
  public last: boolean;
  public file: string;
  public contactAvatar: string;

  public ngOnInit() {
    let defaultAvatar: string;
    if (this.config.type === 'picture') {
      defaultAvatar = this.config.default;
      this.src = (this.config.value && this.config.value.thumb)
        ? this.config.value.thumb : false;

      if (this.config.value && this.config.file === undefined) {
        this.file = this.config.value;
      }
    } else if (this.config.type === 'icon') {
      if (this.config.values) {
        this.icon = this.config.values[this.config.value];
        if (this.config.color) {
          this.getColor(this.config.value);
          return;
        }
        this.setClass(this.config.value);
      }
    }

    if (!this.src && this.config.contactName) {
      const nameElements = this.config.contactName.split(' ');

      if (nameElements && nameElements.length) {
        if (nameElements.length === 2) {
          this.contactAvatar = nameElements.map((el) => el[0]).join('').toUpperCase();
        } else if (nameElements.length === 3) {
          nameElements.shift();
          this.contactAvatar = nameElements.map((el) => el[0]).join('').toUpperCase();
        }
      }
    }
  }

  public getColor(value) {
    this.iconClass = this.config.color[value] ? `text-${this.config.color[value]}` : 'text-muted';
  }

  public setClass(value) {
    this.iconClass = value === true ?
      'text-success' : value === false ?
      'text-danger' : 'text-muted';
  }

}
