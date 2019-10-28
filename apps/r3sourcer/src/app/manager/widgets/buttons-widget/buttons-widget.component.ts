import { Component, OnInit } from '@angular/core';

import { EventService, EventType, CompanyPurposeService } from '@webui/core';

import { WidgetService } from '../widget.service';
import { Subscription } from 'rxjs';

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
    this.widgetService.getUserWidgets().subscribe(userWidgets => {
      this.buttons = this.generateButtons(userWidgets);
      this.purposeService.filterModules(this.buttons);
    });

    this.eventSubscription = this.eventService.event$.subscribe(
      (type: EventType) => {
        if (type === EventType.PurposeChanged) {
          this.purposeService.filterModules(this.buttons);
        }
      }
    );
  }

  generateButtons(userWidgets: any[]) {
    return userWidgets.map(widget => {
      return {
        link: widget.endpoint,
        label: widget.label,
        description: widget.description,
        name: widget.name,
        add_label: widget.add_label,
        is_active: widget.is_active
      };
    });
  }
}
