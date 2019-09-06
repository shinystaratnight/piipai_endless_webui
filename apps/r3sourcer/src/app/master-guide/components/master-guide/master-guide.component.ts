import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { GuideItem } from '../../interfaces';
import { guide } from './master-guide.config';
import { MasterGuideService } from '../../services';
import {
  updateGuide,
  // NavigationService,
  // CheckPermissionService,
  SiteSettingsService,
  EventService,
  EventType
} from '@webui/core';
import { Page } from '@webui/data';

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
    private masterGuideService: MasterGuideService,
    // private navigationService: NavigationService,
    // private checkPermissionService: CheckPermissionService,
    private siteSettings: SiteSettingsService,
    private eventService: EventService
  ) {}

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
    return (
      (this.guide.filter(el => el.completed).length / this.guide.length) * 100
    );
  }

  update({ value, item, type }) {
    if (type === 'purpose') {
      const id = this.siteSettings.companyId;

      this.masterGuideService.changePurpose(id, value).subscribe(res => {
        item.value = value;
        this.eventService.emit(EventType.PurposeChanged);
        // this.navigationService
        //   .updateNavigation(id)
        //   .subscribe((pages: Page[]) => {
        //     this.checkPermissionService.parseNavigation(
        //       this.checkPermissionService.permissions,
        //       pages
        //     );
        //   });
      });
    }
  }

  getGuide() {
    this.masterGuideService.getGuide().subscribe((res: any) => {
      const complete = Object.keys(res).every(key => res[key]);

      if (!complete) {
        if (!this.sub) {
          this.sub = updateGuide.subscribe(() => {
            this.getGuide();
          });
        }

        this.guide = guide.map(item => {
          if (item.key === 'purpose') {
            item.value = res.purpose;
          }

          return {
            ...item,
            completed: res[item.key]
          };
        });
      }
    });
  }
}
