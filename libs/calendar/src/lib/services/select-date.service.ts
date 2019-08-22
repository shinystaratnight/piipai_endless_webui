import { Injectable } from '@angular/core';

import { getTimeInstance } from '@webui/utilities';

@Injectable()
export class SelectDateService {

  startDate: string;
  endDate: string;

  selectedDates = new Map();

  hasSelectedDates() {
    const values = this.selectedDates.values();

    return Array.from(values).some((value) => value);
  }

  isSelected(date: string) {
    const exist = this.selectedDates.has(date);

    return exist ? this.selectedDates.get(date) : false;
  }

  selectDate(date: string, value?: boolean) {
    const exist = this.selectedDates.has(date);

    if (exist && value === undefined) {
      this.selectedDates.set(date, !this.selectedDates.get(date))
    } else {
      this.selectedDates.set(date, true);
    }
  }

  startSelection(date: string) {
    this.startDate = date;
  }

  selectMore(date: string) {
    if (this.startDate) {
      this.endDate = date;

      const dates = this.betweenDates(this.startDate, this.endDate);

      dates.forEach((el) => {
        this.selectDate(el, true)
      });
    }
  }

  stopSelection() {
    this.startDate = null;
    this.endDate = null;
  }

  getSlectedDates() {
    const dates = [];
    this.selectedDates.forEach((val, key) => {
      if (val) {
        dates.push(key);
      }
    });

    if (dates.length) {
      return dates;
    }
  }

  clear() {
    this.selectedDates.clear();
  }

  private betweenDates(start: string, end: string) {
    const time = getTimeInstance();
    const startDate = time(start, 'YYYY-MM-DD');

    if (!end) {
      return [start];
    }

    const dates = [];
    const endDate = time(end, 'YYYY-MM-DD');
    while(endDate.isAfter(startDate)) {
      dates.push(startDate.format('YYYY-MM-DD'));

      startDate.add(1, 'day');
    }

    dates.push(end);

    return dates;
  }

}
