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

  public ngOnInit() {
    if (this.config.value || this.config.value === 0) {
      this.value = this.config.value;
    }
    this.checkDate(moment);
  }

  public checkDate(moment) {
    let type = this.config.templateOptions && this.config.templateOptions.type;
    if (type === 'time' || type === 'date' || type === 'datetime') {
      if (type === 'time') {
        this.value = this.config.value ?
          moment(this.config.value, 'hh:mm:ss').format('hh:mm A') : '-';
      }
      if (type === 'date') {
        this.value = this.config.value ?
          moment(this.config.value, 'YYYY-MM-DD').format('DD/MM/YYYY') : '-';
      }
      if (type === 'datetime') {
        this.value = this.config.value ?
          moment.tz(this.config.value, 'Australia/Sydney')
                .format('DD/MM/YYYY hh:mm A') : '-';
      }
    }
  }

}
