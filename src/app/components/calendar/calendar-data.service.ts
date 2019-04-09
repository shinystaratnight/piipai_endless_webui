import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

@Injectable()
export class CalendarDataService {
  constructor(
    private genericFormService: GenericFormService
  ) {}

  getShiftsByQuery(params: HttpParams) {
    return this.genericFormService.get('/hr/shifts/', params);
  }
}
