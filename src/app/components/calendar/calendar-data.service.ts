import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { Endpoints } from '../../metadata/helpers';

export enum CalendarType {
  Manager,
  Client,
  Candidate
}

@Injectable()
export class CalendarDataService {
  private endpoints = {
    [CalendarType.Manager]: Endpoints.Shift,
    [CalendarType.Client]: `${Endpoints.Shift}client_contact_shifts/`,
    [CalendarType.Candidate]: `${Endpoints.Shift}candidate_contact_shifts/`
  };

  private timesheetEndpoints = {
    [CalendarType.Candidate]: Endpoints.TimesheetCandidate
  };

  constructor(
    private genericFormService: GenericFormService
  ) {}

  getShiftsByQuery(params: HttpParams, type: CalendarType) {
    return this.genericFormService.get(this.endpoints[type], params);
  }

  getCandidateAvailability(params: HttpParams) {
    return this.genericFormService.get(Endpoints.CarrierList, params);
  }

  getTimesheetInformation(params: HttpParams, type: CalendarType) {
    return this.genericFormService.get(this.timesheetEndpoints[type], params);
  }

  setAvailability(data: any) {
    return this.genericFormService.submitForm(Endpoints.CarrierList, data);
  }

  updateAvailable(id: boolean, data: any) {
    const endpoint = `${Endpoints.CarrierList}${id}/`;

    return this.genericFormService.editForm(endpoint, data);
  }
}
