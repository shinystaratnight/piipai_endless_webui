import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-skills',
  templateUrl: 'list-skills.component.html',
  styleUrls: ['./list-skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListSkillsComponent implements OnInit {

  public config: any;

  public colors = {
    0: '#bdbdbd',
    1: '#FA5C46',
    2: '#fc9183',
    3: '#FFA236',
    4: '#ffbf00',
    5: '#FFD042',
  };
  public list: boolean;
  public dataList: any[];
  public more: boolean;
  public evaluationCount: string;

  public ngOnInit() {
    if (Array.isArray(this.config.value)) {
      this.list = true;

      if (this.config.value && this.config.value.length > 4) {
        this.dataList = this.config.value.slice(0, 4);
        this.more = true;
      } else {
        this.dataList = this.config.value;
      }

    } else {
      if (this.config.value && this.config.name === 'evaluation') {
        const values = (this.config.value as string).split(' ');

        this.config.value = values[0];
        this.evaluationCount = values[1];
      }
    }

  }

  public getScore(score) {
    return Math.floor(parseFloat(score));
  }

  public showMore(e) {
    e.stopPropagation();
    e.preventDefault();

    this.dataList = this.config.value;
    this.more = false;

    return false;
  }
}
