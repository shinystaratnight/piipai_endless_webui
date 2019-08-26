import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { getContactAvatar } from '@webui/utilities';
import { getValueOfData } from '../../../helpers';

@Component({
  selector: 'app-list-info',
  templateUrl: 'list-info.component.html',
  styleUrls: ['./list-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ListInfoComponent implements OnInit {

  public config: any;

  public picture: string;
  public available: boolean;
  public title: string;
  public address: string;
  public description: string;
  public status: any[];
  public averageScore: any;
  public averageScoreDescription: any;
  public contactAvatar: string;
  public job_title: string; //tslint:disable-line
  public company: string;
  position: string;

  public color: any;
  public colorAttr: string;
  public className: any;

  public statusList: any[];
  public more: boolean;

  public colors = {
    0: '#bdbdbd',
    1: '#FA5C46',
    2: '#fc9183',
    3: '#FFA236',
    4: '#ffbf00',
    5: '#FFD042',
  };

  public ngOnInit() {
    if (this.config.values) {
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
            || (this.config.companyPicture ? '/assets/img/logo.svg' : null)
            || (this.config.hideTitle ? '/assets/img/avatar.png' : null);
        } else {
          this[key] = this.getValue(this.config.values[key], this.config.value);
        }
      });

      if (this.picture == null) {
        this.contactAvatar = getContactAvatar(this.title);
      }
    }

    if (this.config.value) {
      this.generateAverageScoreTooltip(this.config.value);
    }
  }

  public generateAverageScoreTooltip(data) {
    const scores = [
      { label: 'Loyalty', key: 'candidate_scores.loyalty' },
      { label: 'Client feedback', key: 'candidate_scores.client_feedback' },
      { label: 'Avarage test', key: 'candidate_scores.recruitment_score' },
      { label: 'Reliability', key: 'candidate_scores.reliability' },
      { label: 'Average skill', key: 'candidate_scores.skill_score' },
    ];

    this.averageScoreDescription = {
      includes: this.filterScores(scores, data, 'includes'),
      excludes: this.filterScores(scores, data)
    };
  }

  public isCandidatePage(): boolean {
    if (this.config.value && this.config.value instanceof Object) {
      return this.config.value.hasOwnProperty('average_score');
    }

    return false;
  }

  public filterScores(scores, data, type?: string) {
    return scores
      .filter((el) => {
        getValueOfData(data, el.key, el);
        const score = this.getScore(el.value);
        el.score = el.value;

        return type === 'includes' ? score : !score;
      });
  }

  public getValue(key: string, data: any): any {
    if (key) {
      const keys = key.split('.');
      const prop = keys.shift();

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
}
