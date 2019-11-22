import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ErrorsService } from '@webui/core';
import { Endpoints } from '@webui/data';

import {
  Type,
  Widget,
  UserWidget,
  GridElementType,
  GridElement
} from '../interfaces';
import { widgetsData } from '../helpers';

@Injectable()
export class WidgetService {
  widgets: Widget[];
  userWidgets: any[];

  listsId: string[];

  params = new HttpParams({ fromObject: { limit: '-1' } });

  constructor(private http: HttpClient, private errorService: ErrorsService) {}

  getWidgets() {
    if (this.widgets) {
      return of(this.widgets);
    }

    return this.http
      .get(Endpoints.DashboardModule, { params: this.params })
      .pipe(
        map((res: any) => {
          if (res.results) {
            const widgets = res.results.map(el => {
              const type: Type = el.module_data.model;

              return {
                id: el.id,
                type: el.module_data.model,
                ...widgetsData[type]
              };
            });

            this.widgets = widgets;
            return this.widgets;
          }
        }),
        catchError(errors => this.errorService.parseErrors(errors))
      );
  }

  getUserWidgets() {
    if (this.userWidgets) {
      return of(this.userWidgets);
    }

    return this.http
      .get(Endpoints.UserDashboardModule, { params: this.params })
      .pipe(
        map((res: any) => {
          const userWidgets = res.results.map(el => {
            const widget = this.widgets.find(
              item => item.id === el.dashboard_module.id
            );

            const target = {
              id: el.id,
              widgetId: el.dashboard_module.id,
              name: widget.name,
              type: widget.type,
              tooltip: false,
              config: el.ui_config || {}
            };

            return target;
          });

          this.userWidgets = userWidgets;
          return userWidgets;
        }),
        catchError(errors => this.errorService.parseErrors(errors))
      );
  }

  getButtons() {
    return [
      {
        link: '/hr/jobs/',
        label: 'Jobs',
        description: 'Open full list of jobs',
        add_label: '+ Add new job',
        is_active: true
      },
      {
        link: '/core/companycontacts/',
        label: 'Client contacts',
        description: 'Open full list of client contacts',
        add_label: '+ Add new client contact',
        is_active: true
      },
      {
        link: '/core/companies/',
        label: 'Clients',
        description: 'Open full list of clients',
        add_label: '+ Add new client',
        is_active: true
      },
      {
        link: '/candidate/candidatecontacts/',
        label: 'Candidates',
        description: 'Open full list of candidates',
        add_label: '+ Add new candidate contact',
        is_active: true
      }
    ];
  }

  addWidget(widgetId: string, contactId: string, config: any = {}) {
    const body = {
      company_contact: contactId,
      dashboard_module: widgetId,
      position: 1,
      ui_config: config
    };

    return this.http
      .post(Endpoints.UserDashboardModule, body)
      .pipe(catchError(errors => this.errorService.parseErrors(errors)));
  }

  removeWidget(id: string) {
    return this.http
      .delete(`${Endpoints.UserDashboardModule}${id}/`)
      .pipe(catchError(errors => this.errorService.parseErrors(errors)));
  }

  updateWidget(id: string, body: { ui_config: any }) {
    return this.http
      .patch(`${Endpoints.UserDashboardModule}${id}/`, body)
      .pipe(catchError(errors => this.errorService.parseErrors(errors)));
  }

  generateGrid(widgets: UserWidget[]) {
    this.listsId = [];

    const grid = {
      type: GridElementType.Column,
      elements: []
    };

    widgets.forEach(widget => {
      const { coords, size } = widget.config;
      const widgetElement = {
        type: GridElementType.Widget,
        widget
      };

      this.generateGridElements(grid, widgetElement, coords);
    });

    return grid;
  }

  updateCoords(grid: GridElement) {
    const { elements, id } = grid;

    this.parseGrid(grid);
    this.updateElementsId(grid.elements, id);
  }

  getSizes(type: Type) {
    const sizes = {
      [Type.Buttons]: 4 / 12,
      [Type.Calendar]: 8 / 12,
      [Type.Candidates]: 4 / 12
    };

    return sizes[type];
  }

  updateDashboard() {
    this.userWidgets = undefined;
  }

  private parseGrid(gridElement: GridElement) {
    const { type, id } = gridElement;
    let { elements } = gridElement;

    if (type !== GridElementType.Widget) {
      elements = this.removeEmptyElements(gridElement);

      elements = this.checkMainColumnElements(type, elements, id);
      elements = this.checkOnSingleColumn(type, elements);
      elements = this.checkRowElements(type, elements);

      gridElement.elements = elements;
      elements = this.removeEmptyElements(gridElement);

      if (elements.length > 0) {
        elements.forEach(grid => this.parseGrid(grid));
      }
    }
  }

  private removeEmptyElements(element: GridElement) {
    return element.elements.filter(gridElement => {
      if (gridElement.type === GridElementType.Widget) {
        return true;
      }

      return gridElement.elements && gridElement.elements.length;
    });
  }

  private updateElementsId(elements: GridElement[], parentId?: string) {
    elements.forEach((el, index) => {
      if (el.type === GridElementType.Widget) {
        el.widget.config.coords = parentId;
        return;
      }

      Object.assign(el, { id: this.updateId(index, parentId) });

      this.updateElementsId(el.elements, el.id);
    });
  }

  private updateId(index: number | string, parentId: string) {
    return parentId ? parentId + index : index + '';
  }

  private checkMainColumnElements(
    type: GridElementType,
    elements: GridElement[],
    parentId?: string
  ): GridElement[] {
    if (type === GridElementType.Column && !parentId) {
      return elements.map((el, i) => {
        const id = i.toString();

        if (el.type === GridElementType.Widget) {
          return {
            id,
            type: GridElementType.Row,
            elements: [el]
          };
        }

        return { ...el, id };
      });
    }

    return elements;
  }

  private checkRowElements(
    type: GridElementType,
    elements: GridElement[]
  ): GridElement[] {
    if (type === GridElementType.Row && elements.length > 1) {
      return elements.map((el, i) => {
        const id = i.toString();
        if (el.type === GridElementType.Column) {
          return { ...el, id };
        }

        return {
          type: GridElementType.Column,
          elements: [el],
          id
        };
      });
    }

    return elements;
  }

  private checkOnSingleColumn(
    type: GridElementType,
    elements: GridElement[]
  ): GridElement[] {
    if (
      type === GridElementType.Row &&
      elements.length === 1 &&
      elements[0].type === GridElementType.Column
    ) {
      return elements[0].elements;
    }

    return elements;
  }

  private generateGridElements(
    gridElement: GridElement,
    widgetElement: GridElement,
    coords: string
  ) {
    const { elements, type, id } = gridElement;
    const index = coords.charAt(0);
    const newId = this.updateId(index, id);

    coords = coords.slice(1);
    this.listsId.push(newId);

    if (coords.length === 0 && type === GridElementType.Column) {
      elements[index] = {
        id: newId,
        type: GridElementType.Row,
        elements: [widgetElement]
      };

      return;
    }

    const newType =
      type === GridElementType.Row
        ? GridElementType.Column
        : GridElementType.Row;

    if (coords.length === 0) {
      elements[index] = {
        id: newId,
        type: newType,
        elements: [widgetElement]
      };
    } else if (coords.length) {
      const element = elements[index] || {
        id: newId,
        type: newType,
        elements: []
      };

      this.generateGridElements(element, widgetElement, coords);
      elements[index] = element;
    }
  }
}
