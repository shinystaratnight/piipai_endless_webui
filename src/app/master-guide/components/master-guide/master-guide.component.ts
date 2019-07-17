import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { GuideItem } from '../../interfaces';
import { guide } from './master-guide.config';
import { MasterGuideService } from '../../services';
import { updateGuide } from '../../../interceptors/master-guide.interceptor';

@Component({
  selector: 'app-master-guide',
  templateUrl: './master-guide.component.html',
  styleUrls: ['./master-guide.component.scss']
})
export class MasterGuideComponent implements OnInit, OnDestroy {

  guide: GuideItem[];

  showPlaceholder: boolean;
  showContent: boolean;
  inactiveIcon: boolean;
  skiped: boolean;

  private sub: Subscription;

  constructor(
    private masterGuideService: MasterGuideService
  ) { }

  ngOnInit() {
    this.inactiveIcon = false;
    this.getGuide();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
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

  update({ value, item }) {
    this.masterGuideService.updateValue(item.endpoint, { [item.key]: value })
  }

  getGuide() {
    this.masterGuideService.getGuide()
      .subscribe((res: any) => {
        const complete = Object.keys(res).every((key) => res[key]);

        if (!complete) {
          if (!this.sub) {
            this.sub = updateGuide.subscribe(() => {
              this.getGuide();
            });
          }

          this.guide = guide.map((item) => {
            if (item.options) {
              item.options.forEach((option) => {
                option.active = option.value === res.purpose;
              });
            }

            return {
              ...item,
              completed: res[item.key],
            }
          });
        }
      });
  }
}
