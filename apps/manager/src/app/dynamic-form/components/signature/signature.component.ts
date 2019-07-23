import {
  Component,
  AfterViewInit,
  ViewChild,
  EventEmitter,
  ViewEncapsulation,
  Output,
  Input
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

  @Input()
  public supervisorSignature: string;

  @ViewChild(SignaturePad, { static: false }) signaturePad: SignaturePad;

  @Output()
  public signature: EventEmitter<string> = new EventEmitter();

  public signaturePadOptions: Object = this.generateParams();

  ngAfterViewInit() {
    if (this.supervisorSignature) {
      this.toDataURL(this.supervisorSignature, this.signaturePad.fromDataURL.bind(this), 'image/png');
    }

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

  toDataURL(src, callback, outputFormat?) {
    const img = new Image();
    img.src = src;
    img.onload = (e) => {
      const canvas: any = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = this.generateParams().canvasHeight;
      canvas.width = this.generateParams().canvasWidth;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
    };
  }
}
