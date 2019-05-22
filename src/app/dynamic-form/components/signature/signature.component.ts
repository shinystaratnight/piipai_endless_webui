import {
  Component,
  AfterViewInit,
  ViewChild,
  EventEmitter,
  ViewEncapsulation,
  Output
} from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

import { isMobile } from '../../helpers';

@Component({
  selector: 'app-signature',
  template: `<signature-pad [options]="signaturePadOptions" (onEndEvent)="drawComplete()"></signature-pad>`,
  styles: [`
    signature-pad canvas {
      border-radius: 4px;
      border: 1px solid #333;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class SignatureComponent implements AfterViewInit {

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  @Output()
  public signature: EventEmitter<string> = new EventEmitter();

  public signaturePadOptions: Object = {
    'canvasWidth': isMobile() ? 309 : 426,
    'canvasHeight': isMobile() ? 149 : 208,
  };

  ngAfterViewInit() {
    this.clear();
  }

  clear() {
    this.signaturePad.clear();
  }

  drawComplete() {
    this.signature.emit(this.signaturePad.toDataURL());
  }
}
