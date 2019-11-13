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

import {
  Widget,
  UserWidget,
  Type,
  GridElementType,
  GridElement
} from './interfaces';
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

  grid: GridElement;
  modalRef: NgbModalRef;

  draging: boolean;

  GridElementType = GridElementType;

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

  getColumnWidth(gridElement: GridElement): { [key: string]: any } {
    const style = {};

    if (gridElement.type === GridElementType.Column && gridElement.id) {
      const elements = gridElement.elements;

      elements.forEach((el: GridElement) => {
        if (el.type === GridElementType.Widget) {
          const size = el.widget.config.size;

          style['flex'] = Math.max(style['flex'] || 0, size);
        }
      });
    }

    return style;
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

    this.widgetService.updateCoords(this.grid);
    this.userWidgets.forEach(el => {
      el.move = false;
    });
    this.draging = false;
  }

  dragStarted() {
    this.draging = true;
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
