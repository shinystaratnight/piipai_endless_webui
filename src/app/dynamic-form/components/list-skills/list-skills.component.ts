import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
  selector: 'list-skills',
  templateUrl: 'list-skills.component.html',
  styleUrls: ['./list-skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListSkillsComponent implements OnInit {

  public config: any;

  public colors = {
    1: '#FA5C46',
    2: '#fc9183',
    3: '#FFA236',
    4: '#ffbf00',
    5: '#FFD042'
  };
  public list: boolean;

  public ngOnInit() {
    if (Array.isArray(this.config.value)) {
      this.list = true;
    }
  }
}
