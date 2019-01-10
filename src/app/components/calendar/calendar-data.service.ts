import { Injectable } from '@angular/core';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

@Injectable()
export class CalendarDataService {
  constructor(
    private genericFormService: GenericFormService
  ) {}

  getShiftsByDate(date: string, company?: string) {
    return this.genericFormService.getByQuery('/hr/shifts/', `?date__shift_date=${date}&limit=-1`);
  }
}
