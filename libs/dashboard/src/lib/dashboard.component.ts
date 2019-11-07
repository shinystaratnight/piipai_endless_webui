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

  ids: Map<any, any> = new Map();

  grid: any;
  modalRef: NgbModalRef;

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

  getlistsId() {
    return [
      ...Array.from(this.ids.values())
        .sort((p, n) => (p > n ? -1 : 1))
        .map(el => `list-${el}`),
      'main-list'
    ];
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

    this.setCoords(this.grid);
    this.draging = false;
    this.grid = null;
    this.ids.clear();

    setTimeout(() => {
      this.grid = this.generateDashboard(this.userWidgets);
    }, 200);
  }

  dragStarted(e) {
    this.draging = true;
  }

  private generateDashboard(widgets: UserWidget[]): any {
    const types = Object.values(Type);
    const availableWidgets = widgets.filter(el => types.includes(el.type));

    availableWidgets.sort((p, n) =>
      p.config.coords > n.config.coords ? 1 : -1
    );

    let grid = [];

    availableWidgets.forEach(widget => {
      const { coords } = widget.config;

      this.gen(grid, widget, [...coords]);
    });
    grid = this.parse(grid);
    this.updateIds(grid);

    return grid;
  }

  private gen(parent: any[], widget: UserWidget, coords: number[]) {
    const index = coords.shift();

    if (coords.length) {
      parent[index] = parent[index] || [];
      this.gen(parent[index], widget, coords);
    } else {
      parent[index] = widget;
    }
  }

  private setCoords(grid: any[], index: number[] = []) {
    const arr = this.parse(grid);

    arr.forEach((el, i) => {
      const coords = [...index, i];
      if (Array.isArray(el)) {
        this.setCoords(el, coords);
      } else {
        const widget = this.userWidgets.find(w => w.id === el.id);

        if (widget) {
          widget.config.coords = coords;
        }
      }
    });
  }

  private updateIds(list: any[], parentId: number[] = []) {
    list.forEach((el, i) => {
      if (Array.isArray(el)) {
        const id = [...parentId, i];
        this.ids.set(el, id.join(''));
        this.updateIds(el, id);
      }
    });
  }

  private parse(list: any) {
    const newList = [];

    list.forEach(el => {
      if (list.length > 1 && !Array.isArray(el)) {
        newList.push([el]);
      } else if (list.length === 1 && Array.isArray(el)) {
        const parsedList = this.parse(el);
        newList.push(...parsedList);
      } else if (Array.isArray(el)) {
        newList.push(this.parse(el));
      } else if (list.length === 0) {
        return;
      } else {
        newList.push(el);
      }
    });

    return newList;
  }
}
