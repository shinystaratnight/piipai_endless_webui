import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'list-skills',
  templateUrl: 'list-skills.component.html',
  styleUrls: ['./list-skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListSkillsComponent {

  public config: any;

  public colors = {
    1: '#FA5C46',
    2: '#fc9183',
    3: '#FFA236',
    4: '#ffbf00',
    5: '#FFD042'
  };
}
