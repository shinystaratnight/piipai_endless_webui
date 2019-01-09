import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private wekFormat = 'MMM Do';
  private monthFormat = 'MMMM YYYY';
  private dayFormat = 'MMMM Do YYYY';

  public getFormatMonth(date: any) {
    return date.format(this.monthFormat);
  }

}
