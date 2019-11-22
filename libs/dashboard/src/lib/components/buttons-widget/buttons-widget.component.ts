import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { EventService, EventType, CompanyPurposeService } from '@webui/core';

import { WidgetService } from '../../services/widget.service';

@Component({
  selector: 'app-buttons-widget',
  templateUrl: './buttons-widget.component.html',
  styleUrls: ['./buttons-widget.component.scss']
})
export class ButtonsWidget implements OnInit {
  buttons: any;
  eventSubscription: Subscription;

  constructor(
    private widgetService: WidgetService,
    private eventService: EventService,
    private purposeService: CompanyPurposeService
  ) {}

  ngOnInit() {
    this.buttons = this.widgetService.getButtons();
    this.purposeService.filterModules(this.buttons);
    this.eventSubscription = this.eventService.event$.subscribe(
      (type: EventType) => {
        if (type === EventType.PurposeChanged) {
          this.purposeService.filterModules(this.buttons);
        }
      }
    );
  }
}
