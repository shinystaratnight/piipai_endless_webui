import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { Endpoints } from '../../metadata/helpers';

export enum Calendar {
  Manager,
  Client,
  Candidate
}

@Injectable()
export class CalendarDataService {
  private endpoints = {
    [Calendar.Manager]: Endpoints.Shift,
    [Calendar.Client]: `${Endpoints.Shift}client_contact_shifts/`
  };

  private timesheetEndpoints = {
    [Calendar.Candidate]: Endpoints.TimesheetCandidate
  };

  constructor(
    private genericFormService: GenericFormService
  ) {}

  getShiftsByQuery(params: HttpParams, type: Calendar) {
    return this.genericFormService.get(this.endpoints[type], params);
  }

  getCandidateAvailability(params: HttpParams) {
    return this.genericFormService.get(Endpoints.CarrierList, params);
  }

  getTimesheetInformation(params: HttpParams, type: Calendar) {
    return this.genericFormService.get(this.timesheetEndpoints[type], params);
  }

  getJobOffers(params: HttpParams) {
    return this.genericFormService.get(Endpoints.JobOfferCandidate, params);
  }

  setAvailability(data: any) {
    return this.genericFormService.submitForm(Endpoints.CarrierList, data);
  }

  declineJobOffer(id: string) {
    return this.genericFormService.submitForm(`${Endpoints.JobOffer}${id}/cancel/`, {});
  }

  acceptJobOffer(id: string) {
    return this.genericFormService.submitForm(`${Endpoints.JobOffer}${id}/accept/`, {});
  }

  updateAvailable(id: boolean, data: any) {
    const endpoint = `${Endpoints.CarrierList}${id}/`;

    return this.genericFormService.editForm(endpoint, data);
  }
}
