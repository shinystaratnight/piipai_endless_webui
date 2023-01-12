import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ErrorsService } from './errors.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private errors: ErrorsService) {}

  post<R, B>(endpoint: string, body: B) {
    return this.http
      .post<R>(endpoint, body)
      .pipe(catchError((error: any) => this.errors.handleError(error)));
  }

  put<R, B>(endpoint: string, body: B) {
    return this.http
      .put<R>(endpoint, body)
      .pipe(catchError((error: any) => this.errors.handleError(error)));
  }
}
