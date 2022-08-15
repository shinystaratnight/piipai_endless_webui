import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { of, throwError } from 'rxjs';

import { ToastService, MessageType } from './toast.service';

export type ParseErrorOptions = {
  close?: boolean;
  showMessage?: boolean;
};

type Error = {
  status: string;
  errors: {
    detail?: string;
    non_field_errors?: string[];
    [key: string]: any;
  };
};

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {
  constructor(private ts: ToastService) {}

  public handleError(
    response: HttpErrorResponse,
    { close = false, showMessage = false }: ParseErrorOptions = {}
  ) {
    const { status, error } = response;

    switch (status) {
      case 500: {
        this.showErrorMessage(error, 'Server error');
        break;
      }

      case 403: {
        this.showErrorMessage(error);

        return throwError(error);
      }
    }

    if (showMessage) {
      this.showErrorMessage(error);
    }

    return close ? of(<any>[]) : throwError(error);
  }

  private showErrorMessage(error: Error, defaultMessage: string = '') {
    const { detail, non_field_errors, message, ...fields } = error.errors;
    let text =
      detail ||
      message ||
      (non_field_errors ? non_field_errors.join(' ') : defaultMessage);

    Object.keys(fields).forEach((key: string) => (text += ` ${fields[key]}.`));

    this.ts.sendMessage(message, MessageType.Error);
  }
}
