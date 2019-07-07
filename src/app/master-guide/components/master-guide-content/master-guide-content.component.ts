import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { GuideItem } from '../../interfaces';
import { FormatString } from '../../../helpers/format';
import { UserService } from '../../../services';

@Component({
  selector: 'app-master-guide-content',
  templateUrl: './master-guide-content.component.html',
  styleUrls: ['./master-guide-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterGuideContentComponent implements OnInit {

  @Input()
  guide: GuideItem[];

  constructor(private userService: UserService) {}

  ngOnInit() {
    const format = new FormatString();

    this.guide.forEach((el) => {
      el.text.forEach((item) => {
        if (item.url) {
          item.url = format.format(item.url, this.userService.user.data.contact);
        }
      })
    });
  }

  isArray() {
    return Array.isArray;
  }
}
