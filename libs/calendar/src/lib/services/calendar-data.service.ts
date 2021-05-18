import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';

import { Endpoints } from '@webui/data';
import { catchError } from 'rxjs/operators';
import { ErrorsService } from '@webui/core';

export enum Calendar {
  Manager,
  Client,
  Candidate
}

@Injectable()
export class CalendarDataService {
  private endpoints = {
    [Calendar.Manager]: Endpoints.Shift,
    [Calendar.Client]: `${Endpoints.Shift}client_contact_shifts/`,
  };

  private timesheetEndpoints = {
    [Calendar.Candidate]: Endpoints.TimesheetCandidate
  };

  constructor(
    private http: HttpClient,
    private errorsService: ErrorsService
  ) {}

  getShiftsByQuery(params: HttpParams, type: Calendar) {
    return this.http.get(this.endpoints[type], { params })
      .pipe(catchError((errors) => this.errorsService.handleError(errors)));
  }

  getShiftDate(id: string) {
    return this.http.get(`${Endpoints.ShiftDate}${id}/`)
      .pipe(catchError((errors) => this.errorsService.handleError(errors)));
  }

  getCandidateAvailability(params: HttpParams) {
    return this.http.get(Endpoints.CarrierList, { params })
      .pipe(catchError((errors) => this.errorsService.handleError(errors)));;
  }

  getTimesheetInformation(params: HttpParams, type: Calendar) {
    return this.http.get(this.timesheetEndpoints[type], { params })
      .pipe(catchError((errors) => this.errorsService.handleError(errors)));;
  }

  getJobOffers(params: HttpParams) {
    return this.http.get(Endpoints.JobOfferCandidate, { params })
      .pipe(catchError((errors) => this.errorsService.handleError(errors)));;
  }

  setAvailability(data: any) {
    return this.http.post(Endpoints.CarrierList, data)
      .pipe(catchError((errors) => this.errorsService.handleError(errors)));;
  }

  declineJobOffer(id: string) {
    return this.http.post(`${Endpoints.JobOffer}${id}/cancel/`, {})
      .pipe(catchError((errors) => this.errorsService.handleError(errors)));;
  }

  acceptJobOffer(id: string) {
    return this.http.post(`${Endpoints.JobOffer}${id}/accept/`, {})
      .pipe(catchError((errors) => this.errorsService.handleError(errors)));;
  }

  updateAvailable(id: boolean, data: any) {
    const endpoint = `${Endpoints.CarrierList}${id}/`;

    return this.http.put(endpoint, data)
      .pipe(catchError((errors) => this.errorsService.handleError(errors)));;
  }
}
