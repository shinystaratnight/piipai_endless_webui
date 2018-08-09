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
import { Subscription } from 'rxjs/Subscription';

import { BasicElementComponent } from './../basic-element/basic-element.component';

@Component({
  selector: 'form-picture',
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

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;
  public photoExist: boolean = false;
  public mime: string;
  public fileName: string = '';
  public onSuccess;
  public onError;
  public flashPlayer: any;
  public err: any;
  public base64: string;
  public link: string;

  public value: any;

  public viewMode: boolean;

  public contactAvatar: string;

  public options = {
    audio: false,
    video: true,
    width: 320,
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
    private cd: ChangeDetectorRef
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
    this.addControl(this.config, this.fb);
    this.mime = 'image/jpeg';
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.createEvent();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
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

        this.cd.detectChanges();
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
    if (this.config.value) {
      if (this.config.value instanceof Object && this.config.value.origin) {
        this.value = this.config.value.origin;
      } else if (typeof this.config.value === 'string') {
        let imageType = /^image\//;
        let pdfType = /pdf$/;
        if (pdfType.test(this.config.value)) {
          this.link = this.config.value;
        } else {
          this.value = this.config.value;
        }
      }
    }

    if (!this.value) {
      this.value = this.config.companyContact && this.config.key === 'logo' ? '/assets/img/logo.svg' : ''; //tslint:disable-line

      if (!this.value && this.config.contactName) {
        const nameElements = this.config.contactName.split(' ');

        if (nameElements && nameElements.length) {
          if (nameElements.length === 2) {
            this.contactAvatar = nameElements.map((el) => el[0]).join('').toUpperCase();
          } else if (nameElements.length === 3) {
            nameElements.shift();
            this.contactAvatar = nameElements.map((el) => el[0]).join('').toUpperCase();
          }
        }
      }
    }

    this.group.get(this.key).patchValue(undefined);
  }

  public ngAfterViewInit() {
    if (this.picture) {
      this.addFlags(this.picture, this.config);
    }
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
    this.modalService.open(this.modal, {size: 'lg'});
  }

  public getPhoto() {
    this.fileName = '';
    let canvas = this.createPhoto();
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
    let file = e.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = () => {
        let imageType = /^image\//;
        let pdfType = /pdf$/;

        if (!imageType.test(file.type) && !pdfType.test(file.type)) {
          return;
        }
        if (reader.result) {
          let name = file.name;
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
            let col = data.split(';');
            let tmp = null;

            for (let i = 0; i < w; i++) {
              tmp = parseInt(col[i], 10);
              externData.imgData.data[externData.pos + 0] = (tmp >> 16) & 0xff;
              externData.imgData.data[externData.pos + 1] = (tmp >> 8) & 0xff;
              externData.imgData.data[externData.pos + 2] = tmp & 0xff;
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

}
