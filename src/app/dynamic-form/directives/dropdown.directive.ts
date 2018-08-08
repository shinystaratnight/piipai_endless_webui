import {
  Directive,
  ElementRef,
  Renderer,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[dropDown]'
})
export class DropdownDirective implements OnInit, OnDestroy {

  @Input() public element: any;
  @Input() public target: any;
  @Input() public update: Subject<any>;

  public top: string;
  public dropDownElement: any;
  public scrollHeight: number;
  public subscription: Subscription;

  constructor(
    private el: ElementRef,
    public renderer: Renderer
  ) {}

  public ngOnInit() {
    this.subscription = this.update.subscribe(() => {
      setTimeout(() => {
        this.updatePosition();
      }, 10);
    });
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public setPosition(el: any, dropDown: any) {
    const dropDownHeight = dropDown.offsetHeight;
    const elOffsetTop = el.offsetTop + el.offsetParent.offsetTop;

    const parent = this.getParent(el);
    const bottomHeight = this.getBottomHeight(elOffsetTop, 48, parent);

    if ((dropDownHeight > bottomHeight) && (elOffsetTop > dropDownHeight)) {
      this.renderer.setElementStyle(dropDown, 'top', `-${dropDownHeight + 14}px`);
    } else {
      this.renderer.setElementStyle(this.dropDownElement, 'top', this.top);
    }

  }

  public getTop() {
    if (!this.top) {
      const element = this.getElement(this.element);
      const styles = window.getComputedStyle(element);

      this.top = styles.top;
    }
  }

  public updatePosition() {
    this.dropDownElement = this.getElement(this.element);

    if (this.dropDownElement) {
      this.getTop();

      this.setPosition(this.el.nativeElement, this.dropDownElement);
    }
  }

  public getBottomHeight(offsetTop: number, height: number, parent: any) {
    let scrollTop = parent.scrollTop;
    let viewport = parent.clientHeight;

    if (parent.classList.contains('r3sourcer')) {
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      viewport = window.innerHeight;
    }

    const topHeight = offsetTop - scrollTop;

    return viewport - topHeight - height;
  }

  public getElement(element: string) {
    if (this.target) {
      return this.target.parentNode.querySelector(this.element);
    } else {
      return this.el.nativeElement.querySelector(this.element);
    }
  }

  public getParent(el: any) {
    let parent;
    let testParent = el;
    if (el) {
      do {
        if (
          testParent.classList
          && (
            testParent.classList.contains('modal-content')
            || testParent.classList.contains('r3sourcer')
          )
        ) {
          parent = testParent;
        }
        testParent = testParent.offsetParent;
      } while (testParent && !parent);
    }

    return parent;
  }

}
