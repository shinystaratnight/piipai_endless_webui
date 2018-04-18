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

  public ngOnInit() {
    this.src = this.getValue(this.config.values.picture, this.config.value);
    this.available = this.getValue(this.config.values.available, this.config.value);
    this.title = this.getValue(this.config.values.title, this.config.value);
    this.address = this.getValue(this.config.values.address, this.config.value);
    this.description = this.getValue(this.config.values.description, this.config.value);
    this.status = this.getValue(this.config.values.status, this.config.value);
  }

  public getValue(key: string, data: any): any {
    let keys = key.split('.');
    let prop = keys.shift();

    if (!keys.length) {
      return data[prop];
    } else if (data[prop]) {
      return this.getValue(keys.join('.'), data[prop]);
    }
  }
}
