import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'webui-email-preview',
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailPreviewComponent implements AfterViewInit {
  template?: string;

  @ViewChild('iframe') iframe?: ElementRef<HTMLIFrameElement>;

  constructor(
    private modal: NgbActiveModal
  ) {}

  ngAfterViewInit(): void {
    const iframeElement = this.iframe?.nativeElement;

    if (!iframeElement) {
      return;
    }

    iframeElement.src = "about:blank";
    iframeElement.contentWindow?.document.open();
    iframeElement.contentWindow?.document.write(this.template || '');
  }

  onClose(): void {
    this.modal.close();
  }
}
