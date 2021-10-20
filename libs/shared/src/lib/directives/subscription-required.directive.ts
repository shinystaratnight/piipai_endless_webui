import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy, OnInit, Optional, Renderer2, TemplateRef } from '@angular/core';
import { SubscriptionService } from '@webui/core';
import { FakeMissingTranslationHandler, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { RouterLink, RouterLinkWithHref } from '@angular/router';

@Directive({
  selector: '[appSubscriptionRequired]'
})
export class SubscriptionRequiredDirective implements OnInit, OnDestroy, AfterViewInit {

  private _destroy: Subject<void> = new Subject();
  private disabled: boolean;

  constructor(
    private subscriptionService: SubscriptionService,
    private el: ElementRef,
    private renderer: Renderer2,
    private translateService: TranslateService,
    @Optional() routerLink: RouterLink,
    @Optional() routerLinkWithHref: RouterLinkWithHref
  ) {
    const link =  routerLink || routerLinkWithHref;

    // Save original method
    const onClick = link.onClick;

    // Replace method
    link.onClick = (...args) => {
      if (this.disabled) {
          return routerLinkWithHref ? false : true;
      } else {
          return onClick.apply(link, args);
      }
    };
  }

  public ngOnInit() {
  }

  public ngAfterViewInit() {
    this.subscribe();
  }

  public ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  private subscribe(): void  {
    this.subscriptionService.activePlan$.subscribe((subscription) => {
      if (!subscription) {
        this.disabled = true;
        this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'disabled');
        this.renderer.addClass(this.el.nativeElement, 'disabled');

        if (this.el.nativeElement instanceof HTMLAnchorElement) {
          this.renderer.setAttribute(this.el.nativeElement, 'href', '#');
        }
      }
    });
  }

  @HostListener('mouseover', ['$event']) onHover(event: PointerEvent) {
    if (this.disabled) {
      this.renderer.setAttribute(
        this.el.nativeElement,
        'title',
        this.translateService.instant('should_have_subscription')
      );
    }
  }
}
