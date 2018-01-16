import { Component, OnInit } from '@angular/core';
import moment from 'moment-timezone';

@Component({
  selector: 'list-text',
  templateUrl: 'list-text.component.html'
})

export class ListTextComponent implements OnInit {

  public config: any;
  public length: any;
  public last: boolean;
  public value: any;
  public arrayValue: boolean;

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

}
