import { Component, AfterViewInit, ViewChild, EventEmitter, ViewEncapsulation, Output, Input } from '@angular/core';

import { getOrientation } from '../../helpers';
import { isMobile } from '@webui/utilities';

@Component({
  selector: 'webui-signature',
  templateUrl: 'signature.component.html',
  styleUrls: ['signature.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignatureComponent implements AfterViewInit {
  show = true;

  @Input()
  public supervisorSignature!: string;

  @ViewChild('signaturePad', { static: false }) signatureElement: any;

  @Output()
  public signature: EventEmitter<string> = new EventEmitter();

  public signaturePadOptions: Record<string, any> = this.generateParams();

  ngAfterViewInit() {
    if (this.supervisorSignature) {
      this.toDataURL(this.supervisorSignature, this.getSignaturePad().fromDataURL.bind(this), 'image/png');
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
      canvasWidth: isMobile() && getOrientation() !== 90 ? 309 : isMobile() ? 309 : 426,
      canvasHeight: isMobile() && getOrientation() !== 90 ? 149 : isMobile() ? 149 : 208,
    };
  }

  clear() {
    if (this.getSignaturePad()) {
      this.getSignaturePad().clear();
    }
  }

  drawComplete() {
    if (this.getSignaturePad()) {
      this.signature.emit(this.getSignaturePad().toDataURL());
    }
  }

  toDataURL(src: string, callback: (data: string) => void, outputFormat?: string) {
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

  private getSignaturePad() {
    return this.signatureElement.signaturePad;
  }
}
