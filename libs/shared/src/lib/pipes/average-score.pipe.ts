import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Pipe({
  name: 'averageScore'
})
export class AverageScorePipe implements PipeTransform {

  constructor(
    private decimalPipe: DecimalPipe,
    private translatePipe: TranslatePipe
  ) {}

  transform(value: number | string): number | string {
    if (value === 0 || !value) {
      return this.translatePipe.transform('no_rating');
    }

    const res = this.decimalPipe.transform(value, '1.1-1');

    return res;
  }

}
