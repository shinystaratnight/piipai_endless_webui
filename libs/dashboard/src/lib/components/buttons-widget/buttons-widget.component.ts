import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';

import { EventService, EventType, CompanyPurposeService } from '@webui/core';

import { WidgetService } from '../../services/widget.service';
import { ButtonWidget } from '@webui/data';

@Component({
  selector: 'app-buttons-widget',
  templateUrl: './buttons-widget.component.html',
  styleUrls: ['./buttons-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonsWidget implements OnInit, OnDestroy {
  buttons: ButtonWidget[];

  private eventSubscription: Subscription;

  constructor(
    private widgetService: WidgetService,
    private eventService: EventService,
    private purposeService: CompanyPurposeService
  ) {}

  ngOnInit() {
    this.buttons = this.purposeService.filterModules(
      this.widgetService.getButtons()
    );
    this.eventSubscription = this.eventService.event$.subscribe(
      (type: EventType) => {
        if (type === EventType.PurposeChanged) {
          this.buttons = this.purposeService.filterModules(this.buttons);
        }
      }
    );
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

  getLinkToList(button: { link: string }): string {
    return `/mn${button.link}`;
  }

  getLinkToCreateForm(button: { link: string }): string {
    return `/mn${button.link}add`;
  }
}
