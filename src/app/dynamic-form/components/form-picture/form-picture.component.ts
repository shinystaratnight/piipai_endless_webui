import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  @ViewChild('video')
  public video;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public photoExist: boolean = false;
  public modalOpen: boolean = false;
  public mime: string;
  public file: any;

  public err: any;

  public options = {
    audio: true,
    video: true,
    width: 320,
    height: 240,
    fallbackMode: 'callback',
    fallbackSrc: '/node_modules/ack-angular-webcam/jscam_canvas_only.swf',
    fallbackQuality: 85,
    cameraType: 'front'
  };

  public webcam;
  public base64;

  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    private element: ElementRef
  ) { super(); }

  public ngOnInit(): void {
    this.addControl(this.config, this.fb);
    this.mime = 'image/jpeg';
  }

  public ngAfterViewInit() {
    this.addFlags(this.picture, this.config);
  }

  public upload(): void {
    this.picture.nativeElement.click();
  }

  public open(): void {
    this.modalOpen = true;
    this.photoExist = false;
    this.modalService.open(this.modal, {size: 'lg'});
  }

  public close(closeModal) {
    closeModal();
    this.modalOpen = false;
  }

  public getPhoto() {
    let canvas = this.createPhoto();
    this.base64 = canvas.toDataURL(this.mime);
  }

  public createPhoto() {
    this.photoExist = true;
    const video = <any> document.getElementsByTagName('video')[0];
    const canvas = <any> document.getElementsByTagName('canvas')[0];
    if (video) {
      canvas.style.maxWidth = `${this.options.width}px`;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
    }
    return canvas;
  }

  public fileChangeEvent(e) {
    this.file = e.target.files;
    this.base64 = null;
  }

  public onCamError(err) {
    this.err = err;
  }

}
