import {
  Directive,
  Input,
  HostListener,
} from '@angular/core';

import { SelectDateService } from '../services';

@Directive({
  selector: '[appSelectDate]',
})
export class SelectDateDirective {

  @Input() disable: boolean;
  @Input() date: string;

  constructor(
    private service: SelectDateService
  ) { }

  @HostListener('click')
  clickHandler() {
    if (!this.disable) {
      this.service.selectDate(this.date);
    }
  }

  @HostListener('mousedown')
  mouseDownHandler() {
    if (!this.disable) {
      this.service.startSelection(this.date);
    }
  }

  @HostListener('document:mouseup')
  mouseUpHandler() {
    if (!this.disable) {
      this.service.stopSelection();
    }
  }

  @HostListener('mouseover')
  mouseEntetHandler() {
    if (!this.disable) {
      this.service.selectMore(this.date);
    }
  }
}
