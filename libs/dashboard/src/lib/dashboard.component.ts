import { Component, OnInit } from '@angular/core';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

import {
  Widget,
  UserWidget,
  Type,
  GridElementType,
  GridElement
} from './interfaces';
import { WidgetService } from './services/widget.service';
import { UserService } from '@webui/core';

import { WidgetItem } from './components';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userWidgets: UserWidget[];
  widgets: Widget[];
  widgetList: WidgetItem[];

  grid: GridElement;
  dragging: boolean;

  GridElementType = GridElementType;

  constructor(
    private userService: UserService,
    private widgetService: WidgetService,
  ) {}

  ngOnInit() {
    this.initializeDashboard();
  }

  getColumnWidth(gridElement: GridElement): { [key: string]: any } {
    const style = {};

    if (gridElement.type === GridElementType.Column && gridElement.id) {
      const elements = gridElement.elements;

      elements.forEach((el: GridElement) => {
        if (el.type === GridElementType.Widget) {
          const size = el.widget.config.size * 100;

          if (el.widget.config.active) {
            style['flexBasis'] = size + '%';
          } else {
            style['flex'] = 0;
          }

          // const size = el.widget.config.active ? el.widget.config.size : 0;

          // style['flex'] = Math.max(style['flex'] || 0, size);
          // style['flexGrow'] = size;
        }
      });
    }

    return style;
  }

  isActive(gridElement: GridElement): boolean {
    if (gridElement.type === GridElementType.Column && gridElement.id) {
      const elements = gridElement.elements;

      return elements.some((el: GridElement) => {
        if (el.type === GridElementType.Widget) {
          return el.widget.config.active;
        }
      });
    }

    return true;
  }

  isMove(gridElement: GridElement): boolean {
    if (gridElement.type === GridElementType.Widget) {
      return gridElement.widget.move;
    }

    return false;
  }

  getId(gridElement: GridElement) {
    if (gridElement.id) {
      return `list-${gridElement.id}`;
    }

    return '';
  }

  getlistsId() {
    const ids = this.widgetService.listsId;

    return [
      ...ids.sort((p, n) => (p > n ? -1 : 1)).map(el => `list-${el}`),
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
    widget.move = !widget.move;
  }

  removeWidget(tooltip, widget: UserWidget) {
    tooltip.close();
    widget.tooltip = false;

    this.widgetService.removeWidget(widget.id).subscribe(() => {
      this.userWidgets = this.userWidgets.filter(el => el.id !== widget.id);
      this.grid = this.generateDashboard(this.userWidgets);
      this.widgetService.updateCoords(this.grid);
      this.updateWidgetsConfig();
      this.updateWidgetList();
    });
  }

  addWidget(widget: Widget) {
    const contactId = this.userService.user.data.contact.contact_id;
    const config = {
      coords: this.grid.elements.length.toString(),
      size: this.widgetService.getSizes(widget.type),
      active: true
    }

    this.grid = null;
    this.widgetService
      .addWidget(widget.id, contactId, config)
      .subscribe(
        () => {
          this.widgetService.updateDashboard();
          this.updateWidgetsConfig();
          this.initializeDashboard();
        },
        () => {
          this.initializeDashboard();
        }
      );
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

    this.widgetService.updateCoords(this.grid);
    this.userWidgets.forEach(el => {
      el.move = false;
    });
    this.dragging = false;
    this.updateWidgetsConfig();
  }

  dragStarted() {
    this.dragging = true;
  }

  updateUserWidgets(target: WidgetItem) {
    const userWidget = this.userWidgets.find(el => el.widgetId === target.widgetId);

    if (userWidget) {
      userWidget.config.active = target.active;

      this.widgetService
        .updateWidget(userWidget.id, { ui_config: userWidget.config })
        .subscribe(() => {
          this.updateWidgetList();
        })
    } else {
      const widget = this.widgets.find(el => el.id === target.widgetId);

      this.addWidget(widget);
    }
  }

  private updateWidgetList() {
    this.widgetList = this.widgets.map(widget => {
      const {name, id} = widget;
      const userWidget = this.userWidgets.find(el => el.widgetId === id);
      const active = userWidget && userWidget.config ? userWidget.config.active : false;

      return {
        widgetId: id,
        name,
        id: userWidget ? userWidget.id : null,
        active
      }
    });
  }

  private initializeDashboard() {
    this.widgetService.getWidgets().subscribe((widgets: Widget[]) => {
      this.widgets = widgets;

      this.widgetService
        .getUserWidgets()
        .subscribe((userWidgets: UserWidget[]) => {
          this.userWidgets = userWidgets;

          this.grid = this.generateDashboard(userWidgets);
          this.updateWidgetList();
        });
    });
  }

  private updateWidgetsConfig() {
    this.userWidgets.forEach((widget: UserWidget) => {
      this.widgetService.updateWidget(widget.id, { ui_config: widget.config }).subscribe();
    });
  }

  private generateDashboard(widgets: UserWidget[]): any {
    const types = Object.values(Type);
    const availableWidgets = widgets.filter(el => types.includes(el.type));

    availableWidgets.sort((p, n) =>
      p.config.coords > n.config.coords ? 1 : -1
    );

    return this.widgetService.generateGrid(availableWidgets);
  }
}
