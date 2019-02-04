import { Directive, HostListener, ElementRef } from '@angular/core';

import { isMobile } from '../../helpers';

@Directive({
  selector: '[appInputFocus]'
})
export class InputFocusDirective {

  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  @HostListener('touchstart', ['$event'])
  public clickHandler() {
    if (isMobile()) {
      setTimeout(() => {
        this.el.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 500);
    }
  }
}
