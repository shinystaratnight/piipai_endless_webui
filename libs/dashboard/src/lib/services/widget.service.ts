import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ErrorsService } from '@webui/core';
import { Endpoints } from '@webui/data';

import { Type, Widget } from '../interfaces';
import { widgetsData } from '../helpers';

@Injectable()
export class WidgetService {
  widgets: Widget[];
  userWidgets: any[];

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

            this.addPosition(target.config, widget.type);
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

  //! remove this method
  private addPosition(config, type) {
    const positions = {
      [Type.Buttons]: '0.0',
      [Type.Calendar]: '1.1',
      [Type.Candidates]: '1.0'
    };

    const sizes = {
      [Type.Buttons]: 1,
      [Type.Calendar]: 8 / 12,
      [Type.Candidates]: 4 / 12
    };

    config.coords = positions[type];
    // config.size = sizes[type];
  }
}
