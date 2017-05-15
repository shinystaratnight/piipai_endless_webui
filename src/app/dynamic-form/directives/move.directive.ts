import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[move]',
})
export class MoveDirective {
  public elem: any;
  public offsetTop: any;
  public offsetLeft: any;

  @Input()
  private parent: any;
  private isMovable: boolean = false;

  private pos: any = { x: 0, y: 0 };

  constructor(
    private el: ElementRef
  ) {
    this.elem = el.nativeElement;
  }

  @HostListener('mousedown', ['$event'])
  private onMouseDown($event) {
    this.down();
  };

  @HostListener('document:mousemove', ['$event'])
  private onMouseMove($event) {
    this.move($event);
  };

  @HostListener('document:mouseup', ['$event'])
  private onMouseUp($event) {
    this.end();
  };

  @HostListener('touchstart')
  private onTouchStart() {
    this.down();
  };

  @HostListener('document:touchmove', ['$event'])
  private onToucMove($event) {
    this.move($event);
  };

  @HostListener('touchstart')
  private onTouchEnd() {
    this.end();
  };

  private updatePosition(x: number = 0, y: number = 0) {
      this.pos.x += x;
      this.pos.y += y;

      this.parent.style.left = (this.pos.x + this.offsetLeft) + 'px';
      this.parent.style.top = (this.pos.y + this.offsetTop) + 'px';
  }

  private down() {
    this.offsetTop = this.parent.offsetTop;
    this.offsetLeft = this.parent.offsetLeft;
    this.updatePosition();
    this.isMovable = true;
    this.elem.style.cursor = 'move';
  }

  private move($event) {
    if (!this.isMovable) {
      return;
    }
    this.updatePosition($event.movementX, $event.movementY);
  }

  private end() {
    this.isMovable = false;
    this.pos.x = 0;
    this.pos.y = 0;
    this.elem.style.cursor = 'default';
  }

}
