import {
  Directive,
  Input,
  AfterViewChecked,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appSlider]'
})
export class SliderDirective implements AfterViewChecked {
  public offset = 0;

  public eventListener = this.changePosition.bind(this);
  public move: boolean;
  public minusWidth = 23;
  public width = 0;

  @Input()
  public parentElement: HTMLElement;

  @Output()
  public position: EventEmitter<number> = new EventEmitter();

  private _width: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'move');
  }

  public ngAfterViewChecked() {
    this.width = this.parentElement.clientWidth;
  }

  @HostListener('mousedown', ['$event.target'])
  @HostListener('touchstart', ['$event.target'])
  public handleStarMove(target) {
    this.move = true;
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  public handleEndMove() {
    this.move = false;
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  public changePosition(e) {
    if (this.move) {
      const offset = e.clientX || e.targetTouches[0].clientX;

      if (!this.offset) {
        this.offset = offset;
      }

      if (offset < this.offset || offset > this.offset + this.width - this.minusWidth) {
        return;
      }

      let left = offset - this.offset;
      const emitValue = left / (this.width - this.minusWidth);

      left = (left / this.width) * 100;
      left = left < 0 ? 0 : left;

      this.renderer.setStyle(this.el.nativeElement, 'left', left + '%');
      this.position.emit(emitValue);
    }
  }
}
