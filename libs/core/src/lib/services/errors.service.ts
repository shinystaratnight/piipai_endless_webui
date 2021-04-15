import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { of, throwError } from 'rxjs';

import { ToastService, MessageType } from './toast.service';

type ParseErrorOptions = {
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

@Injectable()
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

    console.log(response);

    if (showMessage) {
      this.showErrorMessage(error);
    }

    return close ? of([]) : throwError(error);
  }

  private showErrorMessage(error: Error, defaultMessage: string = '') {
    const { detail, non_field_errors } = error.errors;
    const message =
      detail || non_field_errors ? non_field_errors.join(' ') : defaultMessage;

    this.ts.sendMessage(message, MessageType.Error);
  }
}
