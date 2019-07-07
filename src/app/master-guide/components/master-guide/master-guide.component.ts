import { Component, OnInit } from '@angular/core';

import { GuideItem } from '../../interfaces';
import { guide } from './master-guide.config';

@Component({
  selector: 'app-master-guide',
  templateUrl: './master-guide.component.html',
  styleUrls: ['./master-guide.component.scss']
})
export class MasterGuideComponent implements OnInit {

  guide: GuideItem[] = guide;

  showPlaceholder: boolean;
  showContent: boolean;
  inactiveIcon: boolean;
  skiped: boolean;

  constructor() { }

  ngOnInit() {
    this.inactiveIcon = false;
  }

  togglePlaceholder() {
    this.showPlaceholder = !this.showPlaceholder;
  }

  onShowContent(event: Event) {
    this.showContent = true;
    this.showPlaceholder = false;
    this.inactiveIcon = true;
  }

  skipGuide(event: Event) {
    this.skiped = true;
  }

  minimize(event: Event) {
    this.showContent = false;
    this.inactiveIcon = false;
    this.showPlaceholder = true;
  }

  getProgress() {
    return (this.guide.filter((el) => el.completed).length / this.guide.length) * 100;
  }

}
