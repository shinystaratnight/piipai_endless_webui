import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FallbackDispatcher } from 'ng2-webcam';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BasicElementComponent } from './../basic-element/basic-element.component';

@Component({
  selector: 'form-picture',
  templateUrl: 'form-picture.component.html'
})

export class FormPictureComponent extends BasicElementComponent implements OnInit, AfterViewInit {

  @ViewChild('modal')
  public modal;

  @ViewChild('picture')
  public picture;

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

  public value: any;

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

  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    private element: ElementRef
  ) {
    super();
    this.onSuccess = (stream: any) => {
      if (stream instanceof FallbackDispatcher) {
        this.flashPlayer = <FallbackDispatcher> stream;
        this.onFallback();
      }
    };
    this.onError = (err) => {
      this.err = err;
    };
  }

  public ngOnInit(): void {
    this.addControl(this.config, this.fb);
    this.mime = 'image/jpeg';
    if (this.config.default) {
      this.value = this.config.default;
      if (this.config.value && this.config.value.thumb) {
        this.value = this.config.value.origin;
      }
    }
  }

  public ngAfterViewInit() {
    this.addFlags(this.picture, this.config);
  }

  public upload(): void {
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
      this.updateValue('image.jpeg', this.base64);
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
    this.updateValue('', '');
    let file = e.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = () => {
        let imageType = /^image\//;

        if (!imageType.test(file.type)) {
          return;
        }
        if (reader.result) {
          let name = file.name;
          this.updateValue(name, reader.result);
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

  public updateValue(name, value) {
    this.fileName = name;
    this.value = value;
    this.group.get(this.key).patchValue(value);
  }

}
