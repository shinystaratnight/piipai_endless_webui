import {
  Component,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit,
  ElementRef,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FallbackDispatcher } from '../webcam/fallback.dispatcher';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { BasicElementComponent } from './../basic-element/basic-element.component';
import { getContactAvatar } from '../../../helpers/utils';

import { FormService } from '../../services';

@Component({
  selector: 'app-form-picture',
  templateUrl: 'form-picture.component.html',
  styleUrls: ['./form-picture.component.scss'],
})

export class FormPictureComponent
  extends BasicElementComponent
  implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('modal')
  public modal;

  @ViewChild('picture')
  public picture;

  @ViewChild('dropzone')
  public dropzone;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;
  public photoExist = false;
  public mime: string;
  public fileName = '';
  public onSuccess;
  public onError;
  public flashPlayer: any;
  public err: any;
  public base64: string;
  public link: string;
  public sizeError: string;

  public value: any;

  public viewMode: boolean;

  public contactAvatar: string;

  public options = {
    audio: false,
    video: true,
    width: 240,
    height: 240,
    fallbackMode: 'callback',
    fallbackSrc: 'assets/jscam_canvas_only.swf',
    fallbackQuality: 85,
    cameraType: 'front'
  };

  private subscriptions: Subscription[];

  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    private element: ElementRef,
    private cd: ChangeDetectorRef,
    private formService: FormService,
  ) {
    super();
    this.onSuccess = (stream: any) => {
      if (stream instanceof FallbackDispatcher) {
        this.flashPlayer = stream;
        this.onFallback();
      }
    };
    this.onError = (err) => {
      this.err = err;
    };
    this.subscriptions = [];
  }

  public ngOnInit(): void {
    this.addControl(this.config, this.fb, this.config.templateOptions.required);
    this.mime = 'image/jpeg';
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.createEvent();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());

    if (this.dropzone) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((event) => {
        this.dropzone.nativeElement.removeEventListener(event, this.stopEvent, false);
      });

      this.dropzone.nativeElement.removeEventListener('drop', this.handleDrop, false);
    }
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden) {
      const subscription = this.config.hidden.subscribe((hide) => {
        if (hide) {
          this.config.hide = hide;
          this.group.get(this.key).patchValue(undefined);
          this.setInitValue();
        } else {
          this.config.hide = hide;
        }

        if (!(<any> this.cd).destroyed) {
          this.cd.detectChanges();
        }
      });

      this.subscriptions.push(subscription);
    }
  }

  public checkModeProperty() {
    if (this.config && this.config.mode) {
      const subscription = this.config.mode.subscribe((mode) => {
        if (mode === 'view') {
          this.viewMode = true;
        } else {
          this.viewMode = this.config.read_only || false;
        }
        this.setInitValue();
      });

      this.subscriptions.push(subscription);
    }
  }

  public setInitValue() {
    if (this.config.value || this.group.get(this.key).value) {
      this.config.value = this.config.value || this.group.get(this.key).value;
      if (this.config.value instanceof Object && this.config.value.origin) {
        this.value = this.config.value.origin;
      } else if (typeof this.config.value === 'string') {
        const imageType = /^image\//;
        const pdfType = /pdf$/;
        if (pdfType.test(this.config.value)) {
          this.link = this.config.value;
        } else {
          this.value = this.config.value;
        }
      }
    }

    if (!this.value) {
      this.value = this.config.companyContact && this.config.key === 'logo' ? '/assets/img/logo.svg' : '';

      if (!this.value && this.config.contactName) {
        this.contactAvatar = getContactAvatar(this.config.contactName);
      }
    }

    this.group.get(this.key).patchValue(undefined);

    if (this.config.value && (typeof this.config.value === 'string') && this.config.value.indexOf('data:image') > -1) {
      this.value = this.config.value;
      this.group.get(this.key).patchValue(this.config.value);
    }
  }

  public ngAfterViewInit() {
    if (this.picture) {
      this.addFlags(this.picture, this.config);
    }

    if (this.dropzone) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((event) => {
        this.dropzone.nativeElement.addEventListener(event, this.stopEvent, false);
      });

      this.dropzone.nativeElement.addEventListener('drop', this.handleDrop.bind(this), false);
    }
  }

  public stopEvent(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    return false;
  }

  public upload(e): void {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.picture.nativeElement.click();
  }

  public open(): void {
    this.photoExist = false;
    this.modalService.open(this.modal, { windowClass: 'medium-modal' });
  }

  public getPhoto() {
    this.fileName = '';
    const canvas = this.createPhoto();
    this.base64 = canvas.toDataURL(this.mime);
  }

  public save(closeModal) {
    if (this.base64) {
      this.updateValue('image.jpeg', this.base64, true);
      closeModal();
    }
  }

  public createPhoto() {
    this.photoExist = true;
    const video = <any> document.getElementsByTagName('video')[0];
    const canvas = <any> document.getElementsByTagName('canvas')[0];
    if (video) {
      canvas.style.maxWidth = `100%`;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
    } else {
      this.flashPlayer.capture();
    }
    return canvas;
  }

  public fileChangeEvent(e) {
    this.updateValue('', '', true);
    const file = e.target.files[0];

    if (file.size > 900000) {
      this.formService.disableSaveButton(this.config.formId, true);
      this.sizeError = 'File size is too large! Maximum allowed file size is 900kb.';
    } else {
      this.sizeError = '';
      this.formService.disableSaveButton(this.config.formId, false);
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageType = /^image\//;
        const pdfType = /pdf$/;

        if (!imageType.test(file.type) && !pdfType.test(file.type)) {
          return;
        }
        if (reader.result) {
          const name = file.name;
          this.updateValue(name, reader.result, imageType.test(file.type));
        }
      };
      reader.readAsDataURL(file);
    }
  }

  public onFallback(): void {
    const self = this;
    const canvas = <any> document.getElementsByTagName('canvas')[0];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const size = self.flashPlayer.getCameraSize();
      const w = size.width;
      const h = size.height;
      const externData = {
        imgData: ctx.getImageData(0, 0, w, h),
        pos: 0
      };

      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      FallbackDispatcher.implementExternal({
        onSave: (data) => {
          try {
            const col = data.split(';');
            let tmp = null;

            for (let i = 0; i < w; i++) {
              tmp = parseInt(col[i], 10);
              externData.imgData.data[externData.pos + 0] = (tmp >> 16) & 0xff; //tslint:disable-line
              externData.imgData.data[externData.pos + 1] = (tmp >> 8) & 0xff; //tslint:disable-line
              externData.imgData.data[externData.pos + 2] = tmp & 0xff; //tslint:disable-line
              externData.imgData.data[externData.pos + 3] = 0xff;
              externData.pos += 4;
            }

            if (externData.pos >= 4 * w * h) {
              ctx.putImageData(externData.imgData, 0, 0);
              externData.pos = 0;
            }
          } catch (e) {
            console.error(e);
          }

        },
        debug: (tag, message): void => {
          // do nothing
        },
        onCapture: () => {
          self.flashPlayer.save();
        },
        onTick: (time) => {
          // do nothing
        }
      });
    }
  }

  public updateValue(name, value, image = false) {
    this.fileName = name;
    if (image) {
      this.value = value;
    }
    this.group.get(this.key).patchValue(value);
    this.event.emit({
      type: 'changeImage'
    });
  }

  public getExtension(link: string) {
    return link.split('.').pop();
  }

  handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    this.fileChangeEvent({target: {files}});
  }

}
