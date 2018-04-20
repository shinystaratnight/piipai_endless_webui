import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'list-info',
  templateUrl: 'list-info.component.html',
  styleUrls: ['./list-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ListInfoComponent implements OnInit {

  public config: any;

  public src: string;
  public available: boolean;
  public title: string;
  public address: string;
  public description: string;
  public status: any[];

  public color: any;
  public colorAttr: string;
  public className: any;

  public statusList: any[];
  public more: boolean;

  public ngOnInit() {
    if (this.config.values) {
      const keys = Object.keys(this.config.values);

      keys.forEach((key) => {
        if (key === 'status') {
          this[key] = this.getValue(this.config.values[key].field, this.config.value);

          if (this[key].length > 4) {
            this.statusList = this[key].slice(0, 4);

            this.more = true;
          } else {
            this.statusList = this[key];
          }

          this.color = this.config.values[key].color;
          this.colorAttr = this.config.values[key].color_attr;
        } else {
          this[key] = this.getValue(this.config.values[key], this.config.value);
        }
      });
    }
  }

  public getValue(key: string, data: any): any {
    if (key) {
      let keys = key.split('.');
      let prop = keys.shift();

      if (!keys.length) {
        return data[prop];
      } else if (data[prop]) {
        return this.getValue(keys.join('.'), data[prop]);
      }
    }
  }

  public checkClass(item) {
    let className;
    if (this.color && this.colorAttr) {
      const keys = Object.keys(this.color);

      keys.forEach((key) => {
        className = this.color.red.indexOf(item[this.colorAttr]) > -1 ? key : 'success';
      });
    }

    return className || 'success';
  }

  public showMore(e) {
    e.preventDefault();
    e.stopPropagation();

    this.statusList = this.status;
    this.more = false;

    return false;
  }
}
