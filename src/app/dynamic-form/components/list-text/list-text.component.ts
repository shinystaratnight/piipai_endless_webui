import { Component, OnInit } from '@angular/core';
import moment from 'moment-timezone';

@Component({
  selector: 'list-text',
  templateUrl: './list-text.component.html',
  styleUrls: ['./list-text.component.scss']
})

export class ListTextComponent implements OnInit {

  public config: any;
  public length: any;
  public last: boolean;
  public value: any;
  public arrayValue: boolean;

  public iconView: boolean;
  public iconClass: string;
  public iconColor: string;

  public ngOnInit() {
    if (this.config.value || this.config.value === 0) {
      if (this.config.value && this.config.display) {
        this.value = this.config.display;
      } else {
        this.value = this.config.value;
        if (Array.isArray(this.value)) {
          this.arrayValue = true;
        }
      }
    }
    this.checkDate(moment);
    this.customizeStatic(this.config.value);
  }

  public checkDate(moment) {
    let type = this.config.templateOptions && this.config.templateOptions.type;
    if (type === 'time' || type === 'date' || type === 'datetime') {
      if (type === 'time') {
        if (this.arrayValue) {
          const result = this.value.map((el) => {
            return el ? moment(el, 'hh:mm:ss').format('hh:mm A') : '-';
          });
          this.value = result;
        } else {
          this.value = this.value ? moment(this.value, 'hh:mm:ss').format('hh:mm A') : '-';
        }
      }
      if (type === 'date') {
        if (this.arrayValue) {
          const result = this.value.map((el) => {
            return el ? moment(el, 'YYYY-MM-DD').format('DD/MM/YYYY') : '-';
          });
          this.value = result;
        } else {
          this.value = this.value ? moment(this.value, 'YYYY-MM-DD').format('DD/MM/YYYY') : '-';
        }
      }
      if (type === 'datetime') {
        if (this.arrayValue) {
          const result = this.value.map((el) => {
            return el ? moment.tz(el, 'Australia/Sydney').format('DD/MM/YYYY hh:mm A') : '-';
          });
          this.value = result;
        } else {
          this.value = this.value ? moment.tz(this.value, 'Australia/Sydney').format('DD/MM/YYYY hh:mm A') : '-'; //tslint:disable-line
        }
      }
    }
  }

  public customizeStatic(value): void {
    if (this.config && this.config.values) {
      this.iconView = true;
      this.value = this.config.values[value];
      let color = this.config.color;
      let classes = ['primary', 'danger', 'info', 'success', 'warning'];
      this.iconClass = classes.indexOf(color) > -1 ? `text-${color}` : '';
      if (!this.iconClass) {
        if (color) {
          this.iconColor = color;
        } else {
          this.iconClass = value === true ?
            'text-success' : value === false ?
              'text-danger' : 'text-muted';
        }
      }
    }
  }

}
