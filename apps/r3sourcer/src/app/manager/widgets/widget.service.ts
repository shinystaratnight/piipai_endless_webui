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

    const params = new HttpParams({ fromObject: { limit: '-1' } });

    return this.http.get(Endpoints.DashboardModule, { params }).pipe(
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

    const params = new HttpParams({ fromObject: { limit: '-1' } });

    return this.getWidgets().pipe(
      mergeMap(widgets => {
        return this.http.get(Endpoints.UserDashboardModule, { params }).pipe(
          map((res: any) => {
            if (res.results) {
              const data = res.results.map(userWidget => {
                const widget = widgets.find(
                  el => el.id === userWidget.dashboard_module.id
                );
                const { module_data } = widget;

                const description =
                  module_data.description ||
                  'Open list with' + module_data.plural_name.toLowerCase();

                return {
                  ...userWidget,
                  ...module_data,
                  is_active: widget.is_active,
                  description
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
          const {
            id,
            contact,
            average_score,
            latest_state,
            skill_list,
            tag_list
          } = candidate;

          return {
            id,
            name: `${contact.first_name} ${contact.last_name}`,
            img: contact.picture.origin,
            contactAvatar: getContactAvatar(contact.__str__),
            score: average_score,
            state: latest_state[0],
            skills: skill_list.map(el => {
              return { name: el.skill.__str__, score: el.score };
            }),
            tags: tag_list.map(el => {
              return { name: el.tag.name };
            })
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
          const {
            id,
            candidate_scores,
            contact,
            favourite,
            hourly_rate,
            distance_to_jobsite,
            overpriced,
            tags
          } = candidate;

          return {
            score: candidate_scores.average_score,
            name: `${contact.first_name} ${contact.last_name}`,
            img: contact.picture && contact.picture.origin,
            contactAvatar: getContactAvatar(contact.__str__),
            scores: this.generateScores(candidate_scores),
            distance: distance_to_jobsite,
            id,
            favourite,
            hourly_rate,
            overpriced,
            tags
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

  private generateScores(scores: { [key: string]: string }) {
    const skillMap = {
      recruitment_score: 'Average test',
      client_feedback: 'Client feedback',
      skill_score: 'Average skills',
      reliability: 'Reliability',
      loyalty: 'Loyality'
    };

    return Object.keys(skillMap).map(key => {
      return {
        name: skillMap[key],
        score: scores[key] ? scores[key].split(' ')[0] : 0,
        count: scores[key] ? scores[key].split(' ')[1] : ''
      };
    });
  }
}
