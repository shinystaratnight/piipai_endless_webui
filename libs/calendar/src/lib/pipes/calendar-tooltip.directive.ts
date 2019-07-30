import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appCalendarTooltip]'
})
export class CalendarTooltipDirective {
  private initialTop: string;

  constructor(
    private el: ElementRef,
    public renderer: Renderer2
  ) {}

  @HostListener('mouseenter')
  private hoverListener() {
    const el = this.el.nativeElement;

    const sizes = this.getSizes(el);
    this.initialTop = sizes.top + 'px';

    this.renderer.setStyle(el, 'width', sizes.width + 'px');

    if (sizes.containerHeight - sizes.top < sizes.height) {
      this.renderer.setStyle(el, 'top', 'auto');
      this.renderer.setStyle(el, 'bottom', '0');
    }

    if (sizes.containerWidth - sizes.left < sizes.width) {
      this.renderer.addClass(el, 'left');
      this.renderer.setStyle(el, 'left', - sizes.width + sizes.collapseLeft + 6 + 'px');
    }
  }

  @HostListener('mouseleave')
  private leaveListener() {
    const el = this.el.nativeElement;

    this.renderer.setStyle(el, 'width', undefined);
    this.renderer.setStyle(el, 'top', this.initialTop);
    this.renderer.setStyle(el, 'bottom', undefined);
    this.renderer.setStyle(el, 'left', undefined);
  }

  private getSizes(el) {
    return {
      containerHeight: el.parentElement.offsetHeight,
      containerWidth: el.parentElement.parentElement.offsetWidth,
      height: el.offsetHeight,
      top: el.offsetTop,
      left: el.parentElement.offsetLeft,
      collapseLeft: el.offsetLeft,
      width: 250
    };
  }
}

