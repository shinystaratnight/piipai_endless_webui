import {
  Component,
  AfterViewInit,
  ViewChild,
  EventEmitter,
  ViewEncapsulation,
  Output
} from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

import { isMobile, getOrientation } from '../../helpers';

@Component({
  selector: 'app-signature',
  template: `<signature-pad *ngIf="show" [options]="signaturePadOptions" (onEndEvent)="drawComplete()"></signature-pad>`,
  styles: [`
    signature-pad canvas {
      border-radius: 4px;
      border: 1px solid #333;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class SignatureComponent implements AfterViewInit {

  show = true;

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  @Output()
  public signature: EventEmitter<string> = new EventEmitter();

  public signaturePadOptions: Object = this.generateParams();

  ngAfterViewInit() {

    this.clear();

    window.addEventListener('orientationchange', () => {
      this.show = false;
      this.signaturePadOptions = this.generateParams();
      setTimeout(() => {
        this.show = true;
      });
    });
  }

  generateParams() {
    return {
      'canvasWidth': isMobile() && getOrientation() !== 90 ? 309 : isMobile() ? 343 : 426,
      'canvasHeight': isMobile() && getOrientation() !== 90 ? 149 : isMobile() ? 165 : 208,
    };
  }

  clear() {
    this.signaturePad.clear();
  }

  drawComplete() {
    this.signature.emit(this.signaturePad.toDataURL());
  }
}
