import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { getContactAvatar, isCandidate, isMobile } from '@webui/utilities';

@Component({
  selector: 'app-list-image',
  templateUrl: './list-image.component.html',
  styleUrls: ['./list-image.component.scss']
})

export class ListImageComponent implements OnInit {

  public config: any;
  public src: string;
  public icon: string;
  public iconClass: string;
  public last: boolean;
  public file: string;
  public contactAvatar: string;

  public isMobileDevice = isMobile() && isCandidate();

  @ViewChild('filelink', { static: false })
  public link: ElementRef<HTMLAnchorElement>;

  public ngOnInit() {
    if (this.config.type === 'picture') {
      this.src = (this.config.value && this.config.value.origin)
        ? this.config.value.origin : false;

      if (this.config.value && this.config.file === undefined) {
        this.file = this.config.value;
      }
    } else if (this.config.type === 'icon') {
      if (this.config.values) {
        this.icon = this.config.values[this.config.value];
        if (this.config.color) {
          this.getColor(this.config.value);
          return;
        }
        this.setClass(this.config.value);
      }
    }

    if (!this.src && this.config.contactName && !this.config.signature) {
      this.contactAvatar = getContactAvatar(this.config.contactName);
    }
  }

  public getColor(value) {
    this.iconClass = this.config.color[value] ? `text-${this.config.color[value]} mr-1` : 'text-muted mr-1';
  }

  public setClass(value) {
    this.iconClass = value === true ?
      'text-success' : value === false ?
      'text-danger' : 'text-muted';
  }

  public getExtension(link: string) {
    return link.split('.').pop();
  }

  public downloadFile() {
    this.link.nativeElement.click();
  }

  get emptyValue() {
    return !this.file && !this.src && !this.contactAvatar;
  }

}
