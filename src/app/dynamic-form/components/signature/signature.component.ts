import {
  Component,
  AfterViewInit,
  ViewChild,
  EventEmitter,
  ViewEncapsulation,
  Output
} from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

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

  public signaturePadOptions: Object = {};

  ngAfterViewInit() {
    this.signaturePad.clear();
  }

  clear() {
    this.signaturePad.clear();
  }

  drawComplete() {
    this.signature.emit(this.signaturePad.toDataURL());
  }
}
