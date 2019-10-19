import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map, catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ErrorsService } from '@webui/core';
import { Endpoints } from '@webui/data';
import { getContactAvatar } from '@webui/utilities';

@Injectable()
export class WidgetService {
  widgets: any[];
  userWidgets: any[];

  constructor(private http: HttpClient, private errorService: ErrorsService) {}

  getWidgets() {
    if (this.widgets) {
      return of(this.widgets);
    }

    return this.http.get(`${Endpoints.DashboardModule}?limit=-1`).pipe(
      map((res: any) => {
        if (res.results) {
          this.widgets = res.results;
          return this.widgets;
        }
      }),
      catchError(errors => this.errorService.parseErrors(errors))
    );
  }

  getUserWidgets() {
    if (this.userWidgets && this.userWidgets.length) {
      return of(this.userWidgets);
    }

    return this.getWidgets().pipe(
      mergeMap(widgets => {
        return this.http.get(`${Endpoints.UserDashboardModule}?limit=-1`).pipe(
          map((res: any) => {
            if (res.results) {
              const data = res.results.map(userWidget => {
                const widget = widgets.find(
                  el => el.id === userWidget.dashboard_module.id
                );

                return {
                  ...userWidget,
                  ...widget.module_data,
                  is_active: widget.is_active
                };
              });

              this.userWidgets = data;
              return this.userWidgets;
            }

            return [];
          })
        );
      }),
      catchError(errors => this.errorService.parseErrors(errors))
    );
  }

  getCandidates(query?: { [key: string]: any }) {
    const params = new HttpParams({ fromObject: query });

    return this.http.get(Endpoints.CandidateContact, { params }).pipe(
      map((response: { count: number; results: any[] }) => {
        const { results, count } = response;

        const candidates = results.map(candidate => {
          const { contact } = candidate;

          return {
            id: candidate.id,
            name: `${contact.first_name} ${contact.last_name}`,
            img: contact.picture.origin,
            contactAvatar: getContactAvatar(contact.__str__),
            score: candidate.average_score,
            skills: candidate.skill_list
          };
        });

        return { count, candidates };
      }),
      catchError(errors => this.errorService.parseErrors(errors))
    );
  }

  getFillinCandidates(jobId: string, query: { [key: string]: any } = {}) {
    const params = new HttpParams({ fromObject: query });

    return this.http.get(`${Endpoints.Job}${jobId}/fillin/`, { params }).pipe(
      map((response: { list: any[]; job: any }) => {
        const candidates = response.list;

        return candidates.map(candidate => {
          const { candidate_scores, contact } = candidate;

          return {
            id: candidate.id,
            score: candidate_scores.average_score,
            name: `${contact.first_name} ${contact.last_name}`,
            img: contact.picture && contact.picture.origin,
            contactAvatar: getContactAvatar(contact.__str__),
            favourite: candidate.favourite,
            hourly_rate: candidate.hourly_rate,
            distance_to_jobsite: candidate.distance_to_jobsite,
            overpriced: candidate.overpriced,
            tag_rels: candidate.tag_rels,
            skills: candidate.skill_list || []
          };
        });
      }),
      catchError(errors => this.errorService.parseErrors(errors))
    );
  }

  sendJobOffers(jobId: string, shift: string, candidates: any[]) {
    const body = {
      shifts: [shift],
      candidates
    };

    return this.http
      .post(`${Endpoints.Job}${jobId}/fillin/`, body)
      .pipe(catchError(errors => this.errorService.parseErrors(errors)));
  }
}
