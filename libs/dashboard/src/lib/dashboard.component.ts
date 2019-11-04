import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

import { Widget, UserWidget, Type } from './interfaces';
import { WidgetService } from './services/widget.service';
import { UserService } from '@webui/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  userWidgets: UserWidget[];
  widgets: Widget[];
  widgetList: Widget[];

  grid: any;
  modalRef: NgbModalRef;

  ids: string[];

  draging: boolean;

  @ViewChild('modalTemplate', { static: false }) modalTemplate: ElementRef;

  constructor(
    private userService: UserService,
    private widgetService: WidgetService,
    private modal: NgbModal
  ) {}

  ngOnInit() {
    this.widgetService.getWidgets().subscribe((widgets: Widget[]) => {
      this.widgets = widgets;

      this.widgetService
        .getUserWidgets()
        .subscribe((userWidgets: UserWidget[]) => {
          console.log(userWidgets);
          this.userWidgets = userWidgets;

          this.grid = this.generateDashboard(userWidgets);
        });
    });
  }

  ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  toggleActions(tooltip, widget) {
    widget.tooltip = !widget.tooltip;

    if (widget.tooltip) {
      tooltip.open();
    } else {
      tooltip.close();
    }
  }

  moveWidget(tooltip, widget: UserWidget) {
    tooltip.close();
    widget.tooltip = false;
  }

  removeWidget(tooltip, widget: UserWidget) {
    tooltip.close();
    widget.tooltip = false;

    this.widgetService.removeWidget(widget.id).subscribe(() => {
      console.log('widget removed');
      this.userWidgets = this.userWidgets.filter(el => el.id !== widget.id);
      this.grid = this.generateDashboard(this.userWidgets);
    });
  }

  openModal() {
    this.widgetList = this.widgets;

    this.modalRef = this.modal.open(this.modalTemplate);
  }

  addWidget(widget: Widget) {
    const contactId = this.userService.user.data.contact.contact_id;

    this.modalRef.close();
    this.widgetService.addWidget(widget.id, contactId).subscribe(() => {
      console.log('new widget added');
    });
  }

  isArray(el: any) {
    return Array.isArray(el);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    console.log(this.grid);

    this.setCoords(this.grid);
    this.draging = false;

    this.grid = null;

    setTimeout(() => {
      this.grid = this.generateDashboard(this.userWidgets);
    }, 200);
  }

  dragStarted(e) {
    console.log(e);

    this.draging = true;
  }

  getRandomColor() {
    const hex = Math.floor(Math.random() * 0xffffff);
    return '#' + ('000000' + hex.toString(16)).substr(-6);
  }

  private generateDashboard(widgets: UserWidget[]): any {
    const types = Object.values(Type);
    const availableWidgets = widgets.filter(el => types.includes(el.type));

    availableWidgets.sort((p, n) =>
      p.config.coords > n.config.coords ? 1 : -1
    );

    const grid = [];

    availableWidgets.forEach(widget => {
      const coords = widget.config.coords;

      this.gen(grid, widget, coords.split('.'));
    });

    console.log(grid);

    this.ids = [];
    [].concat(grid, {}).forEach((el, i) => {
      this.ids.push(`cdk-drop-list-${i}`);
    });

    console.log(this.ids);

    return grid;
  }

  private gen(target: any[], widget, coords: any[]) {
    const pos = coords.shift();

    if (coords.length) {
      if (!target[pos]) {
        target[pos] = [];
      }

      this.gen(target[pos], widget, coords);
      return;
    }

    target[pos] = widget;
  }

  private setCoords(grid: any[], index: number[] = []) {
    grid.forEach((el, i) => {
      const coords = [...index, i];
      if (Array.isArray(el)) {
        this.setCoords(el, coords);
      } else {
        const widget = this.userWidgets.find(w => w.id === el.id);

        if (widget) {
          console.log(widget);
          if (coords.length === 1) {
            coords.push(0);
          }

          widget.config.coords = coords.join('.');
        }
      }
    });
  }
}
