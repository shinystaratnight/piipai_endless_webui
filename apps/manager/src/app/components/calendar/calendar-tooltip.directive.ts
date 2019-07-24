import {
  Directive,
  ElementRef,
  Renderer,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[appCalendarTooltip]'
})
export class CalendarTooltipDirective {
  private initialTop: string;

  constructor(
    private el: ElementRef,
    public renderer: Renderer
  ) {}

  @HostListener('mouseenter')
  private hoverListener() {
    const el = this.el.nativeElement;

    const sizes = this.getSizes(el);
    this.initialTop = sizes.top + 'px';

    this.renderer.setElementStyle(el, 'width', sizes.width + 'px');

    if (sizes.containerHeight - sizes.top < sizes.height) {
      this.renderer.setElementStyle(el, 'top', 'auto');
      this.renderer.setElementStyle(el, 'bottom', '0');
    }

    if (sizes.containerWidth - sizes.left < sizes.width) {
      this.renderer.setElementClass(el, 'left', true);
      this.renderer.setElementStyle(el, 'left', - sizes.width + sizes.collapseLeft + 6 + 'px');
    }
  }

  @HostListener('mouseleave')
  private leaveListener() {
    const el = this.el.nativeElement;

    this.renderer.setElementStyle(el, 'width', undefined);
    this.renderer.setElementStyle(el, 'top', this.initialTop);
    this.renderer.setElementStyle(el, 'bottom', undefined);
    this.renderer.setElementStyle(el, 'left', undefined);
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

