import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'form-info',
  templateUrl: './form-info.component.html',
  styleUrls: ['./form-info.component.scss']
})

export class FormInfoComponent implements OnInit {
  public config: any;
  public group: any;

  public picture: string;
  public available: boolean;
  public title: string;
  public address: string;
  public description: string;
  public status: any[];
  public averageScore: any;
  public contactAvatar: string;
  public created_at: string; //tslint:disable-line
  public updated_at: string; //tslint:disable-line

  public color: any;
  public colorAttr: string;
  public className: any;
  public viewMode: boolean;

  public statusList: any[];
  public more: boolean;

  public colors = {
    1: '#FA5C46',
    2: '#fc9183',
    3: '#FFA236',
    4: '#ffbf00',
    5: '#FFD042',
  };

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public ngOnInit() {
    this.checkModeProperty();
    if (this.config.values && this.config.value) {
      const keys = Object.keys(this.config.values);

      this.averageScore = this.config.value.average_score;

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
        } else if (key === 'picture') {
          this[key] = this.getValue(this.config.values[key], this.config.value)
            || (this.config.companyPicture ? '/assets/img/logo.svg' : null);
        } else {
          this[key] = this.getValue(this.config.values[key], this.config.value);
        }
      });

      if (!this.picture) {
        const nameElements = this.title.split(' ');

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
  }

  public getConfig(name: string) {
    if (name === 'title' && !this.config.editForm) {
      const config = this.config.metadata[name];

      config.templateOptions.label = `${config.key[0].toUpperCase()}${config.key.slice(1)}`;
      return config;
    }

    return this.config.metadata[name];
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
        className = this.color[key].indexOf(item[this.colorAttr]) > -1 ? key : 'success';
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

  public getScore(score) {
    return Math.floor(parseFloat(score));
  }

  public checkModeProperty() {
    if (this.config && this.config.mode) {
      this.config.mode.subscribe((mode) => {
        this.viewMode = mode === 'view';
      });
    }
  }
}
