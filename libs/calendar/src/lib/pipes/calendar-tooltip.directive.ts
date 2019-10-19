import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[appCalendarTooltip]'
})
export class CalendarTooltipDirective implements OnChanges {
  private initialTop: string;

  @Input()
  active: boolean;

  constructor(private el: ElementRef, public renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    const active = changes.active;
    if (!active.isFirstChange() && !active.currentValue) {
      this.hideTooltip();
    }
  }

  @HostListener('mouseenter')
  private hoverListener() {
    this.showTooltip();
  }

  @HostListener('mouseleave')
  private leaveListener() {
    if (!this.active) {
      this.hideTooltip();
    }
  }

  private hideTooltip() {
    const el = this.el.nativeElement;

    this.renderer.removeStyle(el, 'width');
    this.renderer.setStyle(el, 'top', this.initialTop);
    this.renderer.setStyle(el, 'z-index', 0);
    this.renderer.removeStyle(el, 'bottom');
    this.renderer.removeStyle(el, 'left');

    this.renderer.removeClass(el, 'left');
  }

  private showTooltip() {
    const el = this.el.nativeElement;

    const sizes = this.getSizes(el);
    this.initialTop = sizes.top + 'px';

    this.renderer.setStyle(el, 'width', sizes.width + 'px');
    this.renderer.setStyle(el, 'z-index', 2);

    if (sizes.containerHeight - sizes.top < sizes.height) {
      this.renderer.setStyle(el, 'top', 'auto');
      this.renderer.setStyle(el, 'bottom', '0');
    }

    if (sizes.containerWidth - sizes.left < sizes.width) {
      this.renderer.addClass(el, 'left');
      this.renderer.setStyle(
        el,
        'left',
        -sizes.width + sizes.collapseLeft + 6 + 'px'
      );
    }
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
