import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { isMobile, getTimeInstance } from '@webui/utilities';
import { getValueOfData, generateCssStyles } from '../../../helpers';

@Component({
  selector: 'app-list-text',
  templateUrl: './list-text.component.html',
  styleUrls: ['./list-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListTextComponent implements OnInit {
  private stylePrefix = 'list-text';

  public config: any;
  public length: any;
  public last: boolean;
  public value: any;
  public arrayValue: boolean;

  public iconView: boolean;
  public iconClass: string;
  public iconColor: string;
  public workers: any;
  public cssClasses: string[];

  public colors = {
    1: '#FA5C46',
    2: '#fc9183',
    3: '#FFA236',
    4: '#ffbf00',
    5: '#FFD042'
  };

  public isMobile = isMobile;

  public ngOnInit() {
    if (this.config.value || this.config.value === 0) {
      if (this.config.value && this.config.display) {
        this.value = this.config.display;
      } else {
        this.value = this.config.value;
        if (Array.isArray(this.value)) {
          this.arrayValue = true;

          if (this.config.param) {
            this.value.forEach((el) => {
              const obj = { value: '' };
              getValueOfData(el, this.config.param, obj);

              el.__str__ = obj.value || el.__str__;
            });
          }
        }
      }
    }
    if (this.config.workers_details) {
      this.workers = this.generateWorkers(this.config.workers_details);
    }

    this.checkDate(getTimeInstance());
    this.customizeStatic(this.config.value);
    this.cssClasses = generateCssStyles(this.config.styles, this.stylePrefix);
  }

  public getScore(score) {
    return Math.floor(parseFloat(score));
  }

  public checkDate(moment) { //tslint:disable-line
    const type = this.config.templateOptions && this.config.templateOptions.type;
    if (type === 'time' || type === 'date' || type === 'datetime') {
      if (type === 'time') {
        if (this.arrayValue) {
          const result = this.value.map((el) => {
            return el ? moment(el, 'hh:mm:ss').format('hh:mm A') : ' ';
          });
          this.value = result;
        } else {
          this.value = this.value ? moment(this.value, 'hh:mm:ss').format('hh:mm A') : ' ';
        }
      }
      if (type === 'date') {
        if (this.arrayValue) {
          const result = this.value.map((el) => {
            return el ? moment(el, 'YYYY-MM-DD').format('DD/MM/YYYY') : ' ';
          });
          this.value = result;
        } else {
          this.value = this.value ? moment(this.value, 'YYYY-MM-DD').format('DD/MM/YYYY') : ' ';
        }
      }
      if (type === 'datetime') {
        if (this.arrayValue) {
          const result = this.value.map((el) => {
            return el ? moment(el).format('DD/MM/YYYY hh:mm A') : ' ';
          });
          this.value = result;
        } else {
          this.value = this.value ? moment(this.value).format('DD/MM/YYYY hh:mm A') : ' '; //tslint:disable-line
        }
      }
    }
  }

  public customizeStatic(value): void {
    if (this.config && this.config.values) {
      this.iconView = true;
      this.value = this.config.values[value];
      const color = this.config.color;
      const classes = ['primary', 'danger', 'info', 'success', 'warning'];
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
    } else if (this.config.setColor) {
      const classes = ['primary', 'danger', 'info', 'success', 'warning', 'description', 'comment'];
      const color = this.config.color;
      this.iconClass = classes.indexOf(color) > -1 ? `text-${color}` : '';
    }
  }

  public generateWorkers(data) {
    const result = [];

    const statusList = Object.keys(data);

    statusList.forEach((status: string) => {
      data[status].forEach((candidate) => {
        if (candidate) {
          result.push({
            name: candidate,
            status
          });
        }
      });
    });

    return result.length && result;
  }

}
