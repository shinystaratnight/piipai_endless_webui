import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AverageScoreColor } from '@webui/data';

@Directive({
  selector: '[appAverageScore]'
})
export class AverageScoreDirective implements OnInit {

  @Input() appAverageScore: number | string;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  public ngOnInit(): void {
    let score = this.appAverageScore || 0;

    if (typeof this.appAverageScore === 'string') {
      score = Math.floor(parseFloat(this.appAverageScore));
    }

    this.renderer.setStyle(this.elementRef.nativeElement, 'color', AverageScoreColor[score]);
  }

}
