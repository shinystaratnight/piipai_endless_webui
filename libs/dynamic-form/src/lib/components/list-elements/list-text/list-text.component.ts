import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { isMobile, getTranslationKey } from '@webui/utilities';
import { getValueOfData, generateCssStyles } from '../../../helpers';
import { DATE_FORMAT, DATE_TIME_FORMAT, Time } from '@webui/time';
import { IconName } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'webui-list-text',
  templateUrl: './list-text.component.html',
  styleUrls: ['./list-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListTextComponent implements OnInit {
  private stylePrefix = 'list-text';

  public config: any;
  public length: any;
  public last!: boolean;
  public value!: string | number | any[];
  public arrayValue!: boolean;

  public iconView!: boolean;
  public iconClass!: string;
  public iconColor!: string;
  public workers: any;
  public cssClasses!: string[];

  public colors: Record<number, string> = {
    1: '#FA5C46',
    2: '#fc9183',
    3: '#FFA236',
    4: '#ffbf00',
    5: '#FFD042',
  };

  public isMobile = isMobile;
  translationKey = '';

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
    // TODO: add details of candidates
    // if (this.config.workers_details) {
    //   this.workers = this.generateWorkers(this.config.workers_details);
    // }

    // const timeInstance = this.config.timezone
    //   ? getTimeInstance().tz.setDefault(this.config.timezone)
    //   : getTimeInstance();

    this.checkDate();
    this.customizeStatic(this.config.value);
    this.cssClasses = generateCssStyles(this.config.styles, this.stylePrefix);
    this.translationKey = getTranslationKey(
      `${this.config.key}.${this.config.name}`,
      typeof this.value === 'number'
        ? this.value.toString()
        : this.config.label === 'Date'
        ? 'date'
        : 'label'
    );
  }

  public get iconName(): IconName | undefined {
    if (typeof this.value === 'string') {
      return this.value as IconName;
    }

    return;
  }

  public isArray(val: unknown): val is Array<any> {
    return Array.isArray(val);
  }

  public isString(val: unknown): val is string {
    return typeof val === 'string';
  }

  public getScore(score: string) {
    return Math.floor(parseFloat(score));
  }

  public checkDate() {
    const timezone = this.config.timezone;
    const type = this.config.templateOptions?.type;
    const value = this.value as any[];
    if (type === 'time' || type === 'date' || type === 'datetime') {
      if (type === 'time') {
        if (this.arrayValue) {
          this.value = value.map((el: any) => {
            return el
              ? Time.parse(el, { format: 'hh:mm:ss', timezone }).format(
                  'hh:mm A'
                )
              : ' ';
          });
        } else {
          this.value = this.value
            ? Time.parse(this.value, { format: 'hh:mm:ss', timezone }).format(
                'hh:mm A'
              )
            : ' ';
        }
      }
      if (type === 'date') {
        if (this.arrayValue) {
          this.value = value.map((el) => {
            return el
              ? Time.parse(el, { format: 'YYYY-MM-DD', timezone }).format(
                  DATE_FORMAT
                )
              : ' ';
          });
        } else {
          this.value = this.value
            ? Time.parse(this.value, { format: 'YYYY-MM-DD', timezone }).format(
                DATE_FORMAT
              )
            : ' ';
        }
      }
      if (type === 'datetime') {
        if (this.arrayValue) {
          this.value = value.map((el) => {
            return el
              ? Time.parse(el, { timezone }).format(DATE_TIME_FORMAT)
              : ' ';
          });
        } else {
          this.value = this.value
            ? Time.parse(this.value, { timezone }).format(DATE_TIME_FORMAT)
            : ' ';
        }
      }
    }
  }

  public customizeStatic(value: any): void {
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
          this.iconClass =
            value === true
              ? 'text-success'
              : value === false
              ? 'text-danger'
              : 'text-muted';
        }
      }
    } else if (this.config.setColor) {
      const classes = [
        'primary',
        'danger',
        'info',
        'success',
        'warning',
        'description',
        'comment',
      ];
      const color = this.config.color;
      this.iconClass = classes.indexOf(color) > -1 ? `text-${color}` : '';
    }
  }

  public generateWorkers(data: any) {
    const result: any[] = [];

    const statusList = Object.keys(data);

    statusList.forEach((status: string) => {
      data[status].forEach((candidate: any) => {
        if (candidate) {
          result.push({
            name: candidate.name,
            status,
          });
        }
      });
    });

    return result.length && result;
  }
}
