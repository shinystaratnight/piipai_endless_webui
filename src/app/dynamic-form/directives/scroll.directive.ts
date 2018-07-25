import {
  Directive,
  HostListener,
  ElementRef,
  Input,
  Renderer,
  AfterViewInit
} from '@angular/core';

@Directive({
  selector: '[scroll]'
})
export class ScrollDirective implements AfterViewInit {

  public offsetTop: number;

  @Input() public enable: boolean;

  constructor(private el: ElementRef, public renderer: Renderer) {
    this.offsetTop = el.nativeElement.offsetTop;
  }

  public ngAfterViewInit() {
    this.offsetTop = this.el.nativeElement.offsetTop;
  }

  @HostListener('document:scroll') public onScroll() {
    if (this.enable) {
      const scrollTop = window.pageYOffset
       || document.documentElement.scrollTop
       || document.body.scrollTop || 0;

      if (scrollTop + 85 >= this.offsetTop) {
        this.renderer.setElementClass(this.el.nativeElement, 'scrolled', true);
      } else {
        this.renderer.setElementClass(this.el.nativeElement, 'scrolled', false);
      }
    }
  }

}
