import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { metadata } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  get(endpoint: string, query: string) {
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
      } else if (query.includes('candidatepool')) {
        type = 'candidatepool';
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
      } else if (query.includes('filters')) {
        type = 'filters';
      } else {
        type = 'list';
      }

      const stringifyMetadata = JSON.stringify(metadata[endpoint][type]);

      return of(JSON.parse(stringifyMetadata));
    }
  }
}
