import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { ErrorsService } from '../../shared/services/errors.service';
import { metadata } from '../../metadata';

@Injectable()
export class GenericFormService {
  constructor(
    private http: HttpClient,
    private errors: ErrorsService
  ) {}

  get(endpoint, params = {}) {
    const options = {
      params: new HttpParams({ fromObject: params})
    };

    return this.http.get(endpoint, options);
  }

  public getByQuery(endpoint, query): any {
    return this.http
      .get(`${endpoint}${query}`)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public getAll(endpoint): any {
    return this.http
      .get(endpoint)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public getMetadata(endpoint, query = ''): any {
    if (endpoint.includes('/submit/')) {
      endpoint = 'submit';
    }

    if (endpoint.includes('/evaluate')) {
      endpoint = 'evaluate';
    }

    if (endpoint.includes('/not_agree')) {
      endpoint = 'not_agree';
    }

    if (endpoint.includes('/extend')) {
      endpoint = 'extend';
    }

    if (endpoint.includes('/fillin')) {
      endpoint = 'fillin';
    }

    if (endpoint.includes('/candidate_fill')) {
      endpoint = 'candidateFill';
    }

    if (endpoint.includes('/supervisor_approve')) {
      endpoint = 'supervisorApprove';
    }

    if (endpoint.includes('/profile')) {
      endpoint = 'profile';
    }

    if (endpoint.includes('/change_password/')) {
      endpoint = 'change_password';
    }

    if (endpoint.includes('/password/')) {
      endpoint = 'password';
    }

    if (metadata[endpoint]) {
      let type = '';

      if (query.includes('formadd')) {
        type = 'formadd';
        if (query.includes('job')) {
          type = 'jobAdd';
        }

        if (query.includes('contact')) {
          type = 'contact';
        }
      } else if (query.includes('pricelist')) {
        if (query.includes('form')) {
          type = 'pricelistForm';
        }
        if (query.includes('formset')) {
          type = 'pricelist';
        }
      } else if (query.includes('company')) {
        type = 'company';
      } else if (query.includes('supervisor')) {
        type = 'supervisor';
      } else if (query.includes('profile')) {
        type = 'profile';
      } else if (query.includes('job')) {
        if (query.includes('form')) {
          type = 'form';
        }
        if (query.includes('formset')) {
          type = 'job';
        }
      } else if (query.includes('shift_date')) {
        if (query.includes('formset')) {
          type = 'shiftDate';
        } else {
          type = 'editShiftDate';
        }
      } else if (query.includes('extend')) {
        type = 'extend';
      } else if (query.includes('sent')) {
        type = 'sent';
      } else if (query.includes('reply')) {
        type = 'reply';
      } else if (query.includes('formset')) {
        type = 'formset';
      } else if (query.includes('form')) {
        type = 'form';
      } else {
        type = 'list';
      }

      const stringifyMetadata = JSON.stringify(metadata[endpoint][type]);

      return of(JSON.parse(stringifyMetadata));
    }

    return this.http
      .options(`${endpoint}${query}`)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public submitForm(endpoint, data): any {
    return this.http
      .post(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public editForm(endpoint, data): any {
    return this.http
      .put(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public updateForm(endpoint, data): any {
    return this.http
      .patch(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public callAction(endpoint, data): any {
    return this.http
      .post(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public delete(endpoint, id, postfix?): any {
    return this.http
      .delete(`${endpoint}${id}/` + (postfix ? `${postfix}/` : ''))
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }
}
